import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '@/shared/theme/tokens';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PANEL_WIDTH = SCREEN_WIDTH;
const BACKDROP_OPACITY = 0.45;
const ANIMATION_DURATION = 280;
const SWIPE_CLOSE_THRESHOLD = PANEL_WIDTH * 0.3;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

type SlidePanelProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function SlidePanel({ visible, onClose, children }: SlidePanelProps) {
  const translateX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isRendered = useRef(false);
  const isClosing = useRef(false);

  const animateOpen = useCallback(() => {
    isRendered.current = true;
    isClosing.current = false;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: BACKDROP_OPACITY,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, translateX]);

  const animateClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: PANEL_WIDTH,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isRendered.current = false;
      onClose();
    });
  }, [backdropOpacity, onClose, translateX]);

  useEffect(() => {
    if (visible) {
      animateOpen();
    } else if (isRendered.current) {
      animateClose();
    }
  }, [animateClose, animateOpen, visible]);

  useEffect(() => {
    if (!visible) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      animateClose();
      return true;
    });
    return () => sub.remove();
  }, [animateClose, visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dx > 10 && Math.abs(gesture.dy) < Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0) {
          translateX.setValue(gesture.dx);
          backdropOpacity.setValue(
            BACKDROP_OPACITY * (1 - gesture.dx / PANEL_WIDTH),
          );
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const shouldClose =
          gesture.dx > SWIPE_CLOSE_THRESHOLD ||
          gesture.vx > SWIPE_VELOCITY_THRESHOLD;

        if (shouldClose) {
          animateClose();
        } else {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: BACKDROP_OPACITY,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  if (!visible && !isRendered.current) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={animateClose} />
      </Animated.View>

      <Animated.View
        style={[styles.panel, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    overflow: 'hidden',
  },
});
