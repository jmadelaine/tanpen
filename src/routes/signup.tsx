import { createFileRoute } from '@tanstack/react-router';
import { redirectIfAuthenticated } from '../auth/api';

export const Route = createFileRoute('/signup')({
  beforeLoad: redirectIfAuthenticated,
  component: SignupPage,
});

function SignupPage() {
  return <div />;
}
