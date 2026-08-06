import { getExpensesForMonth, getExpensesForYear } from "./expenses";

export type CategoryRecapLine = {
  categoryId: string | null;
  name: string;
  icon: string | null;
  color: string | null;
  total: number;
};

export async function getMonthlyRecapByCategory(year: number, month: number) {
  const expenses = await getExpensesForMonth(year, month);

  const byCategory = new Map<string, CategoryRecapLine>();
  for (const e of expenses) {
    const key = e.category_id ?? "none";
    const existing = byCategory.get(key);
    if (existing) {
      existing.total += e.amount;
    } else {
      byCategory.set(key, {
        categoryId: e.category_id,
        name: e.category?.name ?? "Sans catégorie",
        icon: e.category?.icon ?? "➕",
        color: e.category?.color ?? null,
        total: e.amount,
      });
    }
  }

  const lines = Array.from(byCategory.values()).sort((a, b) => b.total - a.total);
  const grandTotal = lines.reduce((sum, l) => sum + l.total, 0);
  return { lines, grandTotal };
}

const MONTH_ABBR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

export async function getYearlyRecap(year: number) {
  const expenses = await getExpensesForYear(year);

  // Par catégorie — même logique que le récap mensuel
  const byCategory = new Map<string, CategoryRecapLine>();
  // Par mois — un total par mois de l'année, dans l'ordre
  const byMonth = MONTH_ABBR.map((label) => ({ label, total: 0 }));

  for (const e of expenses) {
    const key = e.category_id ?? "none";
    const existingCat = byCategory.get(key);
    if (existingCat) {
      existingCat.total += e.amount;
    } else {
      byCategory.set(key, {
        categoryId: e.category_id,
        name: e.category?.name ?? "Sans catégorie",
        icon: e.category?.icon ?? "➕",
        color: e.category?.color ?? null,
        total: e.amount,
      });
    }

    // expense_date au format "YYYY-MM-DD" : les caractères 5-6 donnent le mois (01-12)
    const monthIndex = Number(e.expense_date.slice(5, 7)) - 1;
    byMonth[monthIndex].total += e.amount;
  }

  const categoryLines = Array.from(byCategory.values()).sort((a, b) => b.total - a.total);
  const grandTotal = categoryLines.reduce((sum, l) => sum + l.total, 0);
  return { categoryLines, byMonth, grandTotal };
}