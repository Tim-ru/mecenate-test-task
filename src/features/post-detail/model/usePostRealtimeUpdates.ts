import { useEffect } from 'react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { type PostsData } from '@/entities/post/model/feed-types';
import { type Post } from '@/entities/post/model/types';
import { prependCommentToPages } from '@/features/comments/model/cache';
import { type PostCommentsPage } from '@/features/comments/model/types';
import { subscribeToPostEvents } from '@/shared/api/ws/postEventsSocket';

type UsePostRealtimeUpdatesOptions = {
  postId: string | null;
};

export function usePostRealtimeUpdates({ postId }: UsePostRealtimeUpdatesOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) {
      return;
    }

    const unsubscribe = subscribeToPostEvents(postId, {
      onLikeUpdated: (event) => {
        queryClient.setQueryData<Post>(['post-detail', event.postId], (oldData) =>
          oldData ? { ...oldData, likesCount: event.likesCount } : oldData,
        );

        queryClient.setQueriesData<InfiniteData<PostsData>>({ queryKey: ['feed'], exact: false }, (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === event.postId ? { ...post, likesCount: event.likesCount } : post,
              ),
            })),
          };
        });
      },
      onCommentAdded: (event) => {
        queryClient.setQueryData<InfiniteData<PostCommentsPage>>(['post-comments', event.postId], (oldData) =>
          prependCommentToPages(oldData, event.comment),
        );

        queryClient.setQueryData<Post>(['post-detail', event.postId], (oldData) =>
          oldData ? { ...oldData, commentsCount: oldData.commentsCount + 1 } : oldData,
        );

        queryClient.setQueriesData<InfiniteData<PostsData>>({ queryKey: ['feed'], exact: false }, (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === event.postId ? { ...post, commentsCount: post.commentsCount + 1 } : post,
              ),
            })),
          };
        });
      },
    });

    return unsubscribe;
  }, [postId, queryClient]);
}
