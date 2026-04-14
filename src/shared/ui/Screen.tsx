import { type PropsWithChildren } from 'react';
import { SafeAreaView, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/shared/theme/tokens';

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, style }: ScreenProps) {
  return <SafeAreaView style={[styles.base, style]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
