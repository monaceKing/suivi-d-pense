import { supabase, PLACEHOLDER_USER_ID } from "./client";
import type { Expense, Category } from "./types";

export type ExpenseWithCategory = Expense & {
  category: Pick<Category, "name" | "icon" | "color"> | null;
};

// year: année pleine (2026), month: 1-12 (pas 0-indexé, contrairement à Date.getMonth())
export async function getExpensesForMonth(year: number, month: number): Promise<ExpenseWithCategory[]> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("expenses")
    .select("*, category:categories(name, icon, color)")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .gte("expense_date", start)
    .lt("expense_date", end)
    .order("expense_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCurrentMonthExpenses(): Promise<ExpenseWithCategory[]> {
  const now = new Date();
  return getExpensesForMonth(now.getFullYear(), now.getMonth() + 1);
}

export async function getExpensesForYear(year: number): Promise<ExpenseWithCategory[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, category:categories(name, icon, color)")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .gte("expense_date", `${year}-01-01`)
    .lt("expense_date", `${year + 1}-01-01`)
    .order("expense_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addExpense(input: {
  amount: number;
  categoryId: string | null;
  description: string;
}) {
  const { error } = await supabase.from("expenses").insert({
    user_id: PLACEHOLDER_USER_ID,
    category_id: input.categoryId,
    amount: input.amount,
    description: input.description || null,
    // pas de expense_date : la colonne défaut à current_date,
    // ce qui respecte la règle "création sur le mois en cours uniquement"
  });

  if (error) throw error;
}

export async function getExpenseById(id: string): Promise<ExpenseWithCategory> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, category:categories(name, icon, color)")
    .eq("id", id)
    .eq("user_id", PLACEHOLDER_USER_ID)
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(
  id: string,
  changes: { amount: number; categoryId: string | null; description: string }
) {
  const { error } = await supabase
    .from("expenses")
    .update({
      amount: changes.amount,
      category_id: changes.categoryId,
      description: changes.description || null,
    })
    .eq("id", id)
    .eq("user_id", PLACEHOLDER_USER_ID);

  if (error) throw error;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", PLACEHOLDER_USER_ID);

  if (error) throw error;
}