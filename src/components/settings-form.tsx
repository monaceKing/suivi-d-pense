"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { updateSettings } from "@/lib/supabase/settings";
import type { Settings } from "@/lib/supabase/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const { preference, setPreference } = useTheme();

  async function handleModeChange(mode: Settings["mode"]) {
    await updateSettings({ mode });
    router.refresh(); // pour que l'accueil reflète le nouveau mode
  }

  async function handleThemeChange(theme: Settings["theme"]) {
    setPreference(theme); // applique tout de suite (localStorage)
    await updateSettings({ theme }); // persiste en base
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
        <p>{settings.default_currency} — multi-devises prévu plus tard (Phase 8)</p>
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
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-(--radius-pill) px-4 py-1.5 text-sm cursor-pointer"
          style={{
            background: value === opt.value ? "var(--accent-gold)" : "transparent",
            color: value === opt.value ? "var(--bg)" : "var(--text-primary)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}