import { useEffect, useState } from 'react';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { type PostsData } from '@/entities/post/model/feed-types';
import { type Post } from '@/entities/post/model/types';
import { createPostComment } from '@/features/comments/api/createPostComment';
import { dedupeCommentsById, prependCommentToPages } from '@/features/comments/model/cache';
import { usePostCommentsQuery } from '@/features/comments/model/usePostCommentsQuery';
import { type PostCommentsPage } from '@/features/comments/model/types';
import { HeartFilledIcon, HeartOutlineIcon, PaperPlaneTopIcon } from '@/shared/ui/icons';
import { Button, Text } from '@/shared/ui';
import { colors, fontFamily, radius, spacing } from '@/shared/theme/tokens';

type PostCommentsSectionProps = {
  postId: string | null;
  loadMoreSignal: number;
};

type PostCommentComposerProps = {
  postId: string | null;
};

type CommentLikeState = {
  isLiked: boolean;
  likesCount: number;
};

export function PostCommentsSection({ postId, loadMoreSignal }: PostCommentsSectionProps) {
  const query = usePostCommentsQuery({ postId });
  const [commentLikeMap, setCommentLikeMap] = useState<Record<string, CommentLikeState>>({});

  useEffect(() => {
    if (!loadMoreSignal || !query.hasNextPage || query.isFetchingNextPage) {
      return;
    }

    void query.fetchNextPage();
  }, [loadMoreSignal, query]);

  if (!postId) {
    return null;
  }

  const comments = dedupeCommentsById((query.data?.pages ?? []).flatMap((page) => page.comments));

  if (query.isPending) {
    return (
      <View style={styles.commentsBlock}>
        <Text color={colors.textSecondary}>Загружаем комментарии...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.commentsBlock}>
        <Text color={colors.textSecondary}>Не удалось загрузить комментарии</Text>
        <Button title="Повторить" onPress={() => void query.refetch()} />
      </View>
    );
  }

  const handleToggleCommentLike = (commentId: string, isLiked: boolean, likesCount: number) => {
    setCommentLikeMap((previousMap) => {
      const previousState = previousMap[commentId] ?? { isLiked, likesCount };
      const nextIsLiked = !previousState.isLiked;
      const nextLikesCount = previousState.likesCount + (previousState.isLiked ? -1 : 1);

      return {
        ...previousMap,
        [commentId]: {
          isLiked: nextIsLiked,
          likesCount: Math.max(0, nextLikesCount),
        },
      };
    });
  };

  return (
    <View style={styles.commentsBlock}>
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle} color={colors.textSecondary}>
          {comments.length} комментария
        </Text>
        <Pressable style={styles.commentsSortButton}>
          <Text style={styles.commentsSort} color={colors.accent}>
            Сначала новые
          </Text>
        </Pressable>
      </View>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <Image source={{ uri: comment.author.avatarUrl }} style={styles.commentAvatar} />
            <View style={styles.commentBody}>
              <Text style={styles.commentAuthor}>{comment.author.displayName}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
            <Pressable
              onPress={() =>
                handleToggleCommentLike(
                  comment.id,
                  Boolean(comment.isLiked),
                  comment.likesCount ?? 0,
                )
              }
              hitSlop={8}
              style={styles.commentLikeButton}
            >
              {(() => {
                const fallbackState = {
                  isLiked: Boolean(comment.isLiked),
                  likesCount: comment.likesCount ?? 0,
                };
                const likeState = commentLikeMap[comment.id] ?? fallbackState;

                return (
                  <>
                    {likeState.isLiked ? (
                      <HeartFilledIcon color={colors.actionPillLiked} size={15} />
                    ) : (
                      <HeartOutlineIcon color={colors.textSecondary} size={15} />
                    )}
                    <Text
                      variant="caption"
                      color={likeState.isLiked ? colors.actionPillLiked : colors.textSecondary}
                    >
                      {likeState.likesCount}
                    </Text>
                  </>
                );
              })()}
            </Pressable>
          </View>
        ))
      ) : (
        <Text color={colors.textSecondary}>Комментариев пока нет</Text>
      )}
      {query.isFetchingNextPage ? (
        <Text color={colors.textSecondary}>Загружаем еще комментарии...</Text>
      ) : null}
    </View>
  );
}

export function PostCommentComposer({ postId }: PostCommentComposerProps) {
  const queryClient = useQueryClient();
  const [draftCommentText, setDraftCommentText] = useState('');

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId: targetPostId, text }: { postId: string; text: string }) =>
      createPostComment(targetPostId, { text }),
    onSuccess: (createdComment) => {
      queryClient.setQueryData<InfiniteData<PostCommentsPage>>(
        ['post-comments', createdComment.postId],
        (oldData) => prependCommentToPages(oldData, createdComment),
      );
      queryClient.setQueryData<Post>(['post-detail', createdComment.postId], (oldData) =>
        oldData ? { ...oldData, commentsCount: oldData.commentsCount + 1 } : oldData,
      );
      queryClient.setQueriesData<InfiniteData<PostsData>>(
        { queryKey: ['feed'], exact: false },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === createdComment.postId
                  ? { ...post, commentsCount: post.commentsCount + 1 }
                  : post,
              ),
            })),
          };
        },
      );

      setDraftCommentText('');
    },
  });

  const handleSubmitComment = () => {
    if (!postId || createCommentMutation.isPending) {
      return;
    }

    const normalizedText = draftCommentText.trim();
    if (!normalizedText) {
      return;
    }

    createCommentMutation.mutate({
      postId,
      text: normalizedText,
    });
  };

  return (
    <View style={styles.composer}>
      <TextInput
        value={draftCommentText}
        onChangeText={setDraftCommentText}
        placeholder="Ваш комментарий"
        placeholderTextColor="#A4AAB0"
        maxLength={500}
        style={styles.input}
        editable={!createCommentMutation.isPending}
      />
      <Pressable
        onPress={handleSubmitComment}
        hitSlop={8}
        disabled={createCommentMutation.isPending || draftCommentText.trim().length === 0}
        style={styles.sendButton}
      >
        {(state) => {
          const withHovered = state as typeof state & { hovered?: boolean };
          const isDisabled =
            createCommentMutation.isPending || draftCommentText.trim().length === 0;
          const isHovered = Boolean(withHovered.hovered);

          return (
            <PaperPlaneTopIcon
              variant={
                isDisabled
                  ? 'disabled'
                  : state.pressed
                  ? 'pressed'
                  : isHovered
                  ? 'hover'
                  : 'default'
              }
            />
          );
        }}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  commentsBlock: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
  commentsSort: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
  },
  commentsSortButton: {
    opacity: 1,
  },
  composer: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  input: {
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#EFF2F7',
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    flex: 1,
  },
  sendButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  commentBody: {
    flex: 1,
    gap: 2,
  },
  commentAuthor: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  commentText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: 2,
  },
});
