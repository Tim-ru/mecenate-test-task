import { Image, StyleSheet, View } from 'react-native';
import { usePostCommentsQuery } from '@/features/comments/model/usePostCommentsQuery';
import { type PostComment } from '@/features/comments/model/types';
import { Button, Text } from '@/shared/ui';
import { colors, spacing } from '@/shared/theme/tokens';

type PostCommentsSectionProps = {
  postId: string | null;
};

function dedupeCommentsById(comments: PostComment[]) {
  const seen = new Set<string>();

  return comments.filter((comment) => {
    if (seen.has(comment.id)) {
      return false;
    }

    seen.add(comment.id);
    return true;
  });
}

export function PostCommentsSection({ postId }: PostCommentsSectionProps) {
  const query = usePostCommentsQuery({ postId });

  if (!postId) {
    return null;
  }

  if (query.isPending) {
    return (
      <View style={styles.commentsBlock}>
        <Text variant="title">Комментарии</Text>
        <Text color={colors.textSecondary}>Загружаем комментарии...</Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.commentsBlock}>
        <Text variant="title">Комментарии</Text>
        <Text color={colors.textSecondary}>Не удалось загрузить комментарии</Text>
        <Button title="Повторить" onPress={() => void query.refetch()} />
      </View>
    );
  }

  const comments = dedupeCommentsById(query.data.pages.flatMap((page) => page.comments));

  return (
    <View style={styles.commentsBlock}>
      <Text variant="title">Комментарии</Text>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <Image source={{ uri: comment.author.avatarUrl }} style={styles.commentAvatar} />
            <View style={styles.commentBody}>
              <Text variant="caption">{comment.author.displayName}</Text>
              <Text>{comment.text}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text color={colors.textSecondary}>Комментариев пока нет</Text>
      )}
      {query.hasNextPage ? (
        <Button
          title={query.isFetchingNextPage ? 'Загружаем...' : 'Показать еще'}
          onPress={() => void query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
