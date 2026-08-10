"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/supabase/types";
import { addRecurringExpense } from "@/lib/supabase/recurring";

const WEEKDAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
type Frequency = "weekly" | "monthly";

export function RecurringForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addRecurringExpense({
        label,
        categoryId,
        frequency,
        amount: Number(amount),
        dayOfMonth: frequency === "weekly" ? null : Number(dayOfMonth),
        dayOfWeek: frequency === "weekly" ? Number(dayOfWeek) : null,
      });
      router.push("/recurring");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Échec de la création, réessaie.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Nom
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Loyer, Netflix, ..."
          required
          className="mt-1 w-full rounded-(--radius-card) p-3 outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
      </div>

      <div>
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Montant (XOF)
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          required
          className="tabular-figures mt-1 w-full rounded-(--radius-card) p-3 text-2xl outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
      </div>

      <div>
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Fréquence
        </label>
        <div
          className="mt-2 inline-flex rounded-(--radius-pill) p-1"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          {(["weekly", "monthly"] as Frequency[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className="rounded-(--radius-pill) px-4 py-1.5 text-sm cursor-pointer"
              style={{
                background: frequency === f ? "var(--accent-gold)" : "transparent",
                color: frequency === f ? "var(--bg)" : "var(--text-primary)",
              }}
            >
              {f === "weekly" ? "Hebdo" : "Mensuel"}
            </button>
          ))}
        </div>
      </div>

      {frequency === "weekly" ? (
        <div>
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Jour de la semaine
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {WEEKDAYS_SHORT.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => setDayOfWeek(String(i))}
                className="rounded-(--radius-pill) px-4 py-2 text-sm cursor-pointer"
                style={{
                  background: dayOfWeek === String(i) ? "var(--accent-gold)" : "var(--bg-elevated)",
                  color: dayOfWeek === String(i) ? "var(--bg)" : "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Jour du mois
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            required
            className="mt-1 w-full rounded-(--radius-card) p-3 outline-none"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          />
        </div>
      )}

      <div>
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Catégorie
        </label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className="flex flex-col items-center gap-1 rounded-(--radius-card) py-2 text-xs cursor-pointer"
              style={{
                background: "var(--bg-elevated)",
                border: `1.5px solid ${categoryId === cat.id ? "var(--accent-gold)" : "var(--border)"}`,
              }}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="truncate w-full text-center" style={{ color: "var(--text-secondary)" }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--accent-expense)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-(--radius-pill) py-3 font-medium disabled:opacity-50"
        style={{ background: "var(--accent-gold)", color: "var(--bg)" }}
      >
        {submitting ? "..." : "Créer"}
      </button>
    </form>
  );
}