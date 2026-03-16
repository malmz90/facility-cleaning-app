"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateEmployeeNameAction(_prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Du måste vara inloggad för att utföra denna åtgärd." };
  }

  // Verify caller is owner or admin
  const { data: callerMembership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single();

  if (!callerMembership) {
    return { error: "Du har inte behörighet att redigera anställda." };
  }

  const targetUserId = formData.get("userId")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";

  if (!targetUserId) return { error: "Ogiltigt användar-ID." };
  if (!name) return { error: "Namn är obligatoriskt." };

  // Verify target belongs to the same organization
  const { data: targetMembership } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("user_id", targetUserId)
    .eq("organization_id", callerMembership.organization_id)
    .single();

  if (!targetMembership) {
    return { error: "Anställd hittades inte i din organisation." };
  }

  const adminClient = createAdminClient();

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ name })
    .eq("id", targetUserId);

  if (updateError) {
    return { error: `Kunde inte uppdatera namn: ${updateError.message}` };
  }

  revalidatePath("/dashboard/employees");
  return { success: true };
}

export async function removeEmployeeAction(_prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Du måste vara inloggad för att utföra denna åtgärd." };
  }

  // Verify caller is owner or admin
  const { data: callerMembership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single();

  if (!callerMembership) {
    return { error: "Du har inte behörighet att ta bort anställda." };
  }

  const targetUserId = formData.get("userId")?.toString().trim() ?? "";

  if (!targetUserId) return { error: "Ogiltigt användar-ID." };
  if (targetUserId === user.id) {
    return { error: "Du kan inte ta bort dig själv från organisationen." };
  }

  // Verify target belongs to the same organization and get their role
  const { data: targetMembership } = await supabase
    .from("organization_members")
    .select("user_id, role")
    .eq("user_id", targetUserId)
    .eq("organization_id", callerMembership.organization_id)
    .single();

  if (!targetMembership) {
    return { error: "Anställd hittades inte i din organisation." };
  }

  if (targetMembership.role === "owner") {
    return { error: "Ägare kan inte tas bort från organisationen." };
  }

  const adminClient = createAdminClient();

  // Step 1: Remove from this organization.
  const { error: deleteError } = await adminClient
    .from("organization_members")
    .delete()
    .eq("user_id", targetUserId)
    .eq("organization_id", callerMembership.organization_id);

  if (deleteError) {
    return { error: `Kunde inte ta bort anställd: ${deleteError.message}` };
  }

  // Step 2: Check if the user still belongs to any other organization.
  // If they were a fake (cleanops.local) account with no other memberships,
  // delete the auth user entirely — this cascades to the profiles table
  // and any other rows that reference auth.users with ON DELETE CASCADE.
  const { data: remainingMemberships } = await adminClient
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", targetUserId)
    .limit(1);

  const hasOtherOrgs =
    Array.isArray(remainingMemberships) && remainingMemberships.length > 0;

  if (!hasOtherOrgs) {
    const { error: authDeleteError } =
      await adminClient.auth.admin.deleteUser(targetUserId);

    if (authDeleteError) {
      // Membership was already removed — log but don't surface as a hard error.
      console.error(
        "Auth user deletion failed after membership removal:",
        authDeleteError.message,
      );
    }
  }

  revalidatePath("/dashboard/employees");
  return { success: true };
}
