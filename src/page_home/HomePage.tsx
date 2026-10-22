import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { clearTokens } from '../auth/session';
import { storiesQueryOptions } from './storiesQueryOptions.ts';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storiesQuery = useQuery(storiesQueryOptions());

  const logOut = () => {
    clearTokens();
    queryClient.clear();
    void navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={logOut}>
        Log out
      </button>
      {storiesQuery.isLoading ? <div>Loading stories...</div> : null}
      {storiesQuery.isError ? <div>Failed to load stories.</div> : null}
    </div>
  );
}
