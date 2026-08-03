const accessTokenStorageKey = 'tanpen.accessToken';

let refreshToken: string | null = null;

export function getAccessToken() {
  if (typeof window === 'undefined') return null;

  return window.localStorage.getItem(accessTokenStorageKey);
}

export function getRefreshToken() {
  return refreshToken;
}

export function setTokens(tokens: { accessToken: string; refreshToken?: string }) {
  window.localStorage.setItem(accessTokenStorageKey, tokens.accessToken);

  if (tokens.refreshToken) {
    refreshToken = tokens.refreshToken;
  }
}

export function clearTokens() {
  refreshToken = null;

  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(accessTokenStorageKey);
}
