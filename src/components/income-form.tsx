"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addIncome } from "@/lib/supabase/incomes";

export function IncomeForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await addIncome(Number(amount));
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-(--radius-card) p-5 space-y-3"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Aucun revenu saisi pour ce mois. En mode solde, les dépenses ne peuvent
        pas être déduites sans ça.
      </p>
      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Revenu du mois (XOF)"
        required
        className="tabular-figures w-full rounded-(--radius-card) p-3 outline-none"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-(--radius-pill) py-3 font-medium disabled:opacity-50"
        style={{ background: "var(--accent-gold)", color: "var(--bg)" }}
      >
        {submitting ? "..." : "Valider"}
      </button>
    </form>
  );
}
