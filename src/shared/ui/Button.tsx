import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/shared/theme/tokens';
import { Text } from '@/shared/ui/Text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, disabled = false, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled ? styles.interactivePressed : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <Text variant="button" color={colors.onAccent}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 42,
    borderRadius: radius.button,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  interactivePressed: {
    backgroundColor: colors.accentPressed,
  },
  disabled: {
    backgroundColor: colors.accentDisabled,
  },
});
