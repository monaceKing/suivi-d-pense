import { supabase, PLACEHOLDER_USER_ID } from "./client";
import type { Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .single(); // une seule ligne attendue (contrainte unique sur user_id)

  if (error) throw error;
  return data;
}
