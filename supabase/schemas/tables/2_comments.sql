create table public.comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
