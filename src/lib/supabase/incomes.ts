import { supabase, PLACEHOLDER_USER_ID } from "./client";
import type { Income } from "./types";

export async function getCurrentMonthIncome(): Promise<Income | null> {
  const now = new Date();
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .eq("month", now.getMonth() + 1)
    .eq("year", now.getFullYear())
    .maybeSingle(); // 0 ou 1 ligne — pas d'erreur si le revenu n'est pas encore saisi

  if (error) throw error;
  return data;
}

export async function addIncome(amount: number) {
  const now = new Date();
  const { error } = await supabase.from("incomes").insert({
    user_id: PLACEHOLDER_USER_ID,
    amount,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  if (error) throw error;
}