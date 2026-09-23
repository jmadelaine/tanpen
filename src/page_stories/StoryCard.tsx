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
      <button type="button" className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
        >
          <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
        </svg>
      </button>
      <button type="button" className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="currentColor"
        >
          <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
        </svg>
      </button>
    </div>
  );
};
