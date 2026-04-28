import { useCallback, useRef, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { type PostsData } from '@/entities/post/model/feed-types';
import { togglePostLike } from '@/features/post/api/togglePostLike';
import { AnimatedLikeButton } from '@/features/like/ui/AnimatedLikeButton';
import { usePostDetailQuery } from '@/features/post-detail/model/usePostDetailQuery';
import { usePostRealtimeUpdates } from '@/features/post-detail/model/usePostRealtimeUpdates';
import { PostDetailSkeleton } from '@/screens/feed/PostDetailSkeleton';
import { Button, Text } from '@/shared/ui';
import { colors, radius, spacing } from '@/shared/theme/tokens';

type PostDetailScreenProps = {
  postId: string | null;
  children?: ReactNode;
  footer?: ReactNode;
  onReachEnd?: () => void;
};

export function PostDetailScreen({ postId, children, footer, onReachEnd }: PostDetailScreenProps) {
  const queryClient = useQueryClient();
  const lastReachedEndOffset = useRef(-1);
  const query = usePostDetailQuery({ postId });
  usePostRealtimeUpdates({ postId });
  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onSuccess: (likeData, likedPostId) => {
      queryClient.setQueryData(['post-detail', likedPostId], (oldData: typeof query.data) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          isLiked: likeData.isLiked,
          likesCount: likeData.likesCount,
        };
      });

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
                post.id === likedPostId
                  ? { ...post, isLiked: likeData.isLiked, likesCount: likeData.likesCount }
                  : post,
              ),
            })),
          };
        },
      );
    },
  });

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onReachEnd) {
        return;
      }

      const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
      const visibleBottom = contentOffset.y + layoutMeasurement.height;
      const isNearBottom = visibleBottom >= contentSize.height - 120;
      if (!isNearBottom) {
        return;
      }

      if (Math.abs(contentOffset.y - lastReachedEndOffset.current) < 40) {
        return;
      }

      lastReachedEndOffset.current = contentOffset.y;
      onReachEnd();
    },
    [onReachEnd],
  );

  const handleLikePress = useCallback(() => {
    if (!postId || likeMutation.isPending) {
      return;
    }

    likeMutation.mutate(postId);
  }, [likeMutation, postId]);

  if (query.isPending) {
    return <PostDetailSkeleton />;
  }

  if (query.isError) {
    return (
      <View style={styles.centeredState}>
        <Text color={colors.textSecondary}>Не удалось загрузить пост</Text>
        <Button title="Повторить" onPress={() => void query.refetch()} style={styles.retryButton} />
      </View>
    );
  }

  if (!query.data) {
    return (
      <View style={styles.centeredState}>
        <Text color={colors.textSecondary}>Пост не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.body}
        onScroll={handleScroll}
        scrollEventThrottle={120}
      >
        <View style={styles.authorRow}>
          <Image source={{ uri: query.data.author.avatarUrl }} style={styles.avatar} />
          <Text variant="caption">{query.data.author.displayName}</Text>
        </View>
        <Image source={{ uri: query.data.coverUrl }} style={styles.cover} />
        <Text variant="title">{query.data.title}</Text>
        <Text>{query.data.body || query.data.preview}</Text>
        <View style={styles.actionsRow}>
          <AnimatedLikeButton
            isLiked={query.data.isLiked}
            count={query.data.likesCount}
            disabled={likeMutation.isPending}
            onPress={handleLikePress}
          />
        </View>
        {children}
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    minWidth: 180,
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    marginBottom: spacing.xl,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
