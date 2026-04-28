import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { getPostCommentsPage } from '@/features/comments/api/getPostCommentsPage';
import { type PostCommentsPage } from '@/features/comments/model/types';
import { type ApiError } from '@/shared/api/types';

const COMMENTS_PAGE_SIZE = 20;

type UsePostCommentsQueryOptions = {
  postId: string | null;
};

export function usePostCommentsQuery({ postId }: UsePostCommentsQueryOptions) {
  return useInfiniteQuery<
    PostCommentsPage,
    ApiError,
    InfiniteData<PostCommentsPage>,
    ['post-comments', string | null],
    string | null
  >({
    queryKey: ['post-comments', postId],
    queryFn: ({ pageParam }) =>
      getPostCommentsPage(postId as string, {
        cursor: pageParam,
        limit: COMMENTS_PAGE_SIZE,
      }),
    enabled: Boolean(postId),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor != null ? lastPage.nextCursor : undefined,
    retry: 1,
    throwOnError: false,
  });
}
