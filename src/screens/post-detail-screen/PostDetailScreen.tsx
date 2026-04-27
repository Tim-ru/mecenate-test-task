import { type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { usePostDetailQuery } from '@/features/post-detail/model/usePostDetailQuery';
import { PostDetailSkeleton } from '@/screens/feed/PostDetailSkeleton';
import { Button, Text } from '@/shared/ui';
import { colors, radius, spacing } from '@/shared/theme/tokens';

type PostDetailScreenProps = {
  postId: string | null;
  children?: ReactNode;
};

export function PostDetailScreen({ postId, children }: PostDetailScreenProps) {
  const query = usePostDetailQuery({ postId });

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
});
