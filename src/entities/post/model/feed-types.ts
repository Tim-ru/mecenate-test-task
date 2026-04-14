import { type Post, type PostTier } from '@/entities/post/model/types';

export type PostsData = {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type PostsResponse = {
  ok: boolean;
  data: PostsData;
};

export type PostsQueryParams = {
  cursor?: string | null;
  limit?: number;
  tier?: PostTier;
  simulateError?: boolean;
};
