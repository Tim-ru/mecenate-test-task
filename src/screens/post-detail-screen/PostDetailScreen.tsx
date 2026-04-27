import { type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { type PostsData } from '@/entities/post/model/feed-types';
import { togglePostLike } from '@/features/post/api/togglePostLike';
import { AnimatedLikeButton } from '@/features/like/ui/AnimatedLikeButton';
import { usePostDetailQuery } from '@/features/post-detail/model/usePostDetailQuery';
import { PostDetailSkeleton } from '@/screens/feed/PostDetailSkeleton';
import { Button, Text } from '@/shared/ui';
import { colors, radius, spacing } from '@/shared/theme/tokens';

type PostDetailScreenProps = {
  postId: string | null;
  children?: ReactNode;
};

export function PostDetailScreen({ postId, children }: PostDetailScreenProps) {
  const queryClient = useQueryClient();
  const query = usePostDetailQuery({ postId });
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

      queryClient.setQueriesData<InfiniteData<PostsData>>({ queryKey: ['feed'], exact: false }, (oldData) => {
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
      });
    },
  });

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
    <ScrollView contentContainerStyle={styles.body}>
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
          onPress={() => {
            if (!postId || likeMutation.isPending) {
              return;
            }
            likeMutation.mutate(postId);
          }}
        />
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
