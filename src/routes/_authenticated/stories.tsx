import { createFileRoute } from '@tanstack/react-router';
import { StoriesPage } from '../../page_stories/StoriesPage';

export const Route = createFileRoute('/_authenticated/stories')({
  component: StoriesPage,
});
