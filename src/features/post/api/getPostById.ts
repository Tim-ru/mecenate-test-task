import { type Post } from '@/entities/post/model/types';
import { type PostDetailResponse } from '@/features/post/model/post-api-types';
import { apiClient } from '@/shared/api/client';

export async function getPostById(postId: string): Promise<Post> {
  const response = await apiClient.get<PostDetailResponse>(`/posts/${postId}`);
  return response.data.data.post;
}
