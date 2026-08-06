import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis dans .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder mono-utilisateur — à remplacer par auth.uid() en Phase 9.
export const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000000";
