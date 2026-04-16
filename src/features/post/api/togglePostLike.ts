import { type LikeResponse } from '@/features/post/model/post-api-types';
import { apiClient } from '@/shared/api/client';

type TogglePostLikeResult = {
  isLiked: boolean;
  likesCount: number;
};

export async function togglePostLike(postId: string): Promise<TogglePostLikeResult> {
  const response = await apiClient.post<LikeResponse>(`/posts/${postId}/like`);
  return response.data.data;
}
