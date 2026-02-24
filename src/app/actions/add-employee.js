"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADJECTIVES = [
  "snabb", "noggrann", "glad", "duktig", "stark",
  "flink", "pigg", "lugn", "snygg", "fin",
];

function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj}${num}`;
}

function generatePassword(length = 12) {
  // Exclude ambiguous chars (0/O, 1/l/I) for readability
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function sanitizeUsername(raw) {
  return raw.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

export async function addEmployeeAction(_prevState, formData) {
  const supabase = await createClient();

  // 1. Verify the caller is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Du måste vara inloggad för att utföra denna åtgärd." };
  }

  // 2. Verify the caller is admin/owner in at least one organization
  const { data: membership, error: memberError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single();

  if (memberError || !membership) {
    return { error: "Du har inte behörighet att lägga till anställda." };
  }

  const orgId = membership.organization_id;

  // 3. Build credentials
  const nameInput = formData.get("name")?.toString().trim() ?? "";

  if (!nameInput) {
    return { error: "Namn är obligatoriskt." };
  }

  const rawUsername = formData.get("username")?.toString().trim() ?? "";
  const username = rawUsername ? sanitizeUsername(rawUsername) : generateUsername();

  if (!username) {
    return { error: "Ogiltigt användarnamn – använd bara bokstäver, siffror och understreck." };
  }

  const email = `${username}@cleanops.local`;
  const password = generatePassword();

  // 4. Create auth user via the Admin API (bypasses email confirmation)
  const adminClient = createAdminClient();

  const { data: newUserData, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: nameInput || username,
        username,
      },
    });

  if (createError) {
    const isDuplicate =
      createError.message.toLowerCase().includes("already") ||
      createError.message.toLowerCase().includes("unique");
    if (isDuplicate) {
      return { error: "Användarnamnet är redan taget. Välj ett annat." };
    }
    return { error: `Kunde inte skapa användare: ${createError.message}` };
  }

  const newUserId = newUserData.user.id;

  // 5. Add the new user to the organization as a cleaner
  // Use the admin client to bypass RLS — permission was already verified above.
  const { error: insertError } = await adminClient
    .from("organization_members")
    .insert({
      organization_id: orgId,
      user_id: newUserId,
      role: "cleaner",
    });

  if (insertError) {
    // Roll back the auth user so we don't leave orphaned accounts
    await adminClient.auth.admin.deleteUser(newUserId);
    return {
      error: `Kunde inte lägga till i organisation: ${insertError.message}`,
    };
  }

  // 6. Update the auto-created profile with name and active organization
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      name: nameInput,
      active_organization_id: orgId,
    })
    .eq("id", newUserId);

  if (profileError) {
    // Non-fatal: user and membership were created successfully.
    console.error("Profile update failed:", profileError.message);
  }

  // 7. Return the one-time credentials to display to the admin
  return {
    success: true,
    credentials: {
      name: nameInput,
      username,
      password,
    },
  };
}
