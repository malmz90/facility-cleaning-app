"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createOrganizationAction(_prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim();

  if (!name) {
    return { error: "Organisationsnamn krävs." };
  }

  const { error } = await supabase.rpc("create_organization_with_owner", {
    p_name: name,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
