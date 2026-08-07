import { supabase, PLACEHOLDER_USER_ID } from "./client";
import type { RecurringExpense } from "./types";

export async function addRecurringExpense(input: {
  label: string;
  categoryId: string | null;
  frequency: RecurringExpense["frequency"];
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  amount: number;
}) {
  // 1. La définition de la série (sans montant)
  const { data: recurring, error: recurringError } = await supabase
    .from("recurring_expenses")
    .insert({
      user_id: PLACEHOLDER_USER_ID,
      label: input.label,
      category_id: input.categoryId,
      frequency: input.frequency,
      day_of_month: input.dayOfMonth,
      day_of_week: input.dayOfWeek,
    })
    .select()
    .single();

  if (recurringError) throw recurringError;

  // 2. Sa première version de montant, rattachée par recurring_id
  const { error: amountError } = await supabase.from("recurring_expense_amounts").insert({
    recurring_id: recurring.id,
    amount: input.amount,
  });

  if (amountError) throw amountError;

  return recurring as RecurringExpense;
}

export type RecurringWithCurrentAmount = RecurringExpense & {
  category: { name: string; icon: string | null; color: string | null } | null;
  currentAmount: number;
  currentAmountId: string;
};

export async function getActiveRecurringExpenses(): Promise<RecurringWithCurrentAmount[]> {
  const { data: recurrences, error: recurrencesError } = await supabase
    .from("recurring_expenses")
    .select("*, category:categories(name, icon, color)")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .eq("active", true)
    .order("created_at");

  if (recurrencesError) throw recurrencesError;
  if (recurrences.length === 0) return [];

  // On récupère tous les montants de toutes les récurrences d'un coup (plutôt
  // qu'une requête par récurrence), triés du plus récent au plus ancien :
  // le premier montant rencontré par recurring_id est donc le montant courant.
  const ids = recurrences.map((r) => r.id);
  const { data: amounts, error: amountsError } = await supabase
    .from("recurring_expense_amounts")
    .select("id, recurring_id, amount, valid_from")
    .in("recurring_id", ids)
    .order("valid_from", { ascending: false });

  if (amountsError) throw amountsError;

  const currentAmountByRecurring = new Map<string, { id: string; amount: number }>();
  for (const a of amounts) {
    if (!currentAmountByRecurring.has(a.recurring_id)) {
      currentAmountByRecurring.set(a.recurring_id, { id: a.id, amount: a.amount });
    }
  }

  return recurrences.map((r) => ({
    ...r,
    currentAmount: currentAmountByRecurring.get(r.id)?.amount ?? 0,
    currentAmountId: currentAmountByRecurring.get(r.id)?.id ?? "",
  }));
}

// Récurrences actives qui n'ont pas encore de dépense enregistrée ce mois-ci.
export async function getMissingRecurringForCurrentMonth(): Promise<RecurringWithCurrentAmount[]> {
  const active = await getActiveRecurringExpenses();
  if (active.length === 0) return [];

  const now = new Date();
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const end =
    now.getMonth() === 11
      ? `${now.getFullYear() + 1}-01-01`
      : `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, "0")}-01`;

  const { data: existing, error } = await supabase
    .from("expenses")
    .select("recurring_id")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .gte("expense_date", start)
    .lt("expense_date", end)
    .not("recurring_id", "is", null);

  if (error) throw error;

  const doneIds = new Set(existing.map((e) => e.recurring_id));
  return active.filter((r) => !doneIds.has(r.id));
}

// Confirme une occurrence : crée la dépense, et si le montant a changé,
// versionne d'abord recurring_expense_amounts (historique jamais écrasé).
export async function confirmRecurringOccurrence(
  recurring: RecurringWithCurrentAmount,
  confirmedAmount: number
) {
  let recurringAmountId = recurring.currentAmountId;

  if (confirmedAmount !== recurring.currentAmount) {
    const { data: newAmount, error: amountError } = await supabase
      .from("recurring_expense_amounts")
      .insert({ recurring_id: recurring.id, amount: confirmedAmount })
      .select()
      .single();
    if (amountError) throw amountError;
    recurringAmountId = newAmount.id;
  }

  const { error: expenseError } = await supabase.from("expenses").insert({
    user_id: PLACEHOLDER_USER_ID,
    category_id: recurring.category_id,
    recurring_id: recurring.id,
    recurring_amount_id: recurringAmountId,
    amount: confirmedAmount,
    description: recurring.label,
  });
  if (expenseError) throw expenseError;
}