import { Image, type ImageSourcePropType, View, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/shared/theme/tokens';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  illustration: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  retryLabel?: string;
  authorName?: string;
  avatarUrl?: string;
};

export function ErrorState({
  message,
  onRetry,
  illustration,
  style,
  retryLabel = 'Повторить',
  authorName,
  avatarUrl,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      {authorName && avatarUrl ? (
        <View style={styles.authorRow}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text variant="body">{authorName}</Text>
        </View>
      ) : null}
      <View style={styles.illustrationWrap}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <Text variant="title" style={styles.message}>
        {message}
      </Text>
      <Button title={retryLabel} onPress={onRetry} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: '100%',
  },
  authorRow: {
    width: '100%',
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
  illustrationWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  message: {
    textAlign: 'center',
    color: colors.textPrimary,
  },
  button: {
    width: '100%',
  },
});
