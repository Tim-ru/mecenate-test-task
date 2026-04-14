import { memo, useMemo } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { type Post } from '@/entities/post/model/types';
import { PostCard } from '@/entities/post/ui/PostCard';
import { type PostsData } from '@/entities/post/model/feed-types';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { Loader } from '@/shared/ui/Loader';
import { Text } from '@/shared/ui/Text';
import { colors, spacing } from '@/shared/theme/tokens';

type FeedListProps = {
  data?: InfiniteData<PostsData>;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
};

const keyExtractor = (item: Post) => item.id;

const renderItem: ListRenderItem<Post> = ({ item }) => <PostCard post={item} />;

function FeedListBase({
  data,
  isRefreshing,
  isFetchingNextPage,
  onRefresh,
  onEndReached,
}: FeedListProps) {
  const posts = useMemo(() => selectFeedPosts(data), [data]);

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
      ListFooterComponent={isFetchingNextPage ? <Loader style={styles.nextPageLoader} size="small" /> : null}
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
});
