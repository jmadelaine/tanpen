import '@supabase/functions-js/edge-runtime.d.ts';
import { createApi } from '../_shared/api.ts';
import { createDbClient, getUser } from '../_shared/dbClient.ts';
import { notFound, okay } from '../_shared/response.ts';

createApi(
  {
    method: 'GET',
    path: '/users/me',
    handler: async (req) => {
      const client = createDbClient(req);
      const user = await getUser(client);
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound();

      return okay(data);
    },
  },
  {
    method: 'GET',
    path: '/users/:userId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', params.userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound();

      return okay(data);
    },
  },
);
