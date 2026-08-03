import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserProfilePage,
});

function UserProfilePage() {
  return <div />;
}
