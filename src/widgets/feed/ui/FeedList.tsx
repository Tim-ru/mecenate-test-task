import { memo, useMemo } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { type Post } from '@/entities/post/model/types';
import { PostCard } from '@/entities/post/ui/PostCard';
import { type PostsData } from '@/entities/post/model/feed-types';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Text } from '@/shared/ui/Text';
import { colors, spacing } from '@/shared/theme/tokens';

type FeedListProps = {
  data?: InfiniteData<PostsData>;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onRetryNextPage: () => void;
};

const keyExtractor = (item: Post) => item.id;

const renderItem: ListRenderItem<Post> = ({ item }) => <PostCard post={item} />;

function FeedListBase({
  data,
  isRefreshing,
  isFetchingNextPage,
  isFetchNextPageError,
  onRefresh,
  onEndReached,
  onRetryNextPage,
}: FeedListProps) {
  const posts = useMemo(() => selectFeedPosts(data), [data]);
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

    return null;
  }, [isFetchNextPageError, isFetchingNextPage, onRetryNextPage]);

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
          <Text color={colors.textSecondary}>Публикаций пока нет</Text>
        </View>
      }
      ListFooterComponent={footer}
      showsVerticalScrollIndicator={false}
    />
  );
}

export const FeedList = memo(FeedListBase);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
});
