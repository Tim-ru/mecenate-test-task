import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { HeartFilledIcon, HeartOutlineIcon } from '@/shared/ui/icons';
import { Text } from '@/shared/ui/Text';
import { colors, radius, spacing } from '@/shared/theme/tokens';

type AnimatedLikeButtonProps = {
  isLiked: boolean;
  count: number;
  disabled?: boolean;
  onPress: () => void;
};

export function AnimatedLikeButton({
  isLiked,
  count,
  disabled = false,
  onPress,
}: AnimatedLikeButtonProps) {
  const scale = useSharedValue(1);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(1.18, { duration: 120 }),
      withSpring(1, { damping: 7, stiffness: 260 }),
    );
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
      disabled={disabled}
      onPress={handlePress}
      style={(state) => {
        const withHovered = state as typeof state & { hovered?: boolean };
        const isHovered = Boolean(withHovered.hovered);

        const backgroundColor = disabled
          ? isLiked
            ? colors.actionPillLikedDisabled
            : colors.actionPillDisabled
          : isLiked
            ? state.pressed
              ? colors.actionPillLikedActive
              : isHovered
                ? colors.actionPillLikedHover
                : colors.actionPillLiked
            : state.pressed
              ? colors.actionPillActive
              : isHovered
                ? colors.actionPillHover
                : colors.actionPillDefault;

        return [styles.button, { backgroundColor }];
      }}
    >
      {(state) => {
        const foregroundColor = disabled
          ? isLiked
            ? colors.actionPillLikedDisabledForeground
            : colors.actionPillDisabledForeground
          : isLiked
            ? colors.actionPillLikedForeground
            : colors.textSecondary;

        return (
          <>
            <Animated.View style={animatedIconStyle}>
              {isLiked ? (
                <HeartFilledIcon color={foregroundColor} />
              ) : (
                <HeartOutlineIcon color={foregroundColor} />
              )}
            </Animated.View>
            <Text variant="caption" color={foregroundColor}>
              {count}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 72,
    height: 36,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
});
