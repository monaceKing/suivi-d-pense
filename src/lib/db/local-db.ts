import Dexie, { type EntityTable } from "dexie";
import type { Category, Settings, Income } from "@/lib/supabase/types";
import type { ExpenseWithCategory } from "@/lib/supabase/expenses";
import type { RecurringWithCurrentAmount } from "@/lib/supabase/recurring";

// Une dépense en attente d'envoi : mêmes champs qu'une insertion classique,
// + un id local temporaire pour l'afficher tout de suite (optimiste).
export type OutboxExpense = {
  localId: string; // uuid généré côté client, jamais envoyé à Supabase
  amount: number;
  categoryId: string | null;
  description: string;
  createdAt: string;
};

// Table clé-valeur à une seule ligne, pour cacher settings (objet unique).
type CachedSettings = { key: "current"; value: Settings };
// Même principe pour le revenu du mois en cours (peut être absent → null).
type CachedIncome = { key: "current"; value: Income | null };

class LocalDB extends Dexie {
  categories!: EntityTable<Category, "id">;
  expenses!: EntityTable<ExpenseWithCategory, "id">;
  recurring!: EntityTable<RecurringWithCurrentAmount, "id">;
  settings!: EntityTable<CachedSettings, "key">;
  income!: EntityTable<CachedIncome, "key">;
  outbox!: EntityTable<OutboxExpense, "localId">;

  constructor() {
    super("suivi-local-db");
    this.version(1).stores({
      categories: "id",
      expenses: "id, expense_date",
      recurring: "id",
      settings: "key",
      income: "key",
      outbox: "localId",
    });
  }
}

export const localDB = new LocalDB();