import { ColorSchemeName } from 'react-native';

export type AppTheme = {
  isDark: boolean;
  colors: {
    canvas: string;
    surface: string;
    surfaceMuted: string;
    surfaceStrong: string;
    text: string;
    textMuted: string;
    textOnStrong: string;
    border: string;
    primary: string;
    primaryPressed: string;
    primarySoft: string;
    accent: string;
    accentSoft: string;
    success: string;
    warning: string;
    warningSoft: string;
    danger: string;
    overlay: string;
  };
};

const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    canvas: '#F8F7F4',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF0EB',
    surfaceStrong: '#234936',
    text: '#18231C',
    textMuted: '#5E6C62',
    textOnStrong: '#FFFFFF',
    border: '#D9DED7',
    primary: '#2C704D',
    primaryPressed: '#225A3D',
    primarySoft: '#E2F0E6',
    accent: '#D8954F',
    accentSoft: '#FAEBD9',
    success: '#347A55',
    warning: '#9A641F',
    warningSoft: '#FFF4E3',
    danger: '#B53832',
    overlay: 'rgba(16, 28, 22, 0.52)',
  },
};

const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    canvas: '#151917',
    surface: '#1D241F',
    surfaceMuted: '#27322B',
    surfaceStrong: '#234936',
    text: '#F3F5F0',
    textMuted: '#B9C4BB',
    textOnStrong: '#FFFFFF',
    border: '#38473D',
    primary: '#3F8B60',
    primaryPressed: '#54A473',
    primarySoft: '#294334',
    accent: '#DFA45E',
    accentSoft: '#443826',
    success: '#75B88A',
    warning: '#E2AD67',
    warningSoft: '#453924',
    danger: '#F09891',
    overlay: 'rgba(0, 0, 0, 0.58)',
  },
};

export const getAppTheme = (scheme: ColorSchemeName): AppTheme =>
  scheme === 'dark' ? darkTheme : lightTheme;

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const typeScale = {
  eyebrow: 11,
  label: 13,
  body: 15,
  title: 22,
  display: 32,
} as const;
