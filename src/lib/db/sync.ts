import { localDB } from "./local-db";
import { supabase, PLACEHOLDER_USER_ID } from "@/lib/supabase/client";
import { getCategories } from "@/lib/supabase/categories";
import { getCurrentMonthExpenses } from "@/lib/supabase/expenses";
import { getSettings } from "@/lib/supabase/settings";
import { getCurrentMonthIncome } from "@/lib/supabase/incomes";
import { getActiveRecurringExpenses } from "@/lib/supabase/recurring";

// Recopie les données fraîches de Supabase dans le cache local.
// À appeler quand on est en ligne (au chargement des pages concernées).
export async function pullAll() {
  const [categories, expenses, settings, income, recurring] = await Promise.all([
    getCategories(),
    getCurrentMonthExpenses(),
    getSettings(),
    getCurrentMonthIncome(),
    getActiveRecurringExpenses(),
  ]);

  await localDB.transaction(
    "rw",
    [localDB.categories, localDB.expenses, localDB.recurring, localDB.settings, localDB.income],
    async () => {
      await localDB.categories.clear();
      await localDB.categories.bulkAdd(categories);

      await localDB.expenses.clear();
      await localDB.expenses.bulkAdd(expenses);

      await localDB.recurring.clear();
      await localDB.recurring.bulkAdd(recurring);

      await localDB.settings.put({ key: "current", value: settings });
      await localDB.income.put({ key: "current", value: income });
    }
  );
}

// Envoie les dépenses en attente vers Supabase, une par une.
// Si une échoue (toujours hors-ligne, ou vraie erreur), elle reste en file
// pour la prochaine tentative — on n'abandonne jamais silencieusement.
export async function flushOutbox() {
  const pending = await localDB.outbox.toArray();

  for (const item of pending) {
    try {
      const { error } = await supabase.from("expenses").insert({
        user_id: PLACEHOLDER_USER_ID,
        category_id: item.categoryId,
        amount: item.amount,
        description: item.description || null,
      });
      if (error) throw error;
      await localDB.outbox.delete(item.localId);
      await localDB.expenses.delete(item.localId);
    } catch {
      break;
    }
  }

  if (pending.length > 0) {
    const expenses = await getCurrentMonthExpenses();
    await localDB.expenses.clear();
    await localDB.expenses.bulkAdd(expenses);
  }
}