alter table public.profiles owner to postgres;
alter table public.stories owner to postgres;
alter table public.comments owner to postgres;
alter table public.story_votes owner to postgres;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.comments enable row level security;
alter table public.story_votes enable row level security;
