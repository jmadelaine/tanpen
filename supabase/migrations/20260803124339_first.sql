
  create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "story_id" uuid not null,
    "author_id" uuid not null,
    "body" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."comments" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "display_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."stories" (
    "id" uuid not null default gen_random_uuid(),
    "author_id" uuid not null,
    "title" text not null,
    "body" text not null default ''::text,
    "is_published" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."stories" enable row level security;


  create table "public"."story_votes" (
    "story_id" uuid not null,
    "user_id" uuid not null,
    "vote" smallint not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."story_votes" enable row level security;

CREATE INDEX comments_author_id_idx ON public.comments USING btree (author_id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE INDEX comments_story_id_created_at_idx ON public.comments USING btree (story_id, created_at);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX stories_author_id_idx ON public.stories USING btree (author_id);

CREATE UNIQUE INDEX stories_pkey ON public.stories USING btree (id);

CREATE INDEX stories_published_created_at_idx ON public.stories USING btree (created_at DESC) WHERE (is_published = true);

CREATE UNIQUE INDEX story_votes_pkey ON public.story_votes USING btree (story_id, user_id);

CREATE INDEX story_votes_user_id_idx ON public.story_votes USING btree (user_id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."stories" add constraint "stories_pkey" PRIMARY KEY using index "stories_pkey";

alter table "public"."story_votes" add constraint "story_votes_pkey" PRIMARY KEY using index "story_votes_pkey";

alter table "public"."comments" add constraint "comments_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_author_id_fkey";

alter table "public"."comments" add constraint "comments_body_check" CHECK (((char_length(body) >= 1) AND (char_length(body) <= 1000))) not valid;

alter table "public"."comments" validate constraint "comments_body_check";

alter table "public"."comments" add constraint "comments_story_id_fkey" FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_story_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."stories" add constraint "stories_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."stories" validate constraint "stories_author_id_fkey";

alter table "public"."stories" add constraint "stories_title_check" CHECK (((char_length(title) >= 1) AND (char_length(title) <= 120))) not valid;

alter table "public"."stories" validate constraint "stories_title_check";

alter table "public"."story_votes" add constraint "story_votes_story_id_fkey" FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE not valid;

alter table "public"."story_votes" validate constraint "story_votes_story_id_fkey";

alter table "public"."story_votes" add constraint "story_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."story_votes" validate constraint "story_votes_user_id_fkey";

alter table "public"."story_votes" add constraint "story_votes_vote_check" CHECK ((vote = ANY (ARRAY['-1'::integer, 1]))) not valid;

alter table "public"."story_votes" validate constraint "story_votes_vote_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant references on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant references on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant references on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant references on table "public"."stories" to "anon";

grant trigger on table "public"."stories" to "anon";

grant truncate on table "public"."stories" to "anon";

grant references on table "public"."stories" to "authenticated";

grant trigger on table "public"."stories" to "authenticated";

grant truncate on table "public"."stories" to "authenticated";

grant references on table "public"."stories" to "service_role";

grant trigger on table "public"."stories" to "service_role";

grant truncate on table "public"."stories" to "service_role";

grant references on table "public"."story_votes" to "anon";

grant trigger on table "public"."story_votes" to "anon";

grant truncate on table "public"."story_votes" to "anon";

grant references on table "public"."story_votes" to "authenticated";

grant trigger on table "public"."story_votes" to "authenticated";

grant truncate on table "public"."story_votes" to "authenticated";

grant references on table "public"."story_votes" to "service_role";

grant trigger on table "public"."story_votes" to "service_role";

grant truncate on table "public"."story_votes" to "service_role";


  create policy "Comments on visible stories are visible to everyone"
  on "public"."comments"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.stories
  WHERE ((stories.id = comments.story_id) AND (stories.is_published OR (stories.author_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Users can create their own comments on published stories"
  on "public"."comments"
  as permissive
  for insert
  to public
with check (((( SELECT auth.uid() AS uid) = author_id) AND (EXISTS ( SELECT 1
   FROM public.stories
  WHERE ((stories.id = comments.story_id) AND stories.is_published)))));



  create policy "Users can delete their own comments"
  on "public"."comments"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = author_id));



  create policy "Users can update their own comments"
  on "public"."comments"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = author_id))
with check ((( SELECT auth.uid() AS uid) = author_id));



  create policy "Profiles are visible to everyone"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Published stories are visible to everyone"
  on "public"."stories"
  as permissive
  for select
  to public
using ((is_published OR (( SELECT auth.uid() AS uid) = author_id)));



  create policy "Users can create their own stories"
  on "public"."stories"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = author_id));



  create policy "Users can delete their own stories"
  on "public"."stories"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = author_id));



  create policy "Users can update their own stories"
  on "public"."stories"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = author_id))
with check ((( SELECT auth.uid() AS uid) = author_id));



  create policy "Story votes are visible to everyone"
  on "public"."story_votes"
  as permissive
  for select
  to public
using (true);



  create policy "Users can create their own story votes"
  on "public"."story_votes"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can delete their own story votes"
  on "public"."story_votes"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their own story votes"
  on "public"."story_votes"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER comments_set_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER stories_set_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER story_votes_set_updated_at BEFORE UPDATE ON public.story_votes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


