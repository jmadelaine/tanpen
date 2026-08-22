import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { logInWithPassword } from '../auth/api';
import { setTokens } from '../auth/session';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

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
    if (logInMutation.isError) {
      setError(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{'Email'}</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <label htmlFor="password">{'Password'}</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button type="submit" disabled={logInMutation.isPending}>
          Log in
        </button>
      </form>
      {error ? <div>{t('login.error')}</div> : null}
    </div>
  );
}
