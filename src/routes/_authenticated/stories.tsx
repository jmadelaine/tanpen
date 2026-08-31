import { createFileRoute } from '@tanstack/react-router';
import { storiesPage } from '../../page_stories/StoriesPage';

export const Route = createFileRoute('/_authenticated/stories')({
  component: storiesPage,
});
