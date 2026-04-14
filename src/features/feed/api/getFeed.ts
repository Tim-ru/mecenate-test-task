import { type PostsData, type PostsQueryParams, type PostsResponse } from '@/entities/post/model/feed-types';
import { apiClient } from '@/shared/api/client';

type GetFeedRequestParams = {
  cursor?: string;
  limit?: number;
  tier?: PostsQueryParams['tier'];
  simulate_error?: boolean;
};

function toRequestParams(params: PostsQueryParams): GetFeedRequestParams {
  return {
    cursor: params.cursor ?? undefined,
    limit: params.limit,
    tier: params.tier,
    simulate_error: params.simulateError,
  };
}

export async function getFeed(params: PostsQueryParams = {}): Promise<PostsData> {
  const response = await apiClient.get<PostsResponse>('/posts', {
    params: toRequestParams(params),
  });

  return response.data.data;
}
