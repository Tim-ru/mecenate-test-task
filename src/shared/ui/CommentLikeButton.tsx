import { Pressable, type PressableStateCallbackType, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/tokens';
import { HeartFilledIcon, HeartOutlineIcon } from '@/shared/ui/icons';
import { Text } from '@/shared/ui/Text';

type CommentLikeButtonProps = {
  count: number;
  isLiked?: boolean;
  onPress?: () => void;
};

const LIKED_COLORS = {
  default: '#FF2B75',
  hover: '#D82463',
  active: '#BD1D55',
} as const;

const DEFAULT_COLORS = {
  default: colors.textSecondary,
  hover: '#404954',
  active: '#323A43',
} as const;

function resolveColor(
  state: PressableStateCallbackType,
  isLiked: boolean,
): string {
  const palette = isLiked ? LIKED_COLORS : DEFAULT_COLORS;
  const withHovered = state as PressableStateCallbackType & { hovered?: boolean };

  if (state.pressed) return palette.active;
  if (withHovered.hovered) return palette.hover;
  return palette.default;
}

export function CommentLikeButton({
  count,
  isLiked = false,
  onPress,
}: CommentLikeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
      onPress={onPress}
      style={styles.base}
      hitSlop={8}
    >
      {(state) => {
        const color = resolveColor(state, isLiked);

        return (
          <>
            {isLiked ? (
              <HeartFilledIcon size={15} color={color} />
            ) : (
              <HeartOutlineIcon size={15} color={color} />
            )}
            <Text variant="caption" color={color}>
              {count}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
});
