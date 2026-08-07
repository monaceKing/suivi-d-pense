// Types miroir des tables Supabase (schema_supabase.sql).
// Reste à typer : `budgets` (Phase 4).

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

export type RecurringExpense = {
  id: string;
  user_id: string;
  category_id: string | null;
  label: string;
  frequency: "weekly" | "monthly" | "yearly";
  day_of_month: number | null;
  day_of_week: number | null;
  start_date: string;
  end_date: string | null;
  active: boolean;
  last_generated_date: string | null;
  created_at: string;
};

export type RecurringExpenseAmount = {
  id: string;
  recurring_id: string;
  amount: number;
  currency: string;
  valid_from: string;
  created_at: string;
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