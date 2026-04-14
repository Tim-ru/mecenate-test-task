import { Image, StyleSheet, View } from 'react-native';
import { type Post } from '@/entities/post/model/types';
import { colors, radius, spacing } from '@/shared/theme/tokens';
import { Text } from '@/shared/ui/Text';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const isPaid = post.tier === 'paid';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text variant="caption">{post.author.displayName}</Text>
      </View>

      <Image source={{ uri: post.coverUrl }} style={styles.cover} />
      <Text variant="title">{post.title}</Text>

      {isPaid ? (
        <View style={styles.paidPreview}>
          <Text color={colors.textSecondary}>Контент доступен по подписке</Text>
        </View>
      ) : (
        <Text color={colors.textSecondary} numberOfLines={2}>
          {post.preview}
        </Text>
      )}

      <View style={styles.actions}>
        <Text variant="caption" color={colors.textSecondary}>
          Лайки: {post.likesCount}
        </Text>
        <Text variant="caption" color={colors.textSecondary}>
          Комментарии: {post.commentsCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  paidPreview: {
    minHeight: 40,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
