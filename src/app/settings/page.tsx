import { AppHeader } from "@/components/app-header";
import { getSettings } from "@/lib/supabase/settings";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <AppHeader subtitle="Préférences" title="Réglages" />
      <main className="px-5 space-y-6">
        <SettingsForm settings={settings} />
      </main>
    </>
  );
}