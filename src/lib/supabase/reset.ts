import { supabase, PLACEHOLDER_USER_ID } from "./client";

export async function resetCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const { error: expensesError } = await supabase
    .from("expenses")
    .delete()
    .eq("user_id", PLACEHOLDER_USER_ID)
    .gte("expense_date", start)
    .lt("expense_date", end);
  if (expensesError) throw expensesError;

  const { error: incomeError } = await supabase
    .from("incomes")
    .delete()
    .eq("user_id", PLACEHOLDER_USER_ID)
    .eq("month", month)
    .eq("year", year);
  if (incomeError) throw incomeError;
}
