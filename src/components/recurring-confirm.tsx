"use client";

import { useState } from "react";
import { confirmRecurringOccurrence, type RecurringWithCurrentAmount } from "@/lib/supabase/recurring";
import { useRouter } from "next/navigation";

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
  const [amount, setAmount] = useState(String(item.currentAmount));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);

    try {
      await confirmRecurringOccurrence(item, Number(amount));
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Tu dois être en ligne pour confirmer.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">{item.label}</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {item.frequency ?? "Mensuel"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-24 rounded border px-2 py-1 text-right"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            aria-label={`Montant pour ${item.label}`}
          />
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Confirmation..." : "Confirmer"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
