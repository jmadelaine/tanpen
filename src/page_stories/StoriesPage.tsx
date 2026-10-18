import { useQuery } from '@tanstack/react-query';
import { storiesQueryOptions } from '../page_home/storiesQueryOptions';
import { StoryCard } from './StoryCard';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const StoriesPage = () => {
  const storiesQuery = useQuery(storiesQueryOptions());
  const { t } = useTranslation();
  if (storiesQuery.isError) {
    return (
      <div>
        <Link className="flex text-sm text-zinc-400 hover:text-white" to="/">
          ← {t('stories.homelink')}
        </Link>
        {'Error loading stories.'}
      </div>
    );
  }

  if (storiesQuery.isLoading) {
    return (
      <div>
        <Link className="flex text-sm text-zinc-400 hover:text-white" to="/">
          ← {t('stories.homelink')}
        </Link>
        {'Loading stories...'}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6 p-4">
      <Link className="flex text-sm text-zinc-400 hover:text-white" to="/">
        ← {t('stories.homelink')}
      </Link>
      <div className="flex w-full max-w-3xl px-4 py-10 flex-col gap-3">
        {storiesQuery.data?.map((story) => {
          return <StoryCard key={story.id} story={story} />;
        })}
      </div>
    </div>
  );
};
