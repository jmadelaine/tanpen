import '@supabase/functions-js/edge-runtime.d.ts';
import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { createApi } from '../_shared/api.ts';
import { createDbClient, getUser } from '../_shared/dbClient.ts';
import { jsonBody } from '../_shared/request.ts';
import { badRequest, okay } from '../_shared/response.ts';

type PasswordAuthInput = {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
};

type RefreshTokenInput = {
  refreshToken?: unknown;
};

type AuthError =
  'invalid_email' | 'invalid_credentials' | 'email_exists' | 'weak_password' | 'unknown_error';

const toAuthError = (error: SupabaseAuthError): AuthError => {
  switch (error.code) {
    case 'invalid_credentials':
      return 'invalid_credentials';
    case 'email_address_invalid':
      return 'invalid_email';
    case 'email_exists':
      return 'email_exists';
    case 'weak_password':
      return 'weak_password';
    default:
      return 'unknown_error';
  }
};

const authErrorResponse = (error: SupabaseAuthError) => okay({ error: toAuthError(error) });

const sessionResponse = (
  id: string,
  email: string | undefined,
  accessToken: string,
  refreshToken: string,
  expiresAt: number | undefined,
) =>
  okay({
    id,
    email: email ?? null,
    accessToken,
    refreshToken,
    expiresAt: expiresAt ?? 0,
  });

createApi(
  {
    method: 'GET',
    path: '/auth/session',
    handler: async (req) => {
      const client = createDbClient(req);
      const user = await getUser(client);

      return okay({
        id: user.id,
        email: user.email ?? null,
      });
    },
  },
  {
    method: 'POST',
    path: '/auth/log-in-with-password',
    handler: async (req) => {
      const body = await jsonBody<PasswordAuthInput>(req);

      if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
        return badRequest('Expected body: { email: string, password: string }');
      }

      const client = createDbClient(req);
      const { data, error } = await client.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

      if (error) return authErrorResponse(error);
      if (!data.user || !data.session) throw new Error('Missing auth session');

      return sessionResponse(
        data.user.id,
        data.user.email,
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at,
      );
    },
  },
  {
    method: 'POST',
    path: '/auth/sign-up-with-password',
    handler: async (req) => {
      const body = await jsonBody<PasswordAuthInput>(req);

      if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
        return badRequest(
          'Expected body: { email: string, password: string, displayName?: string }',
        );
      }

      const client = createDbClient(req);
      const { data, error } = await client.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            display_name: typeof body.displayName === 'string' ? body.displayName : undefined,
          },
        },
      });

      if (error) return authErrorResponse(error);
      if (!data.user) throw new Error('Missing auth user');

      if (!data.session) {
        return okay({
          id: data.user.id,
          email: data.user.email ?? null,
          pendingEmailConfirmation: true,
        });
      }

      return sessionResponse(
        data.user.id,
        data.user.email,
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at,
      );
    },
  },
  {
    method: 'POST',
    path: '/auth/refresh-token',
    handler: async (req) => {
      const body = await jsonBody<RefreshTokenInput>(req);

      if (!body || typeof body.refreshToken !== 'string') {
        return badRequest('Expected body: { refreshToken: string }');
      }

      const client = createDbClient(req);
      const { data, error } = await client.auth.refreshSession({
        refresh_token: body.refreshToken,
      });

      if (error) return authErrorResponse(error);
      if (!data.user || !data.session) throw new Error('Missing auth session');

      return sessionResponse(
        data.user.id,
        data.user.email,
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at,
      );
    },
  },
);
