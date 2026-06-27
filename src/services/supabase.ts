import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. ' +
    'The app is running in offline preview mode. Please configure them in a .env file.'
  );
}

// Fallback to placeholder values if keys are not defined to prevent initialization error.
const url = supabaseUrl || 'https://your-project.supabase.co';
const key = supabaseAnonKey || 'your-anon-key';

export const supabase = createClient(url, key);

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
