import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { type PostsData } from '@/entities/post/model/feed-types';
import { type PostTier } from '@/entities/post/model/types';
import { getFeed } from '@/features/feed/api/getFeed';
import { type ApiError } from '@/shared/api/types';

const FEED_PAGE_SIZE = 10;

type UseFeedQueryOptions = {
  tier?: PostTier;
};

export function useFeedQuery({ tier }: UseFeedQueryOptions) {
  return useInfiniteQuery<
    PostsData,
    ApiError,
    InfiniteData<PostsData>,
    ['feed', { tier?: PostTier }],
    string | null
  >({
    queryKey: ['feed', { tier }],
    queryFn: ({ pageParam }) =>
      getFeed({
        cursor: pageParam,
        limit: FEED_PAGE_SIZE,
        tier,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    retry: 1,
    throwOnError: false,
  });
}
