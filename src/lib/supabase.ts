import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

let client: SupabaseClient | null = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_key_here") {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase URL or Anon Key is missing or invalid. Check your .env.local file.");
}

export const supabase = client;
