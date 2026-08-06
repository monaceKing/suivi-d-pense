// Types miroir des tables Supabase (schema_supabase.sql).
// On ne type ici que les tables utilisées en Phase 1 ; les autres
// (recurring_expenses, recurring_expense_amounts, budgets...) seront
// ajoutées au fichier quand on les branchera.

export type Category = {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  archived: boolean;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  category_id: string | null;
  recurring_id: string | null;
  recurring_amount_id: string | null;
  amount: number;
  currency: string;
  description: string | null;
  expense_date: string; // format "YYYY-MM-DD" (colonne `date` côté Postgres)
  created_at: string;
  updated_at: string;
};

export type Income = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  label: string | null;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  id: string;
  user_id: string;
  mode: "solde" | "cumul";
  default_currency: string;
  reminder_days: number;
  theme: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
};