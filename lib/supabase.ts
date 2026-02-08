import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente de Supabase sin tipos genéricos estrictos
// Los tipos se manejan manualmente con type assertions en los hooks
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
