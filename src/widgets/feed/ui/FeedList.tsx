import { memo, useCallback, useMemo } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { type Post } from '@/entities/post/model/types';
import { PostCard } from '@/entities/post/ui/PostCard';
import { type PostsData } from '@/entities/post/model/feed-types';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { SkeletonBone } from '@/shared/ui/SkeletonBone';
import { Text } from '@/shared/ui/Text';
import { colors, spacing } from '@/shared/theme/tokens';

type FeedListProps = {
  data?: InfiniteData<PostsData>;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onRetryNextPage: () => void;
  onEmptyAction: () => void;
  onOpenPost: (postId: string) => void;
  onLikePress: (postId: string) => void;
  onCommentPress: (postId: string) => void;
};

const keyExtractor = (item: Post) => item.id;

function FeedListBase({
  data,
  isRefreshing,
  isFetchingNextPage,
  isFetchNextPageError,
  hasNextPage,
  onRefresh,
  onEndReached,
  onRetryNextPage,
  onEmptyAction,
  onOpenPost,
  onLikePress,
  onCommentPress,
}: FeedListProps) {
  const posts = useMemo(() => selectFeedPosts(data), [data]);
  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => (
      <PostCard
        post={item}
        onOpenPost={onOpenPost}
        onLikePress={onLikePress}
        onCommentPress={onCommentPress}
      />
    ),
    [onCommentPress, onLikePress, onOpenPost],
  );
  const footer = useMemo(() => {
    if (isFetchingNextPage) {
      return <Loader style={styles.nextPageLoader} size="small" />;
    }

    if (isFetchNextPageError) {
      return (
        <View style={styles.paginationError}>
          <Text color={colors.textSecondary}>Не удалось загрузить следующую страницу</Text>
          <Button title="Повторить" onPress={onRetryNextPage} style={styles.retryButton} />
        </View>
      );
    }

    if (hasNextPage && posts.length > 0) {
      return (
        <View style={styles.loadMoreWrap}>
          <Button title="Показать еще" onPress={onEndReached} style={styles.loadMoreButton} />
        </View>
      );
    }

    return null;
  }, [hasNextPage, isFetchNextPageError, isFetchingNextPage, onEndReached, onRetryNextPage, posts.length]);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={posts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="jellyfish-outline" size={56} color={colors.accent} />
          </View>
          <Text variant="title" style={styles.emptyTitle}>
            По вашему запросу ничего не найдено
          </Text>
          <Button title="На главную" onPress={onEmptyAction} style={styles.emptyAction} />
        </View>
      }
      ListFooterComponent={footer}
      showsVerticalScrollIndicator={false}
    />
  );
}

export const FeedList = memo(FeedListBase);

const SKELETON_ITEMS_COUNT = 3;

function PostCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <SkeletonBone width={40} height={40} borderRadius={20} />
        <SkeletonBone width={120} height={20} borderRadius={10} />
      </View>
      <SkeletonBone width="100%" style={styles.skeletonCover} />
      <SkeletonBone width={164} height={26} borderRadius={13} />
      <SkeletonBone width="92%" height={20} borderRadius={10} />
      <View style={styles.skeletonActions}>
        <SkeletonBone width={64} height={36} borderRadius={18} />
        <SkeletonBone width={64} height={36} borderRadius={18} />
      </View>
    </View>
  );
}

function FeedListSkeletonBase() {
  return (
    <View style={styles.content}>
      {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </View>
  );
}

export const FeedListSkeleton = memo(FeedListSkeletonBase);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyIconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyAction: {
    width: '100%',
  },
  nextPageLoader: {
    paddingVertical: spacing.md,
  },
  paginationError: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  retryButton: {
    height: 36,
    paddingHorizontal: spacing.lg,
  },
  loadMoreWrap: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  loadMoreButton: {
    minWidth: 180,
  },
  skeletonCard: {
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  skeletonCover: {
    marginHorizontal: -spacing.lg,
    aspectRatio: 1,
  },
  skeletonActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
