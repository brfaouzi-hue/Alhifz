import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback gracieux: si pas de config, créer un client factice
// L'app fonctionne sans auth (localStorage uniquement)
let supabase;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} else {
  // Client factice pour éviter les crashes si pas de config Supabase
  const noop = () => Promise.resolve({ data: null, error: null });
  const noopAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (cb) => { 
      cb('SIGNED_OUT', null); 
      return { data: { subscription: { unsubscribe: () => {} } } }; 
    },
    signInWithPassword: noop,
    signUp: noop,
    resetPasswordForEmail: noop,
    signOut: noop,
  };
  supabase = {
    auth: noopAuth,
    from: () => ({
      select: () => ({ eq: () => ({ single: noop }) }),
      upsert: noop,
      insert: noop,
      update: noop,
      delete: noop,
    }),
  };
  console.warn('Al-Hifz: Supabase non configuré, mode offline uniquement');
}

export { supabase };
