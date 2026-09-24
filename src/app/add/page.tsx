"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { AppHeader } from "@/components/app-header";
import { localDB } from "@/lib/db/local-db";
import { ExpenseForm } from "@/components/expense-form";

export default function AddExpensePage() {
  const categories = useLiveQuery(() => localDB.categories.toArray(), [], []);

  return (
    <>
      <AppHeader subtitle="Nouvelle entrée" title="Ajouter" />
      <main className="px-5">
        <ExpenseForm categories={categories} />
      </main>
    </>
  );
}