"use server";

import { createSupabaseServer } from "@/lib/supabase-server";


export async function getCategories() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("project_categories")
    .select("id, name")
    .order("name");
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
