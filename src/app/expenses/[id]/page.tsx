import { AppHeader } from "@/components/app-header";
import { getExpenseById } from "@/lib/supabase/expenses";
import { getCategories } from "@/lib/supabase/categories";
import { EditExpenseForm } from "@/components/edit-expense-form";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [expense, categories] = await Promise.all([getExpenseById(id), getCategories()]);

  return (
    <>
      <AppHeader subtitle="Modifier" title="Dépense" />
      <main className="px-5">
        <EditExpenseForm expense={expense} categories={categories} />
      </main>
    </>
  );
}