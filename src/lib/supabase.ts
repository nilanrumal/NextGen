import { createClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const ADMIN_EMAIL = 'nextgenconsultants1985@gmail.com';
