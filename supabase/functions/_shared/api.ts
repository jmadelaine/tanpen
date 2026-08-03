import '@supabase/functions-js/edge-runtime.d.ts';
import { AuthError } from '@supabase/supabase-js';

type Route = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  handler: (req: Request, params: Record<string, string | undefined>) => Promise<Response>;
};

const defaultAllowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS')?.split(',') ?? defaultAllowedOrigins).map(
  (origin) => origin.trim().toLowerCase(),
);

const routeRegexMap = (routes: Route[]) =>
  new Map(
    routes.map((route) => [
      route.path,
      new RegExp(`^${route.path.replace(/:([^/]+)/g, '([^/]+)')}$`),
    ]),
  );

const routeParamKeys = (path: string) => Array.from(path.matchAll(/:([^/]+)/g), ([, key]) => key);

export const createApi = (...routes: Route[]) => {
  const regexMap = routeRegexMap(routes);

  Deno.serve(async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const origin = req.headers.get('origin')?.trim().toLowerCase();
    const matchingRoutes = routes.filter((route) => regexMap.get(route.path)?.test(url.pathname));
    const allowedMethods = [...new Set(matchingRoutes.map((route) => route.method)), 'OPTIONS'];
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': allowedMethods.join(', '),
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-client-info, apikey',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!matchingRoutes.length) {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    const route = matchingRoutes.find((item) => item.method === req.method);
    if (!route) {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const regex = regexMap.get(route.path);
      const values = regex?.exec(url.pathname)?.slice(1) ?? [];
      const params = Object.fromEntries(
        routeParamKeys(route.path).map((key, index) => [key, decodeURIComponent(values[index])]),
      );
      const response = await route.handler(req, params);

      return new Response(response.body, {
        status: response.status,
        headers: { ...Object.fromEntries(response.headers), ...corsHeaders },
      });
    } catch (error) {
      console.error(error);

      if (
        error instanceof AuthError ||
        (error &&
          typeof error === 'object' &&
          'name' in error &&
          error.name === 'AuthSessionMissingError')
      ) {
        return new Response('Unauthorized', {
          status: 401,
          headers: corsHeaders,
        });
      }

      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      });
    }
  });
};
