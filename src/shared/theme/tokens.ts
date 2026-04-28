import { type TextStyle } from 'react-native';

export const fontFamily = {
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const colors = {
  background: '#F5F8FD',
  surface: '#FFFFFF',
  textPrimary: '#111416',
  textSecondary: '#57626F',
  border: '#E6E8EF',
  tabBorder: '#E8ECEF',
  actionPillDefault: '#E8ECEF',
  actionPillHover: '#DDDDDD',
  actionPillActive: '#D4D4D4',
  actionPillDisabled: '#FFFFFF',
  actionPillDisabledForeground: '#B6BCC8',
  actionPillLiked: '#FF2D8F',
  actionPillLikedHover: '#EA276B',
  actionPillLikedActive: '#DE2465',
  actionPillLikedDisabled: '#FFBAD2',
  actionPillLikedForeground: '#FFEAF1',
  actionPillLikedDisabledForeground: '#FFEAF1',
  accent: '#6115CD',
  accentPressed: '#4E11A4',
  onAccent: '#FFFFFF',
  onAccentMuted: '#DFD0F5',
  accentDisabled: '#D5C9FF',
  danger: '#E53935',
  paidOverlayScrim: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#EEF2F8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  button: 14,
  lockIcon: 10,
  tabItem: 22,
  lg: 16,
  pill: 999,
} as const;

export const layout = {
  segmentedMaxWidth: 361,
} as const;

export const typography: Record<
  'title' | 'body' | 'caption' | 'button' | 'tab' | 'tabActive' | 'overlay',
  TextStyle
> = {
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 26,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 26,
  },
  tab: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  tabActive: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  overlay: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
};
