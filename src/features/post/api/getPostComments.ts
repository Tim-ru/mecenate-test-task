import { type Comment, type CommentsResponse } from '@/features/post/model/post-api-types';
import { apiClient } from '@/shared/api/client';

type GetPostCommentsParams = {
  cursor?: string;
  limit?: number;
};

export async function getPostComments(
  postId: string,
  params: GetPostCommentsParams = {},
): Promise<Comment[]> {
  const response = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments`, { params });
  return response.data.data.comments;
}
