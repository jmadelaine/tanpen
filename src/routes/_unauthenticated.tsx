import { createFileRoute } from '@tanstack/react-router';
import { redirectIfAuthenticated } from '../auth/api';

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: redirectIfAuthenticated,
});
