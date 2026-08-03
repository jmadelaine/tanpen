import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/stories/new')({
  component: StoryNewPage,
});

function StoryNewPage() {
  return <div />;
}
