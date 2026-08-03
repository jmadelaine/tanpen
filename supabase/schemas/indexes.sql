create index stories_author_id_idx on public.stories (author_id);

create index stories_published_created_at_idx on public.stories (created_at desc)
where
  is_published = true;

create index comments_story_id_created_at_idx on public.comments (
  story_id,
  created_at
);

create index comments_author_id_idx on public.comments (author_id);

create index story_votes_user_id_idx on public.story_votes (user_id);
