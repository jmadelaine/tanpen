import { Story } from '../page_home/storiesQueryOptions';
import { useTranslation } from 'react-i18next';

export const StoryCard = ({ story }: { story: Story }) => {
  const { t } = useTranslation();
  const date = new Date(story.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="text-lg font-semibold text-white">{story.title}</div>
        <div className="flex gap-3 text-xs text-zinc-400">
          <div>{t('stories.card.score', { score: story.score })} </div>
          <div> {t('stories.card.commentCount', { commentCount: story.commentsCount })} </div>
          <div>{`Date ${date}`}</div>
        </div>
      </div>
      <div className="truncate text-sm text-zinc-300">{story.body.replace(/\s+/gu, '')}</div>
    </div>
  );
};
