import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_unauthenticated/signup')({
  component: SignupPage,
});

function SignupPage() {
  return <div />;
}
