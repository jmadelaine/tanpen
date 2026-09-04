import { useQuery } from '@tanstack/react-query';
import { storiesQueryOptions } from '../page_home/storiesQueryOptions';

export const StoriesPage = () => {
  const storiesQuery = useQuery(storiesQueryOptions());
  console.log(storiesQuery.data);

  if (storiesQuery.isError) {
    return <div>{'Error loading stories.'}</div>;
  }

  if (storiesQuery.isLoading) {
    return <div>{'Loading stories...'}</div>;
  }

  return <div className="flex items-center justify-center max-w-3xl px-4 py-10 gap-3"></div>;
};
