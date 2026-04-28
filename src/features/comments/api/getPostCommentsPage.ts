import { type PostCommentsPage, type PostCommentsResponse } from '@/features/comments/model/types';
import { apiClient } from '@/shared/api/client';

type GetPostCommentsPageParams = {
  cursor?: string | null;
  limit?: number;
};

export async function getPostCommentsPage(
  postId: string,
  params: GetPostCommentsPageParams = {},
): Promise<PostCommentsPage> {
  const response = await apiClient.get<PostCommentsResponse>(`/posts/${postId}/comments`, { params });
  return response.data.data;
}
