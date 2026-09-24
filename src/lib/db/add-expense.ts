import { addExpense as addExpenseOnline } from "@/lib/supabase/expenses";
import { PLACEHOLDER_USER_ID } from "@/lib/supabase/client";
import { localDB } from "./local-db";
import type { Category } from "@/lib/supabase/types";

export async function addExpenseOfflineFirst(input: {
  amount: number;
  categoryId: string | null;
  description: string;
  categories: Category[];
}): Promise<{ queued: boolean }> {
  if (navigator.onLine) {
    // On laisse l'erreur remonter telle quelle si ça échoue pour une vraie
    // raison (pas juste "pas de réseau") — pas de mise en file silencieuse
    // qui masquerait un vrai problème.
    await addExpenseOnline({
      amount: input.amount,
      categoryId: input.categoryId,
      description: input.description,
    });
    return { queued: false };
  }

  // Hors-ligne : on met en file, et on l'affiche tout de suite quand même
  // (optimiste) en l'ajoutant directement au cache local des dépenses.
  const localId = crypto.randomUUID();
  const today = new Date().toISOString().slice(0, 10);
  const category = input.categories.find((c) => c.id === input.categoryId) ?? null;

  await localDB.outbox.add({
    localId,
    amount: input.amount,
    categoryId: input.categoryId,
    description: input.description,
    createdAt: new Date().toISOString(),
  });

  await localDB.expenses.add({
    id: localId,
    user_id: PLACEHOLDER_USER_ID,
    category_id: input.categoryId,
    recurring_id: null,
    recurring_amount_id: null,
    amount: input.amount,
    currency: "XOF",
    description: input.description || null,
    expense_date: today,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: category ? { name: category.name, icon: category.icon, color: category.color } : null,
  });

  return { queued: true };
}