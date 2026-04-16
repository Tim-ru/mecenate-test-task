import { ScrollView, StyleSheet, View } from 'react-native';
import { SkeletonBone } from '@/shared/ui/SkeletonBone';
import { radius, spacing } from '@/shared/theme/tokens';

const SKELETON_COMMENTS_COUNT = 3;

export function PostDetailSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonBone width="100%" borderRadius={radius.md} style={styles.cover} />
      <SkeletonBone width="70%" height={26} borderRadius={13} />
      <View style={styles.bodyLines}>
        <SkeletonBone width="100%" height={16} borderRadius={8} />
        <SkeletonBone width="100%" height={16} borderRadius={8} />
        <SkeletonBone width="60%" height={16} borderRadius={8} />
      </View>

      <View style={styles.commentsSectionTitle}>
        <SkeletonBone width={140} height={26} borderRadius={13} />
      </View>
      {Array.from({ length: SKELETON_COMMENTS_COUNT }).map((_, i) => (
        <View key={i} style={styles.commentRow}>
          <SkeletonBone width={32} height={32} borderRadius={16} />
          <View style={styles.commentBody}>
            <SkeletonBone width={100} height={14} borderRadius={7} />
            <SkeletonBone width="90%" height={14} borderRadius={7} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cover: {
    aspectRatio: 4 / 3,
  },
  bodyLines: {
    gap: spacing.sm,
  },
  commentsSectionTitle: {
    marginTop: spacing.lg,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  commentBody: {
    flex: 1,
    gap: spacing.sm,
  },
});
