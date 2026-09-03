// actions/family-actions.ts
"use server";

import { createClient } from "@/utils/supabase";

/**
 * Fetch family registration resources (Resident ID / Marriage Certificate guides)
 */
export async function getFamilyRegistrations(type?: "resident_id" | "marriage_cert") {
  const supabase = await createClient();
  
  let query = supabase
    .from("family_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching family registrations:", error);
    return [];
  }
  
  return data || [];
}
