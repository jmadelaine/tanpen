create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger stories_set_updated_at
before update on public.stories
for each row
execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

create trigger story_votes_set_updated_at
before update on public.story_votes
for each row
execute function public.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
