import { HomeStory } from '../page_home/storiesQueryOptions';
import { Story } from './StoriesPage';

export const StoryCard = ({ story }: { story: HomeStory }) => {
  return (
    <div className="bg-zinc-900 flex flex-col rounded-xl p-4 gap-3">
      <div className="flex justify-between">
        <div className="text-lg font-semibold text-white">{story.title}</div>
        <div className="flex gap-3 text-xs text-zinc-400">{}</div>
      </div>
      <div className="flex gap-3 text-sm text-zinc-300"></div>
    </div>
  );
};

// //Card style:
// Each story card should be a div flex column that contains two flex rows:

// Top row:
// Story title on the left.
// Story metadata on the right in the following order: score, comment count, created date.
// Second row:
// Story body preview.
// The preview should render as a single line and use ellipsis truncation when it overflows.

// Background color bg-zinc-900.
// Border radius rounded-xl.
// Padding p-4.
// Use a gap of gap-3 between the two rows in the card.
// Top row style:

// Use flex layout with title on the left and metadata on the right.
// The title has text-lg font-semibold text-white.
// Metadata has  text-xs text-zinc-400.
// Use a gap of gap-3 between the metadata items: score, comment count, and created date.
// Body preview style:

// Body preview text has text-sm text-zinc-300.
// Use one-line truncation with ellipsis, (you can use Tailwind's truncate utility class)
