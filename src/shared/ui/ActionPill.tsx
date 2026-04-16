import { Pressable, type PressableStateCallbackType, StyleSheet } from 'react-native';
import { colors, radius } from '@/shared/theme/tokens';
import { CommentIcon, HeartFilledIcon, HeartOutlineIcon } from '@/shared/ui/icons';
import { Text } from '@/shared/ui/Text';

type ActionPillKind = 'like' | 'comment';

type ActionPillProps = {
  kind: ActionPillKind;
  count: number;
  isActive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

type ActionPillPalette = {
  background: string;
  foreground: string;
  iconColor: string;
};

type ActionPillInteractiveState = {
  pressed: boolean;
  hovered: boolean;
};

function resolveInteractiveState(state: PressableStateCallbackType): ActionPillInteractiveState {
  const withHovered = state as PressableStateCallbackType & { hovered?: boolean };

  return {
    pressed: state.pressed,
    hovered: Boolean(withHovered.hovered),
  };
}

function getPalette({
  kind,
  isActive,
  disabled,
  state,
}: {
  kind: ActionPillKind;
  isActive: boolean;
  disabled: boolean;
  state: ActionPillInteractiveState;
}): ActionPillPalette {
  if (disabled) {
    if (kind === 'like' && isActive) {
      return {
        background: colors.actionPillLikedDisabled,
        foreground: colors.actionPillLikedDisabledForeground,
        iconColor: colors.actionPillLikedDisabledForeground,
      };
    }

    return {
      background: colors.actionPillDisabled,
      foreground: colors.actionPillDisabledForeground,
      iconColor: colors.actionPillDisabledForeground,
    };
  }

  if (kind === 'like' && isActive) {
    if (state.pressed) {
      return {
        background: colors.actionPillLikedActive,
        foreground: colors.actionPillLikedForeground,
        iconColor: colors.actionPillLikedForeground,
      };
    }

    if (state.hovered) {
      return {
        background: colors.actionPillLikedHover,
        foreground: colors.actionPillLikedForeground,
        iconColor: colors.actionPillLikedForeground,
      };
    }

    return {
      background: colors.actionPillLiked,
      foreground: colors.actionPillLikedForeground,
      iconColor: colors.actionPillLikedForeground,
    };
  }

  if (state.pressed) {
    return {
      background: colors.actionPillActive,
      foreground: colors.textSecondary,
      iconColor: colors.textSecondary,
    };
  }

  if (state.hovered) {
    return {
      background: colors.actionPillHover,
      foreground: colors.textSecondary,
      iconColor: colors.textSecondary,
    };
  }

  return {
    background: colors.actionPillDefault,
    foreground: colors.textSecondary,
    iconColor: colors.textSecondary,
  };
}

export function ActionPill({ kind, count, isActive = false, disabled = false, onPress }: ActionPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={(state) => {
        const palette = getPalette({
          kind,
          isActive,
          disabled,
          state: resolveInteractiveState(state),
        });

        return [styles.base, { backgroundColor: palette.background }];
      }}
    >
      {(state) => {
        const palette = getPalette({
          kind,
          isActive,
          disabled,
          state: resolveInteractiveState(state),
        });

        return (
          <>
            {kind === 'comment' ? (
              <CommentIcon color={palette.iconColor} />
            ) : isActive ? (
              <HeartFilledIcon color={palette.iconColor} />
            ) : (
              <HeartOutlineIcon color={palette.iconColor} />
            )}
            <Text variant="caption" color={palette.foreground}>
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
    width: 63,
    height: 36,
    gap: 4,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: radius.pill,
  },
});
