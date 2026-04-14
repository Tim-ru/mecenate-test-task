import { type PropsWithChildren } from 'react';
import { Text as NativeText, type StyleProp, StyleSheet, type TextStyle } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';

type TextVariant = keyof typeof typography;

type TextProps = PropsWithChildren<{
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
}>;

export function Text({ children, variant = 'body', color = colors.textPrimary, style }: TextProps) {
  return <NativeText style={[styles.base, typography[variant], { color }, style]}>{children}</NativeText>;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
});
