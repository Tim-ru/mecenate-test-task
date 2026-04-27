import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { type InfiniteData } from '@tanstack/react-query';
import { getPostById } from '@/features/post/api/getPostById';
import { getPostComments } from '@/features/post/api/getPostComments';
import { togglePostLike } from '@/features/post/api/togglePostLike';
import { type Comment } from '@/features/post/model/post-api-types';
import { FeedUiStore, type FeedFilter } from '@/features/feed/model/FeedUiStore';
import { type PostsData } from '@/entities/post/model/feed-types';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { useFeedQuery } from '@/features/feed/model/useFeedQuery';
import { ErrorState, Screen, SegmentedControl, SlidePanel, Text } from '@/shared/ui';
import { CommentLikeButton } from '@/shared/ui/CommentLikeButton';
import { colors, radius, spacing } from '@/shared/theme/tokens';
import { FeedList, FeedListSkeleton } from '@/widgets/feed/ui/FeedList';
import { PostDetailSkeleton } from '@/screens/feed/PostDetailSkeleton';

const illustrationSticker = require('@/../assets/illustration_sticker.png') as number;

const FILTER_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

export const FeedScreen = observer(function FeedScreen() {
  const [store] = useState(() => new FeedUiStore());
  const [openedPostId, setOpenedPostId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const query = useFeedQuery({ tier: store.tierFilter });
  const { refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  const hasPosts = selectFeedPosts(query.data).length > 0;
  const isInitialLoading = query.isPending && !hasPosts;
  const shouldShowFullScreenError = Boolean(query.error) && !hasPosts;

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

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

  const detailPostQuery = useQuery({
    queryKey: ['post', openedPostId],
    queryFn: () => getPostById(openedPostId as string),
    enabled: Boolean(openedPostId),
  });

  const commentsQuery = useQuery({
    queryKey: ['post', openedPostId, 'comments'],
    queryFn: () => getPostComments(openedPostId as string, { limit: 20 }),
    enabled: Boolean(openedPostId),
  });

  const handleOpenPost = useCallback((postId: string) => {
    setOpenedPostId(postId);
  }, []);

  const handleClosePost = useCallback(() => {
    setOpenedPostId(null);
  }, []);

  const handleLikePress = useCallback(
    (postId: string) => {
      handleLikeMutation.mutate(postId);
    },
    [handleLikeMutation],
  );

  const handleCommentPress = useCallback((postId: string) => {
    setOpenedPostId(postId);
  }, []);

  const handleCommentLike = useCallback(
    (commentId: string) => {
      queryClient.setQueryData<Comment[]>(
        ['post', openedPostId, 'comments'],
        (old) =>
          old?.map((c) =>
            c.id === commentId
              ? { ...c, isLiked: !c.isLiked, likesCount: (c.likesCount ?? 0) + (c.isLiked ? -1 : 1) }
              : c,
          ),
      );
    },
    [openedPostId, queryClient],
  );

  const isPostModalVisible = Boolean(openedPostId);
  const isPostLoading = detailPostQuery.isPending || commentsQuery.isPending;
  const postErrorMessage = useMemo(() => {
    if (detailPostQuery.error || commentsQuery.error) {
      return 'Не удалось загрузить пост или комментарии';
    }
    return null;
  }, [commentsQuery.error, detailPostQuery.error]);

  if (isInitialLoading) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text variant="title">Лента</Text>
          <SegmentedControl
            options={FILTER_OPTIONS}
            value={store.filter}
            onChange={(next) => store.setFilter(next)}
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
          onChange={(next) => store.setFilter(next)}
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

          {isPostLoading ? (
            <PostDetailSkeleton />
          ) : postErrorMessage ? (
            <View style={styles.panelCenteredState}>
              <Text color={colors.textSecondary}>{postErrorMessage}</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.panelBody}>
              {detailPostQuery.data ? (
                <>
                  <Image source={{ uri: detailPostQuery.data.coverUrl }} style={styles.panelCover} />
                  <Text variant="title">{detailPostQuery.data.title}</Text>
                  <Text>{detailPostQuery.data.body || detailPostQuery.data.preview}</Text>
                </>
              ) : null}

              <View style={styles.commentsBlock}>
                <Text variant="title">Комментарии</Text>
                {commentsQuery.data?.length ? (
                  commentsQuery.data.map((comment) => (
                    <View key={comment.id} style={styles.commentCard}>
                      <Image
                        source={{ uri: comment.author.avatarUrl }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentBody}>
                        <Text variant="caption">{comment.author.displayName}</Text>
                        <Text>{comment.text}</Text>
                      </View>
                      <CommentLikeButton
                        count={comment.likesCount ?? 0}
                        isLiked={comment.isLiked}
                        onPress={() => handleCommentLike(comment.id)}
                      />
                    </View>
                  ))
                ) : (
                  <Text color={colors.textSecondary}>Комментариев пока нет</Text>
                )}
              </View>
            </ScrollView>
          )}
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
  panelCenteredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBody: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  panelCover: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  commentsBlock: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  commentBody: {
    flex: 1,
    gap: spacing.xs,
  },
});
