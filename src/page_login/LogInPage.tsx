import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { logInWithPassword } from '../auth/api';
import { setTokens } from '../auth/session';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const logInMutation = useMutation({
    mutationFn: () =>
      logInWithPassword({
        email: email,
        password: password,
      }),
    onSuccess: (response) => {
      if ('accessToken' in response) {
        setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        void router.invalidate();
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    logInMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen items-center gap-6">
      <header className="p-8">
        <h1 className="text-3xl">{'Welcome To Tanpen'}</h1>
      </header>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor="email">{'Email'}</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">{'Password'}</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button
            type="submit"
            disabled={logInMutation.isPending}
            className="flex w-full justify-center"
          >
            {t('login.loginButton')}
          </button>
        </form>
        {logInMutation.isError ? <div>{t('login.error')}</div> : null}
      </div>
    </div>
  );
}
