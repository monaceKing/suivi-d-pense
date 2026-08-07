"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmRecurringOccurrence, type RecurringWithCurrentAmount } from "@/lib/supabase/recurring";

export function RecurringConfirmList({ items }: { items: RecurringWithCurrentAmount[] }) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
        À confirmer ce mois-ci
      </h2>
      {items.map((item) => (
        <RecurringConfirmCard key={item.id} item={item} />
      ))}
    </section>
  );
}

function RecurringConfirmCard({ item }: { item: RecurringWithCurrentAmount }) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(item.currentAmount));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      await confirmRecurringOccurrence(item, Number(amount));
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Échec, réessaie.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-(--radius-card) p-4 space-y-3"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ background: item.category?.color ?? "var(--bg-elevated-2)" }}
        >
          {item.category?.icon ?? "🔁"}
        </span>
        <span className="flex-1">{item.label}</span>
      </div>

      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        className="tabular-figures w-full rounded-(--radius-card) p-3 outline-none"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
      />

      {error && (
        <p className="text-sm" style={{ color: "var(--accent-expense)" }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full rounded-(--radius-pill) py-2.5 font-medium disabled:opacity-50"
        style={{ background: "var(--accent-gold)", color: "var(--bg)" }}
      >
        {submitting ? "..." : "Confirmer"}
      </button>
    </div>
  );
}