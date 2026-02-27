"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addBuildingAction(_prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Du måste vara inloggad för att utföra denna åtgärd." };
  }

  // Only admin/owner may insert buildings
  const { data: membership, error: memberError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single();

  if (memberError || !membership) {
    return { error: "Du har inte behörighet att lägga till byggnader." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";

  if (!name) {
    return { error: "Byggnadens namn är obligatoriskt." };
  }

  const { error: insertError } = await supabase.from("buildings").insert({
    organization_id: membership.organization_id,
    name,
    address: address || null,
  });

  if (insertError) {
    return { error: `Kunde inte spara byggnaden: ${insertError.message}` };
  }

  revalidatePath("/dashboard/buildings");
  return { success: true };
}
