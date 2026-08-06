import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { getMonthlyRecapByCategory } from "@/lib/supabase/stats";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();
  const month = Number(params.month) || now.getMonth() + 1; // 1-12

  const { lines, grandTotal } = await getMonthlyRecapByCategory(year, month);
  const monthLabel = capitalize(
    new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
      new Date(year, month - 1, 1),
    ),
  );

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <>
      <AppHeader subtitle="Récap" title={monthLabel} />
      <main className="px-5 space-y-4">
        <Link
          href="/stats/annuel"
          className="text-sm underline"
          style={{ color: "var(--text-secondary)" }}
        >
          Voir le récap annuel →
        </Link>

        <div className="flex items-center justify-between">
          <Link
            href={`/stats?year=${prev.year}&month=${prev.month}`}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            ← {monthShortLabel(prev.year, prev.month)}
          </Link>
          {!isCurrentMonth && (
            <Link
              href={`/stats?year=${next.year}&month=${next.month}`}
              className="rounded-full px-3 py-1.5 text-sm"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              {monthShortLabel(next.year, next.month)} →
            </Link>
          )}
        </div>

        {lines.length === 0 ? (
          <p
            className="py-8 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Aucune dépense sur ce mois.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {lines.map((line) => {
              const percent =
                grandTotal > 0
                  ? Math.round((line.total / grandTotal) * 100)
                  : 0;
              return (
                <li key={line.categoryId ?? "none"} className="py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                      style={{
                        background: line.color ?? "var(--bg-elevated-2)",
                      }}
                    >
                      {line.icon}
                    </span>
                    <span className="flex-1 truncate">{line.name}</span>
                    <span className="tabular-figures">
                      {line.total.toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div
                    className="mt-2 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-elevated-2)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        background: line.color ?? "var(--accent-gold)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <section
          className="ledger-rule flex items-center justify-between pt-3 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Total du mois</span>
          <span
            className="tabular-figures text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {grandTotal.toLocaleString("fr-FR")} XOF
          </span>
        </section>
      </main>
    </>
  );
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function monthShortLabel(year: number, month: number) {
  return capitalize(
    new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(
      new Date(year, month - 1, 1),
    ),
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
