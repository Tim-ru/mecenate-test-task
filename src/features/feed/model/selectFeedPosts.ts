import { type InfiniteData } from '@tanstack/react-query';
import { type PostsData } from '@/entities/post/model/feed-types';
import { type Post } from '@/entities/post/model/types';

export function selectFeedPosts(data?: InfiniteData<PostsData>): Post[] {
  return data?.pages.flatMap((page) => page.posts) ?? [];
}
