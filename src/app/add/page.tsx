import { AppHeader } from "@/components/app-header";
import { getCategories } from "@/lib/supabase/categories";
import { ExpenseForm } from "@/components/expense-form";

export default async function AddExpensePage() {
  const categories = await getCategories();

  return (
    <>
      <AppHeader subtitle="Nouvelle entrée" title="Ajouter" />
      <main className="px-5 pointer-events-auto">
        <ExpenseForm categories={categories} />
      </main>
    </>
  );
}