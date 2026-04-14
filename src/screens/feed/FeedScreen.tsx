import { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, View } from 'react-native';
import { FeedUiStore, type FeedFilter } from '@/features/feed/model/FeedUiStore';
import { selectFeedPosts } from '@/features/feed/model/selectFeedPosts';
import { useFeedQuery } from '@/features/feed/model/useFeedQuery';
import { Button, ErrorState, Loader, Screen, Text } from '@/shared/ui';
import { colors, spacing } from '@/shared/theme/tokens';
import { FeedList } from '@/widgets/feed/ui/FeedList';

const FILTER_OPTIONS: Array<{ value: FeedFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

export const FeedScreen = observer(function FeedScreen() {
  const [store] = useState(() => new FeedUiStore());
  const query = useFeedQuery({ tier: store.tierFilter });

  const hasPosts = selectFeedPosts(query.data).length > 0;
  const isInitialLoading = query.isPending && !hasPosts;
  const shouldShowFullScreenError = Boolean(query.error) && !hasPosts;

  const handleRefresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  const handleLoadNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }

    void query.fetchNextPage();
  }, [query]);

  if (isInitialLoading) {
    return (
      <Screen style={styles.centered}>
        <Loader />
      </Screen>
    );
  }

  if (shouldShowFullScreenError) {
    return (
      <Screen style={styles.centered}>
        <ErrorState message="Не удалось загрузить публикации" onRetry={() => void query.refetch()} retryLabel="Повтор" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="title">Лента</Text>
        <View style={styles.filters}>
          {FILTER_OPTIONS.map((option) => {
            const isActive = store.filter === option.value;

            return (
              <Button
                key={option.value}
                title={option.label}
                onPress={() => store.setFilter(option.value)}
                style={isActive ? styles.filterActive : styles.filterInactive}
              />
            );
          })}
        </View>
      </View>

      <FeedList
        data={query.data}
        isRefreshing={query.isRefetching && !query.isFetchingNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isFetchNextPageError={query.isFetchNextPageError}
        onRefresh={handleRefresh}
        onEndReached={handleLoadNextPage}
        onRetryNextPage={handleLoadNextPage}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterActive: {
    height: 38,
    paddingHorizontal: spacing.md,
  },
  filterInactive: {
    height: 38,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
});
