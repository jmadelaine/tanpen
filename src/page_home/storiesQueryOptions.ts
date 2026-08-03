import { queryOptions } from '@tanstack/react-query';
import { request } from '../api/request';

export type HomeStory = {
  id: string;
  title: string;
};

export const storiesQueryOptions = () =>
  queryOptions({
    queryKey: ['stories'],
    queryFn: () => request<HomeStory[]>('/stories'),
  });
