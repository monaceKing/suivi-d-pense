import type { ExpenseWithCategory } from "@/lib/supabase/expenses";
import type { RecurringWithCurrentAmount } from "@/lib/supabase/recurring";

// Récurrences actives sans dépense correspondante ce mois-ci — même logique
// que getMissingRecurringForCurrentMonth, mais sur les données déjà en cache
// (donc utilisable hors-ligne, contrairement à la version Supabase).
export function computeMissingRecurring(
  recurring: RecurringWithCurrentAmount[],
  expensesThisMonth: ExpenseWithCategory[]
): RecurringWithCurrentAmount[] {
  const doneIds = new Set(expensesThisMonth.map((e) => e.recurring_id).filter(Boolean));
  return recurring.filter((r) => !doneIds.has(r.id));
}