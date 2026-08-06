import { AppHeader } from "@/components/app-header";
import { getCategories } from "@/lib/supabase/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AppHeader subtitle="Gestion" title="Catégories" />
      <main className="px-5 space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-(--radius-card) p-3"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
              style={{ background: cat.color ?? "var(--bg-elevated-2)" }}
            >
              {cat.icon}
            </span>
            <span>{cat.name}</span>
          </div>
        ))}
      </main>
    </>
  );
}