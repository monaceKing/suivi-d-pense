import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { getYearlyRecap } from "@/lib/supabase/stats";

export default async function AnnualStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();

  const { categoryLines, byMonth, grandTotal } = await getYearlyRecap(year);
  const maxMonth = Math.max(...byMonth.map((m) => m.total), 1);
  const isCurrentYear = year === now.getFullYear();

  return (
    <>
      <AppHeader subtitle="Récap" title={`Année ${year}`} />
      <main className="px-5 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/stats/annuel?year=${year - 1}`}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            ← {year - 1}
          </Link>
          {!isCurrentYear && (
            <Link
              href={`/stats/annuel?year=${year + 1}`}
              className="rounded-full px-3 py-1.5 text-sm"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              {year + 1} →
            </Link>
          )}
        </div>

        {/* Évolution mois par mois */}
        <section>
          <h2
            className="ledger-rule pb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Par mois
          </h2>
          <div className="mt-3 flex items-end gap-1.5 h-32">
            {byMonth.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max((m.total / maxMonth) * 100, 2)}%`,
                    background: "var(--accent-gold)",
                  }}
                />
                <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Total par catégorie */}
        <section>
          <h2
            className="ledger-rule pb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Par catégorie
          </h2>
          {categoryLines.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Aucune dépense sur {year}.
            </p>
          ) : (
            <ul className="mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
              {categoryLines.map((line) => (
                <li key={line.categoryId ?? "none"} className="flex items-center gap-3 py-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                    style={{ background: line.color ?? "var(--bg-elevated-2)" }}
                  >
                    {line.icon}
                  </span>
                  <span className="flex-1 truncate">{line.name}</span>
                  <span className="tabular-figures">{line.total.toLocaleString("fr-FR")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className="ledger-rule flex items-center justify-between pt-3 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Total de l&apos;année</span>
          <span className="tabular-figures text-base" style={{ color: "var(--text-primary)" }}>
            {grandTotal.toLocaleString("fr-FR")} XOF
          </span>
        </section>
      </main>
    </>
  );
}