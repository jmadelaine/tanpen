import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.gen.ts';

export const createDbClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');

  return createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    },
  );
};

export const createAdminDbClient = () =>
  createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

export const getUser = async (client: ReturnType<typeof createDbClient>) => {
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user;
};
