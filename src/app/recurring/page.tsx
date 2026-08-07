import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { getActiveRecurringExpenses } from "@/lib/supabase/recurring";

const FREQ_LABEL = { weekly: "Chaque semaine", monthly: "Chaque mois", yearly: "Chaque année" };

export default async function RecurringPage() {
  const recurring = await getActiveRecurringExpenses();

  return (
    <>
      <AppHeader subtitle="Abonnements, loyer..." title="Récurrentes" />
      <main className="px-5 space-y-4">
        <Link
          href="/recurring/new"
          className="block text-center rounded-(--radius-pill) py-3 font-medium"
          style={{ background: "var(--accent-gold)", color: "var(--bg)" }}
        >
          + Nouvelle récurrence
        </Link>

        {recurring.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Aucune dépense récurrente pour l&apos;instant.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recurring.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ background: r.category?.color ?? "var(--bg-elevated-2)" }}
                >
                  {r.category?.icon ?? "🔁"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{r.label}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {FREQ_LABEL[r.frequency]}
                  </p>
                </div>
                <p className="tabular-figures shrink-0">{r.currentAmount.toLocaleString("fr-FR")}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}