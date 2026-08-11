import { createFileRoute, redirect } from '@tanstack/react-router';
import { validateAccessToken } from '../auth/api';

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: async () => {
    if (await validateAccessToken()) {
      throw redirect({ to: '/' });
    }
  },
});
