import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/stories/$storyId/edit')({
  component: StoryEditPage,
});

function StoryEditPage() {
  return <div />;
}
