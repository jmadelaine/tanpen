import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/stories/$storyId')({
  component: StoryDetailPage,
});

function StoryDetailPage() {
  return <div />;
}
