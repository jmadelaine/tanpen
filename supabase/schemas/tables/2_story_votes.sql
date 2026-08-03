create table public.story_votes (
  story_id uuid not null references public.stories on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (story_id, user_id)
);
