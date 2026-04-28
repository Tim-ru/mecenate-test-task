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
  const backgroundColor = disabled
    ? isLiked
      ? colors.actionPillLikedDisabled
      : colors.actionPillDisabled
    : isLiked
      ? colors.actionPillLiked
      : colors.actionPillDefault;
  const foregroundColor = disabled
    ? isLiked
      ? colors.actionPillLikedDisabledForeground
      : colors.actionPillDisabledForeground
    : isLiked
      ? colors.actionPillLikedForeground
      : colors.textSecondary;

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
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && !disabled ? styles.buttonPressed : undefined,
      ]}
    >
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
  buttonPressed: {
    opacity: 0.92,
  },
});
