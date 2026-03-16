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

  const { error: deleteError } = await adminClient
    .from("organization_members")
    .delete()
    .eq("user_id", targetUserId)
    .eq("organization_id", callerMembership.organization_id);

  if (deleteError) {
    return { error: `Kunde inte ta bort anställd: ${deleteError.message}` };
  }

  revalidatePath("/dashboard/employees");
  return { success: true };
}
