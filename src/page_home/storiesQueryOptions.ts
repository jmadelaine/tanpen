import { queryOptions } from '@tanstack/react-query';
import { request } from '../api/request';

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

export const storiesQueryOptions = () =>
  queryOptions({
    queryKey: ['stories'],
    queryFn: () => request<Story[]>('/stories'),
  });
