import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Existing customer pages, photos, authentication, and payment functions live
// in this original project. These values are public browser credentials; access
// remains protected by the project's Row Level Security policies.
export const ORIGINAL_SUPABASE_URL = "https://fioykldgrzedxyxpgomf.supabase.co";
const ORIGINAL_SUPABASE_ANON_KEY = "__ORIGINAL_ANON_KEY__";

export const supabase = createClient<Database>(
  ORIGINAL_SUPABASE_URL,
  ORIGINAL_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);