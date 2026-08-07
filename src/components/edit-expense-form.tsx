"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/supabase/types";
import type { ExpenseWithCategory } from "@/lib/supabase/expenses";
import { updateExpense, deleteExpense } from "@/lib/supabase/expenses";

export function EditExpenseForm({
  expense,
  categories,
}: {
  expense: ExpenseWithCategory;
  categories: Category[];
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(expense.category_id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateExpense(expense.id, { amount: Number(amount), categoryId, description });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Échec de la modification, réessaie.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cette dépense ?")) return;
    setSubmitting(true);
    try {
      await deleteExpense(expense.id);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Échec de la suppression, réessaie.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Description (optionnel)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-(--radius-card) p-3 outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
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
        {submitting ? "..." : "Enregistrer"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={submitting}
        className="w-full rounded-(--radius-pill) py-3 font-medium disabled:opacity-50"
        style={{ background: "transparent", color: "var(--accent-expense)", border: "1px solid var(--accent-expense)" }}
      >
        Supprimer
      </button>
    </form>
  );
}