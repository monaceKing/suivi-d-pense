import { AppHeader } from "@/components/app-header";

export default function SettingsPage() {
  return (
    <>
      <AppHeader subtitle="Préférences" title="Réglages" />
      <main className="px-5">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Mode solde/cumul, thème, devise — branché sur la table `settings` en Phase 1.
        </p>
      </main>
    </>
  );
}
