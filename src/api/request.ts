import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../auth/session';

const apiUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:54321/functions/v1';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type RefreshTokenResponse =
  | {
      accessToken: string;
      refreshToken: string;
    }
  | {
      error: string;
    };

let refreshPromise: Promise<boolean> | null = null;

const requestHeaders = (body: unknown, headers: HeadersInit | undefined) => {
  const requestHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');
  if (accessToken) requestHeaders.set('Authorization', `Bearer ${accessToken}`);

  return requestHeaders;
};

const sendRequest = (path: string, options: ApiRequestOptions) => {
  const { body, headers, ...init } = options;

  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: requestHeaders(body, headers),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
};

const parseRefreshResponse = async (response: Response) => {
  if (!response.ok) return null;

  const data = (await response.json().catch(() => null)) as RefreshTokenResponse | null;

  if (!data || !('accessToken' in data) || !('refreshToken' in data)) return null;

  return data;
};

const refreshTokens = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return false;

  const response = await fetch(`${apiUrl}/auth/refresh-token`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ refreshToken }),
  });
  const tokens = await parseRefreshResponse(response);

  if (!tokens) {
    clearTokens();
    return false;
  }

  setTokens(tokens);
  return true;
};

const refreshTokensOnce = () => {
  refreshPromise ??= refreshTokens().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const throwRequestError = async (response: Response): Promise<never> => {
  const message = await response.text();
  throw new Error(message || `Request failed with ${response.status}`);
};

export async function request<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  let response = await sendRequest(path, options);

  if (response.status === 401 && (await refreshTokensOnce())) {
    response = await sendRequest(path, options);
  }

  if (!response.ok) {
    if (response.status === 401) clearTokens();
    await throwRequestError(response);
  }

  if (response.status === 204) return undefined as TResponse;

  return response.json() as Promise<TResponse>;
}
