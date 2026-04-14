import { type TextStyle } from 'react-native';

export const colors = {
  background: '#F5F8FD',
  surface: '#FFFFFF',
  textPrimary: '#111416',
  textSecondary: '#57626F',
  border: '#E6E8EF',
  accent: '#6115CD',
  accentPressed: '#4E11A4',
  onAccent: '#FFFFFF',
  onAccentMuted: '#DFD0F5',
  accentDisabled: '#D5C9FF',
  danger: '#E53935',
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
  lg: 16,
  pill: 999,
} as const;

export const typography: Record<'title' | 'body' | 'caption' | 'button', TextStyle> = {
  title: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Manrope',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Manrope',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  button: {
    fontFamily: 'Manrope',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 26,
  },
};
