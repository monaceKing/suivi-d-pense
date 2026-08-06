import { supabase, PLACEHOLDER_USER_ID } from "./client";
import type { Category } from "./types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .eq("archived", false)
    .order("name");

  if (error) throw error;
  return data;
}