import { AppHeader } from "@/components/app-header";
import { getCategories } from "@/lib/supabase/categories";
import { RecurringForm } from "@/components/recurring-form";

export default async function NewRecurringPage() {
  const categories = await getCategories();

  return (
    <>
      <AppHeader subtitle="Récurrence" title="Nouvelle" />
      <main className="px-5">
        <RecurringForm categories={categories} />
      </main>
    </>
  );
}