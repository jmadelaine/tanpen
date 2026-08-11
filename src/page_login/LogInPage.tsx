import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { logInWithPassword } from '../auth/api';
import { setTokens } from '../auth/session';

export const Route = createFileRoute('/_unauthenticated/login')({
  component: LoginPage,
});

export function LoginPage() {
  const router = useRouter();
  const logInMutation = useMutation({
    mutationFn: () =>
      logInWithPassword({
        email: 'jonny@example.com',
        password: 'password123',
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

  return (
    <div>
      <button
        type="button"
        onClick={() => logInMutation.mutate()}
        disabled={logInMutation.isPending}
      >
        Log in as Jonny
      </button>
    </div>
  );
}
