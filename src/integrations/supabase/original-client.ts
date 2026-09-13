import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Existing customer pages, photos, authentication, and payment functions live
// in this original project. These values are public browser credentials; access
// remains protected by the project's Row Level Security policies.
export const ORIGINAL_SUPABASE_URL = "https://fioykldgrzedxyxpgomf.supabase.co";
const ORIGINAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3lrbGRncnplZHh5eHBnb21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NzY0MDIsImV4cCI6MjA4NDA1MjQwMn0.Qw_ua5rNKWyczBtk5LM9-AqBkt6pGinN_2hiX7hMg-E";

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