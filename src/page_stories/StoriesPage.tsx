import { useQuery } from '@tanstack/react-query';
import { storiesQueryOptions } from '../page_home/storiesQueryOptions';
import { StoryCard } from './StoryCard';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const StoriesPage = () => {
  const storiesQuery = useQuery(storiesQueryOptions());
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-6 p-4 ">
      <div className="w-full max-w-3xl pl-4">
        <Link className="flex text-sm text-zinc-400 hover:text-white" to="/">
          ← {t('stories.homeLink')}
        </Link>
      </div>
      {storiesQuery.isError ? (
        'Error loading stories.'
      ) : storiesQuery.isLoading ? (
        'Loading stories...'
      ) : (
        <div className="flex w-full max-w-3xl px-4 py-10 flex-col gap-3">
          {storiesQuery.data?.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};
