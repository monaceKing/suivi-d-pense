"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { updateSettings } from "@/lib/supabase/settings";
import { resetCurrentMonth } from "@/lib/supabase/reset";
import type { Settings } from "@/lib/supabase/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const { preference, setPreference } = useTheme();
  const [resetting, setResetting] = useState(false);

  async function handleModeChange(mode: Settings["mode"]) {
    await updateSettings({ mode });
    router.refresh(); // pour que l'accueil reflète le nouveau mode
  }

  async function handleThemeChange(theme: Settings["theme"]) {
    setPreference(theme); // applique tout de suite (localStorage)
    await updateSettings({ theme }); // persiste en base
  }

  async function handleReset() {
    if (
      !confirm(
        "Supprimer toutes les dépenses ET le revenu du mois en cours ? Irréversible.",
      )
    )
      return;
    if (!confirm("Vraiment sûr ? Cette action ne peut pas être annulée."))
      return;

    setResetting(true);
    try {
      await resetCurrentMonth();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Échec de la réinitialisation, réessaie.");
      setResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          Mode
        </p>
        <SegmentedControl
          value={settings.mode}
          options={[
            { value: "solde", label: "Solde" },
            { value: "cumul", label: "Cumul" },
          ]}
          onChange={handleModeChange}
        />
      </div>

      <div>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          Thème
        </p>
        <SegmentedControl
          value={preference}
          options={[
            { value: "light", label: "Clair" },
            { value: "dark", label: "Sombre" },
            { value: "system", label: "Système" },
          ]}
          onChange={handleThemeChange}
        />
      </div>

      <div>
        <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
          Devise
        </p>
        <p>
          {settings.default_currency} — multi-devises prévu plus tard (Phase 8)
        </p>
      </div>

      <div className="ledger-rule pt-6">
        <p className="text-sm mb-2" style={{ color: "var(--accent-expense)" }}>
          Zone dangereuse
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="w-full rounded-(--radius-pill) py-3 font-medium disabled:opacity-50 cursor-pointer"
          style={{
            background: "transparent",
            color: "var(--accent-expense)",
            border: "1px solid var(--accent-expense)",
          }}
        >
          {resetting ? "..." : "Réinitialiser le mois en cours"}
        </button>
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="inline-flex rounded-(--radius-pill) p-1"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-(--radius-pill) px-4 py-1.5 text-sm cursor-pointer"
          style={{
            background:
              value === opt.value ? "var(--accent-gold)" : "transparent",
            color: value === opt.value ? "var(--bg)" : "var(--text-primary)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
