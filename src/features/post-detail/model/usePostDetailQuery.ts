import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '@/features/post-detail/api/getPostDetail';

type UsePostDetailQueryOptions = {
  postId: string | null;
};

export function usePostDetailQuery({ postId }: UsePostDetailQueryOptions) {
  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => getPostDetail(postId as string),
    enabled: Boolean(postId),
    retry: 1,
    throwOnError: false,
  });
}
