import { type PostComment } from '@/features/comments/model/types';
import { apiClient } from '@/shared/api/client';

type CreatePostCommentPayload = {
  text: string;
};

type CreatePostCommentResponse = {
  ok: boolean;
  data: {
    comment: PostComment;
  };
};

export async function createPostComment(postId: string, payload: CreatePostCommentPayload) {
  const response = await apiClient.post<CreatePostCommentResponse>(`/posts/${postId}/comments`, payload);
  return response.data.data.comment;
}
