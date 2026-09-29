import { useQuery } from '@tanstack/react-query';
import { storiesQueryOptions } from '../page_home/storiesQueryOptions';
import { StoryCard } from './StoryCard';

export const StoriesPage = () => {
  const storiesQuery = useQuery(storiesQueryOptions());

  if (storiesQuery.isError) {
    return <div>{'Error loading stories.'}</div>;
  }

  if (storiesQuery.isLoading) {
    return <div>{'Loading stories...'}</div>;
  }

  return (
    <div className="flex justify-center ">
      <div className="flex w-full max-w-3xl px-4 py-10 flex-col gap-3">
        {storiesQuery.data?.map((story) => {
          return <StoryCard key={story.id} story={story} />;
        })}
      </div>
    </div>
  );
};
