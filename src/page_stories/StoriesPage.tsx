import { useQuery } from '@tanstack/react-query';
import { storiesQueryOptions } from '../page_home/storiesQueryOptions';
import { StoryCard } from './StoryCard';

export type Story = {
  id: string;
  authorId: string;
  title: string;
  body: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  score: number;
  commentsCount: number;
};

export const StoriesPage = () => {
  const storiesQuery = useQuery(storiesQueryOptions());
  console.log(storiesQuery.data);

  if (storiesQuery.isError) {
    return <div>{'Error loading stories.'}</div>;
  }

  if (storiesQuery.isLoading) {
    return <div>{'Loading stories...'}</div>;
  }

  return (
    <div className="flex items-center justify-center max-w-3xl px-4 py-10 gap-3">
      {storiesQuery.data?.map((story) => {
        return <StoryCard story={story} />;
      })}
    </div>
  );
};
