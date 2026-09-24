"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { AppHeader } from "@/components/app-header";
import { localDB } from "@/lib/db/local-db";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
  const settingsRow = useLiveQuery(() => localDB.settings.get("current"), [], undefined);

  return (
    <>
      <AppHeader subtitle="Préférences" title="Réglages" />
      <main className="px-5 space-y-6">
        {settingsRow ? (
          <SettingsForm settings={settingsRow.value} />
        ) : (
          <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Chargement...
          </p>
        )}
      </main>
    </>
  );
}