import { ActivityIndicator, View, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/shared/theme/tokens';

type LoaderProps = {
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
};

export function Loader({ style, size = 'large' }: LoaderProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
