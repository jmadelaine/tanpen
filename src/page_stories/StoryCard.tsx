import { useState } from 'react';
import { Story } from '../page_home/storiesQueryOptions';

export const StoryCard = ({ story }: { story: Story }) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(story.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="text-lg font-semibold text-white">{story.title}</div>
        <div className="flex gap-3 text-xs text-zinc-400">{`Score ${story.score},  Comments ${story.commentsCount}, ${date}`}</div>
      </div>
      <div
        onClick={() => setExpanded(!expanded)}
        className={` text-sm text-zinc-300 cursor-pointer ${expanded ? '' : 'truncate text-ellipsis'}`}
      >
        {story.body.replace(/\s+/gu, '')}
      </div>
    </div>
  );
};
