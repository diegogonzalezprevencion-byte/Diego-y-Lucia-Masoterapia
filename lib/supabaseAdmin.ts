import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      client: null,
      error: "Faltan variables de entorno de Supabase. Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel."
    };
  }

  const client = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  return { client, error: null };
}
