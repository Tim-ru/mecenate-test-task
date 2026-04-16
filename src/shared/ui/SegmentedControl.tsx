import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radius } from '@/shared/theme/tokens';
import { Text } from '@/shared/ui/Text';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.item,
              isActive ? styles.itemActive : undefined,
              pressed ? styles.itemPressed : undefined,
            ]}
          >
            <Text
              variant={isActive ? 'tabActive' : 'tab'}
              color={isActive ? colors.onAccent : colors.textSecondary}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    width: layout.segmentedMaxWidth,
    alignSelf: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.tabBorder,
    backgroundColor: colors.surface,
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.tabItem,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: colors.accent,
  },
  itemPressed: {
    opacity: 0.92,
  },
});
