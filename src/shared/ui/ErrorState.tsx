import { View, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/shared/theme/tokens';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  style?: StyleProp<ViewStyle>;
  retryLabel?: string;
};

export function ErrorState({ message, onRetry, style, retryLabel = 'Retry' }: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.message} color={colors.textSecondary}>
        {message}
      </Text>
      <Button title={retryLabel} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  message: {
    textAlign: 'center',
  },
});
