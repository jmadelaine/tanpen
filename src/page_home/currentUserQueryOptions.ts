import { queryOptions } from '@tanstack/react-query';
import { request } from '../api/request';

export type CurrentUser = {
  id: string;
  displayName: string;
};

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['current-user'],
    queryFn: () => request<CurrentUser>('/users/me'),
  });
