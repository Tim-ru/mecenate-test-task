import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, View } from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { togglePostLike } from '@/features/post/api/togglePostLike';
import {
  PostCommentComposer,
  PostCommentsSection,
} from '@/features/comments/ui/PostCommentsSection';
import { FeedUiStore, type FeedFilter } from '@/features/feed/model/FeedUiStore';
import { type PostsData } from '@/entities/post/model/feed-types';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { useFeedQuery } from '@/features/feed/model/useFeedQuery';
import { ErrorState, Screen, SegmentedControl, SlidePanel, Text } from '@/shared/ui';
import { colors, spacing } from '@/shared/theme/tokens';
import { FeedList, FeedListSkeleton } from '@/widgets/feed/ui/FeedList';
import { PostDetailScreen } from '@/screens/post-detail-screen/PostDetailScreen';

const illustrationSticker = require('@/../assets/illustration_sticker.png') as number;

const FILTER_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

export const FeedScreen = observer(function FeedScreen() {
  const [store] = useState(() => new FeedUiStore());
  const [openedPostId, setOpenedPostId] = useState<string | null>(null);
  const [commentsLoadSignal, setCommentsLoadSignal] = useState(0);
  const queryClient = useQueryClient();
  const query = useFeedQuery({ tier: store.tierFilter });
  const { refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  const hasPosts = selectFeedPosts(query.data).length > 0;
  const isInitialLoading = query.isPending && !hasPosts;
  const shouldShowFullScreenError = Boolean(query.error) && !hasPosts;

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleFilterChange = useCallback(
    (next: FeedFilter) => {
      store.setFilter(next);
    },
    [store],
  );

  const handleLoadNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleEmptyAction = useCallback(() => {
    store.setFilter('all');
    void refetch();
  }, [refetch, store]);

  const handleLikeMutation = useMutation({
    mutationFn: togglePostLike,
    onSuccess: (likeData, postId) => {
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
                post.id === postId
                  ? { ...post, isLiked: likeData.isLiked, likesCount: likeData.likesCount }
                  : post,
              ),
            })),
          };
        },
      );
    },
  });

  const handleOpenPost = useCallback((postId: string) => {
    setOpenedPostId(postId);
    setCommentsLoadSignal(0);
  }, []);

  const handleClosePost = useCallback(() => {
    setOpenedPostId(null);
    setCommentsLoadSignal(0);
  }, []);

  const handleLikePress = useCallback(
    (postId: string) => {
      handleLikeMutation.mutate(postId);
    },
    [handleLikeMutation],
  );

  const handleCommentPress = useCallback((postId: string) => {
    setOpenedPostId(postId);
    setCommentsLoadSignal(0);
  }, []);

  const handleDetailReachEnd = useCallback(() => {
    setCommentsLoadSignal((signal) => signal + 1);
  }, []);

  const isPostModalVisible = Boolean(openedPostId);
  if (isInitialLoading) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text variant="title">Лента</Text>
          <SegmentedControl
            options={FILTER_OPTIONS}
            value={store.filter}
            onChange={handleFilterChange}
          />
        </View>
        <FeedListSkeleton />
      </Screen>
    );
  }

  if (shouldShowFullScreenError) {
    return (
      <Screen>
        <ErrorState
          message="Не удалось загрузить публикации"
          illustration={illustrationSticker}
          onRetry={() => void refetch()}
          retryLabel="Повторить"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title">Лента</Text>
        <SegmentedControl
          options={FILTER_OPTIONS}
          value={store.filter}
          onChange={handleFilterChange}
        />
      </View>

      <FeedList
        data={query.data}
        isRefreshing={query.isRefetching && !query.isFetchingNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isFetchNextPageError={query.isFetchNextPageError}
        hasNextPage={Boolean(query.hasNextPage)}
        onRefresh={handleRefresh}
        onEndReached={handleLoadNextPage}
        onRetryNextPage={handleLoadNextPage}
        onEmptyAction={handleEmptyAction}
        onOpenPost={handleOpenPost}
        onLikePress={handleLikePress}
        onCommentPress={handleCommentPress}
      />

      <SlidePanel visible={isPostModalVisible} onClose={handleClosePost}>
        <View style={styles.panelContainer}>
          <View style={styles.panelHeader}>
            <Text variant="title">Публикация</Text>
            <Pressable onPress={handleClosePost} hitSlop={8}>
              <Text color={colors.accent}>Закрыть</Text>
            </Pressable>
          </View>

          <PostDetailScreen
            postId={openedPostId}
            onReachEnd={handleDetailReachEnd}
            footer={<PostCommentComposer postId={openedPostId} />}
          >
            <PostCommentsSection postId={openedPostId} loadMoreSignal={commentsLoadSignal} />
          </PostDetailScreen>
        </View>
      </SlidePanel>
    </Screen>
  );
});

const styles = StyleSheet.create({
  header: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  panelContainer: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
