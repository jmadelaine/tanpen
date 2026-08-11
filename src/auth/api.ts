import { request } from '../api/request';
import { clearTokens } from './session';

export type AuthSession = {
  id: string;
  email: string | null;
};

export type PasswordAuthResponse =
  | {
      id: string;
      email: string | null;
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    }
  | {
      id: string;
      email: string | null;
      pendingEmailConfirmation: true;
    }
  | {
      error:
        | 'invalid_email'
        | 'invalid_credentials'
        | 'email_exists'
        | 'weak_password'
        | 'unknown_error';
    };

export function logInWithPassword(input: { email: string; password: string }) {
  return request<PasswordAuthResponse>('/auth/log-in-with-password', {
    method: 'POST',
    body: input,
  });
}

export async function validateAccessToken() {
  try {
    await request<AuthSession>('/auth/session');
    return true;
  } catch {
    clearTokens();
    return false;
  }
}
