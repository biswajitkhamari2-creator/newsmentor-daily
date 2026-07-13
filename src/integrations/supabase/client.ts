import { createClient } from "@supabase/supabase-js";

// Publishable / anon key — safe to ship in the client. RLS enforces access.
const SUPABASE_URL = "https://wiximqxpnkdfspkfdtpq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGltcXhwbmtkZnNwa2ZkdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NDg4MzcsImV4cCI6MjA5OTUyNDgzN30._2DAy5kHlWqGdEn5F-RbBV7NjLV1Z_pREv7v50AMmOg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
