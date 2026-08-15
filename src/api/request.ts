import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../auth/session';

const apiUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:54321/functions/v1';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  refreshOnUnauthorized?: boolean;
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

type SendRequestOptions = Omit<ApiRequestOptions, 'refreshOnUnauthorized'>;

const sendRequest = (path: string, options: SendRequestOptions) => {
  const { body, headers, ...init } = options;

  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: requestHeaders(body, headers),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly error?: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

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
  const text = await response.text();
  const data = text
    ? (() => {
        try {
          return JSON.parse(text) as unknown;
        } catch {
          return null;
        }
      })()
    : null;
  const error =
    data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : undefined;

  throw new ApiRequestError(
    error ?? (text || `Request failed with ${response.status}`),
    response.status,
    error,
  );
};

export async function request<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { refreshOnUnauthorized = true, ...requestOptions } = options;
  let response = await sendRequest(path, requestOptions);

  if (response.status === 401 && refreshOnUnauthorized && (await refreshTokensOnce())) {
    response = await sendRequest(path, requestOptions);
  }

  if (!response.ok) {
    if (response.status === 401) clearTokens();
    await throwRequestError(response);
  }

  if (response.status === 204) return undefined as TResponse;

  return response.json() as Promise<TResponse>;
}
