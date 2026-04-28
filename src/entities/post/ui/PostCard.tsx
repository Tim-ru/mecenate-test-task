import { memo, useCallback, useMemo, useState } from 'react';
import { BlurView } from 'expo-blur';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { type Post } from '@/entities/post/model/types';
import { AnimatedLikeButton } from '@/features/like/ui/AnimatedLikeButton';
import { colors, radius, spacing } from '@/shared/theme/tokens';
import { ActionPill } from '@/shared/ui/ActionPill';
import { MoneyIcon } from '@/shared/ui/icons/MoneyIcon';
import { Text } from '@/shared/ui/Text';

type PostCardProps = {
  post: Post;
  onOpenPost?: (postId: string) => void;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
};

const DONATE_MIN_WIDTH = 239;
const COVER_HEIGHT = 210;

function PostCardBase({ post, onOpenPost, onLikePress, onCommentPress }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPaid = post.tier === 'paid';
  const previewText = post.preview || post.body;
  const shouldShowMoreLink = !isPaid && previewText.length > 90;
  const canOpenPost = !isPaid && Boolean(post.body?.trim());
  const postText = useMemo(
    () => (isExpanded && canOpenPost ? post.body : previewText),
    [canOpenPost, isExpanded, post.body, previewText],
  );

  const handleOpenPost = useCallback(() => {
    if (isPaid) {
      return;
    }

    if (onOpenPost) {
      onOpenPost(post.id);
      return;
    }

    if (canOpenPost) {
      setIsExpanded(true);
    }
  }, [canOpenPost, isPaid, onOpenPost, post.id]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handleLike = useCallback(() => {
    onLikePress?.(post.id);
  }, [onLikePress, post.id]);

  const handleComment = useCallback(() => {
    onCommentPress?.(post.id);
  }, [onCommentPress, post.id]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text variant="body" color={colors.textPrimary} numberOfLines={1} style={styles.authorName}>
          {post.author.displayName}
        </Text>
      </View>

      <Pressable
        disabled={isPaid}
        onPress={handleOpenPost}
        accessibilityRole={!isPaid ? 'button' : undefined}
        accessibilityLabel={!isPaid ? 'Открыть пост' : undefined}
        style={({ pressed }) => [
          styles.coverWrap,
          pressed && !isPaid ? styles.coverPressed : undefined,
        ]}
      >
        <Image
          source={{ uri: post.coverUrl }}
          style={[styles.cover, isPaid ? styles.coverPaid : styles.coverFree]}
          resizeMode="cover"
        />
        {isPaid ? (
          <View style={styles.paidOverlay} pointerEvents="box-none">
            {Platform.OS === 'web' ? (
              <View
                style={[styles.blurFallbackWeb, StyleSheet.absoluteFill]}
                pointerEvents="none"
              />
            ) : (
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            )}
            <View style={[styles.scrim, StyleSheet.absoluteFill]} pointerEvents="none" />
            <View style={styles.paidContent}>
              <View style={styles.lockBadge}>
                <MoneyIcon size={22} color={colors.onAccent} />
              </View>
              <Text variant="overlay" color={colors.onAccent} style={styles.paidMessage}>
                Контент скрыт пользователем.{'\n'}Доступ откроется после доната
              </Text>
              <View style={styles.donateButton}>
                <Text variant="button" color={colors.onAccent}>
                  Отправить донат
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </Pressable>

      {!isPaid ? (
        <Pressable onPress={handleOpenPost} style={styles.titleWrap}>
          <Text variant="title">{post.title}</Text>
        </Pressable>
      ) : (
        <View style={styles.paidTextSkeleton} accessibilityLabel="Текст поста скрыт">
          <View style={styles.paidSkeletonLine} />
          <View style={[styles.paidSkeletonLine, styles.paidSkeletonLineShort]} />
        </View>
      )}

      {!isPaid && postText.length > 0 ? (
        <View style={styles.previewWrap}>
          <Text
            color={colors.textPrimary}
            numberOfLines={isExpanded ? undefined : 2}
            style={styles.preview}
          >
            {postText}
            {!isExpanded && shouldShowMoreLink ? (
              <Text onPress={handleExpand} color={colors.accent}>
                {' '}
                Показать еще
              </Text>
            ) : null}
          </Text>
          {isExpanded && shouldShowMoreLink ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Скрыть текст поста"
              onPress={handleCollapse}
              style={styles.showMoreWrap}
            >
              <Text color={colors.accent}>Скрыть</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <AnimatedLikeButton
          count={post.likesCount}
          isLiked={post.isLiked}
          disabled={isPaid || !onLikePress}
          onPress={handleLike}
        />
        <ActionPill
          kind="comment"
          count={post.commentsCount}
          disabled={isPaid}
          onPress={onCommentPress ? handleComment : undefined}
        />
      </View>
    </View>
  );
}

function arePostCardPropsEqual(prev: PostCardProps, next: PostCardProps) {
  return (
    prev.post === next.post &&
    prev.onOpenPost === next.onOpenPost &&
    prev.onLikePress === next.onLikePress &&
    prev.onCommentPress === next.onCommentPress
  );
}

export const PostCard = memo(PostCardBase, arePostCardPropsEqual);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  authorName: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  coverWrap: {
    marginHorizontal: -spacing.lg,
    position: 'relative',
  },
  coverPressed: {
    opacity: 0.96,
  },
  cover: {
    width: '100%',
    backgroundColor: colors.border,
  },
  coverFree: {
    height: COVER_HEIGHT,
  },
  coverPaid: {
    aspectRatio: 1,
    backgroundColor: colors.border,
    filter: 'blur(10px)',
    opacity: 0.5,
  },
  titleWrap: {
    alignSelf: 'flex-start',
  },
  paidOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  blurFallbackWeb: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  paidTextSkeleton: {
    gap: spacing.sm,
    width: '100%',
  },
  paidSkeletonLine: {
    height: 26,
    width: '100%',
    borderRadius: 13,
    backgroundColor: colors.skeleton,
  },
  paidSkeletonLineShort: {
    width: '72%',
  },
  scrim: {
    backgroundColor: colors.paidOverlayScrim,
  },
  paidContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    maxWidth: '100%',
  },
  lockBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidMessage: {
    textAlign: 'center',
    maxWidth: 240,
  },
  donateButton: {
    minWidth: DONATE_MIN_WIDTH,
    maxWidth: '100%',
    height: 42,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.button,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewWrap: {
    position: 'relative',
  },
  preview: {
    minHeight: 40,
  },
  showMoreWrap: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
