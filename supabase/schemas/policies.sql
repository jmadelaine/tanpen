create policy "Profiles are visible to everyone" on public.profiles for select using (true);

create policy "Users can update their own profile" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Published stories are visible to everyone" on public.stories for select using (is_published or (select auth.uid()) = author_id);

create policy "Users can create their own stories" on public.stories for insert with check ((select auth.uid()) = author_id);

create policy "Users can update their own stories" on public.stories for update using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);

create policy "Users can delete their own stories" on public.stories for delete using ((select auth.uid()) = author_id);

create policy "Comments on visible stories are visible to everyone" on public.comments for select using (
  exists (
    select 1
    from public.stories
    where
      stories.id = comments.story_id
      and (stories.is_published or stories.author_id = (select auth.uid()))
  )
);

create policy "Users can create their own comments on published stories" on public.comments for insert with check (
  (select auth.uid()) = author_id
  and exists (
    select 1
    from public.stories
    where
      stories.id = comments.story_id
      and stories.is_published
  )
);

create policy "Users can update their own comments" on public.comments for update using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);

create policy "Users can delete their own comments" on public.comments for delete using ((select auth.uid()) = author_id);

create policy "Story votes are visible to everyone" on public.story_votes for select using (true);

create policy "Users can create their own story votes" on public.story_votes for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own story votes" on public.story_votes for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users can delete their own story votes" on public.story_votes for delete using ((select auth.uid()) = user_id);
