"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { AppHeader } from "@/components/app-header";
import { localDB } from "@/lib/db/local-db";
import { computeMissingRecurring } from "@/lib/db/derive";
import { IncomeForm } from "@/components/income-form";
import { RecurringConfirmList } from "@/components/recurring-confirm";

const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date());

export default function HomePage() {
  // useLiveQuery relit la base locale (IndexedDB) et se met à jour tout
  // seul dès qu'elle change — pas besoin de refetch manuel.
  const expenses = useLiveQuery(() => localDB.expenses.toArray(), [], []);
  const settingsRow = useLiveQuery(() => localDB.settings.get("current"), [], undefined);
  const incomeRow = useLiveQuery(() => localDB.income.get("current"), [], undefined);
  const recurring = useLiveQuery(() => localDB.recurring.toArray(), [], []);

  // Tant que le cache local n'a jamais été rempli (tout premier lancement,
  // hors-ligne, avant toute synchro), on n'a rien à afficher de fiable.
  if (!settingsRow) {
    return (
      <>
        <AppHeader subtitle={capitalize(MONTH_LABEL)} title="Ce mois-ci" />
        <main className="px-5">
          <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Chargement...
          </p>
        </main>
      </>
    );
  }

  const settings = settingsRow.value;
  const income = incomeRow?.value ?? null;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const isSolde = settings.mode === "solde";

  const canCheckRecurring = !isSolde || Boolean(income);
  const missingRecurring = canCheckRecurring ? computeMissingRecurring(recurring, expenses) : [];

  return (
    <>
      <AppHeader subtitle={capitalize(MONTH_LABEL)} title="Ce mois-ci" />
      <main className="px-5 space-y-4">
        {isSolde && !income ? (
          <IncomeForm />
        ) : (
          <section
            className="rounded-(--radius-card) p-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {isSolde ? "Solde restant" : "Total dépensé"}
            </p>
            <p className="tabular-figures text-4xl mt-1" style={{ color: "var(--text-primary)" }}>
              {(isSolde ? (income?.amount ?? 0) - total : total).toLocaleString("fr-FR")}{" "}
              <span className="text-lg" style={{ color: "var(--text-secondary)" }}>XOF</span>
            </p>
          </section>
        )}

        <RecurringConfirmList items={missingRecurring} />

        <section>
          <h2
            className="ledger-rule pb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Dépenses récentes
          </h2>

          {expenses.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Rien pour l&apos;instant. Appuie sur + pour ajouter ta première dépense.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {expenses.map((e) => (
                <li key={e.id}>
                  <Link href={`/expenses/${e.id}`} className="flex items-center gap-3 py-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                      style={{ background: e.category?.color ?? "var(--bg-elevated-2)" }}
                    >
                      {e.category?.icon ?? "•"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{e.description || e.category?.name || "Sans catégorie"}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{e.expense_date}</p>
                    </div>
                    <p className="tabular-figures shrink-0">{e.amount.toLocaleString("fr-FR")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}