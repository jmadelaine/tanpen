import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { clearTokens } from '../auth/session';
import { currentUserQueryOptions } from './currentUserQueryOptions';
import { storiesQueryOptions } from './storiesQueryOptions.ts';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUserQuery = useQuery(currentUserQueryOptions());
  const storiesQuery = useQuery(storiesQueryOptions());

  const logOut = () => {
    clearTokens();
    queryClient.clear();
    void navigate({ to: '/login' });
  };

  const username = currentUserQuery.data?.displayName.trim();
  const greeting = username ? t('home.greeting', { username }) : t('home.greetingFallback');
  const stories = storiesQuery.data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div>{greeting}</div>
      <button type="button" onClick={logOut}>
        Log out
      </button>
      {storiesQuery.isLoading ? <div>Loading stories...</div> : null}
      {storiesQuery.isError ? <div>Failed to load stories.</div> : null}
      {storiesQuery.isSuccess
        ? stories.map((story) => <div key={story.id}>{story.title}</div>)
        : null}
    </div>
  );
}
