import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '../../page_login/LogInPage';

export const Route = createFileRoute('/_unauthenticated/login')({
  component: LoginPage,
});
