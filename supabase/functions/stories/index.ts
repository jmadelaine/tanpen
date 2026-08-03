import '@supabase/functions-js/edge-runtime.d.ts';
import { createApi } from '../_shared/api.ts';
import { createDbClient, getUser } from '../_shared/dbClient.ts';
import { jsonBody } from '../_shared/request.ts';
import { badRequest, created, notFound, okay } from '../_shared/response.ts';

type StoryInput = {
  title?: unknown;
  body?: unknown;
  isPublished?: unknown;
};

type CommentInput = {
  body?: unknown;
};

type VoteInput = {
  vote?: unknown;
};

type StoryRow = {
  id: string;
  author_id: string;
  title: string;
  body: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type CommentRow = {
  id: string;
  story_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

const validateStoryInput = (body: StoryInput | undefined, partial = false) => {
  if (!body) return undefined;

  const input: {
    title?: string;
    body?: string;
    is_published?: boolean;
  } = {};

  if (typeof body.title === 'string') input.title = body.title.trim();
  if (typeof body.body === 'string') input.body = body.body;
  if (typeof body.isPublished === 'boolean') input.is_published = body.isPublished;

  if (!partial && (!input.title || input.body === undefined)) return undefined;
  if (input.title !== undefined && !input.title) return undefined;

  return input;
};

const storyStats = async (client: ReturnType<typeof createDbClient>, storyIds: string[]) => {
  if (!storyIds.length) return new Map<string, { score: number; comments_count: number }>();

  const [{ data: votes, error: votesError }, { data: comments, error: commentsError }] =
    await Promise.all([
      client.from('story_votes').select('story_id, vote').in('story_id', storyIds),
      client.from('comments').select('story_id').in('story_id', storyIds),
    ]);

  if (votesError) throw votesError;
  if (commentsError) throw commentsError;

  const stats = new Map<string, { score: number; comments_count: number }>();
  for (const id of storyIds) stats.set(id, { score: 0, comments_count: 0 });

  for (const vote of votes ?? []) {
    const current = stats.get(vote.story_id);
    if (current) current.score += vote.vote;
  }

  for (const comment of comments ?? []) {
    const current = stats.get(comment.story_id);
    if (current) current.comments_count += 1;
  }

  return stats;
};

const withStats = async (client: ReturnType<typeof createDbClient>, stories: StoryRow[]) => {
  const stats = await storyStats(
    client,
    stories.map((story) => story.id),
  );

  return stories.map((story) => ({
    ...story,
    score: stats.get(story.id)?.score ?? 0,
    comments_count: stats.get(story.id)?.comments_count ?? 0,
  }));
};

const storyDetail = async (client: ReturnType<typeof createDbClient>, story: StoryRow) => {
  const [storyWithStats] = await withStats(client, [story]);
  const { data: comments, error } = await client
    .from('comments')
    .select('*')
    .eq('story_id', story.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return {
    ...storyWithStats,
    comments: (comments ?? []) as CommentRow[],
  };
};

createApi(
  {
    method: 'GET',
    path: '/stories',
    handler: async (req) => {
      const client = createDbClient(req);
      const { data, error } = await client
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return okay(await withStats(client, (data ?? []) as StoryRow[]));
    },
  },
  {
    method: 'POST',
    path: '/stories',
    handler: async (req) => {
      const client = createDbClient(req);
      const user = await getUser(client);
      const input = validateStoryInput(await jsonBody<StoryInput>(req));

      if (!input) {
        return badRequest('Expected body: { title: string, body: string, isPublished?: boolean }');
      }

      const { data, error } = await client
        .from('stories')
        .insert({ ...input, author_id: user.id })
        .select('*')
        .single();

      if (error) throw error;

      return created(await storyDetail(client, data as StoryRow));
    },
  },
  {
    method: 'GET',
    path: '/stories/:storyId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const { data, error } = await client
        .from('stories')
        .select('*')
        .eq('id', params.storyId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound();

      return okay(await storyDetail(client, data as StoryRow));
    },
  },
  {
    method: 'PATCH',
    path: '/stories/:storyId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      await getUser(client);
      const input = validateStoryInput(await jsonBody<StoryInput>(req), true);

      if (!input || !Object.keys(input).length) {
        return badRequest('Expected body with at least one of: title, body, isPublished');
      }

      const { data, error } = await client
        .from('stories')
        .update(input)
        .eq('id', params.storyId)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound();

      return okay(await storyDetail(client, data as StoryRow));
    },
  },
  {
    method: 'DELETE',
    path: '/stories/:storyId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      await getUser(client);
      const { error } = await client.from('stories').delete().eq('id', params.storyId);

      if (error) throw error;

      return okay();
    },
  },
  {
    method: 'GET',
    path: '/stories/:storyId/comments',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const { data, error } = await client
        .from('comments')
        .select('*')
        .eq('story_id', params.storyId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return okay((data ?? []) as CommentRow[]);
    },
  },
  {
    method: 'POST',
    path: '/stories/:storyId/comments',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const user = await getUser(client);
      const input = await jsonBody<CommentInput>(req);

      if (!input || typeof input.body !== 'string' || !input.body.trim()) {
        return badRequest('Expected body: { body: string }');
      }

      const { data, error } = await client
        .from('comments')
        .insert({
          story_id: params.storyId ?? '',
          author_id: user.id,
          body: input.body.trim(),
        })
        .select('*')
        .single();

      if (error) throw error;

      return created(data as CommentRow);
    },
  },
  {
    method: 'PATCH',
    path: '/stories/comments/:commentId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      await getUser(client);
      const input = await jsonBody<CommentInput>(req);

      if (!input || typeof input.body !== 'string' || !input.body.trim()) {
        return badRequest('Expected body: { body: string }');
      }

      const { data, error } = await client
        .from('comments')
        .update({ body: input.body.trim() })
        .eq('id', params.commentId)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound();

      return okay(data as CommentRow);
    },
  },
  {
    method: 'DELETE',
    path: '/stories/comments/:commentId',
    handler: async (req, params) => {
      const client = createDbClient(req);
      await getUser(client);
      const { error } = await client.from('comments').delete().eq('id', params.commentId);

      if (error) throw error;

      return okay();
    },
  },
  {
    method: 'PUT',
    path: '/stories/:storyId/vote',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const user = await getUser(client);
      const input = await jsonBody<VoteInput>(req);

      if (!input || (input.vote !== 1 && input.vote !== -1)) {
        return badRequest('Expected body: { vote: 1 | -1 }');
      }

      const { data, error } = await client
        .from('story_votes')
        .upsert({
          story_id: params.storyId ?? '',
          user_id: user.id,
          vote: input.vote,
        })
        .select('story_id, vote')
        .single();

      if (error) throw error;

      return okay(data);
    },
  },
  {
    method: 'DELETE',
    path: '/stories/:storyId/vote',
    handler: async (req, params) => {
      const client = createDbClient(req);
      const user = await getUser(client);
      const { error } = await client
        .from('story_votes')
        .delete()
        .eq('story_id', params.storyId)
        .eq('user_id', user.id);

      if (error) throw error;

      return okay();
    },
  },
);
