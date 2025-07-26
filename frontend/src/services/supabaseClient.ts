import { createClient } from "@supabase/supabase-js";
import { config } from "../config/environment";

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Error handling utility
export const handleSupabaseError = (error: unknown, context: string) => {
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error(`${context}:`, error);

  // In production, you might want to send this to a logging service
  if (config.app.environment === 'production') {
    // TODO: Add error reporting service (Sentry, LogRocket, etc.)
  }

  return message;
};