import { Platform, TextStyle } from 'react-native';

// Font families are registered in App.tsx via @expo-google-fonts/plus-jakarta-sans.
// Fallback to system fonts so the app still renders correctly before fonts load.
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  system: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};

type Preset = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>;

export const type: Record<string, Preset> = {
  display: { fontFamily: fontFamily.extrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5 },
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.3 },
  h2: { fontFamily: fontFamily.bold, fontSize: 21, lineHeight: 27, letterSpacing: -0.2 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 17, lineHeight: 23 },
  subtitle: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 21 },
  body: { fontFamily: fontFamily.regular, fontSize: 14.5, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 14.5, lineHeight: 21 },
  caption: { fontFamily: fontFamily.medium, fontSize: 12.5, lineHeight: 17 },
  tiny: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.3 },
  button: { fontFamily: fontFamily.semibold, fontSize: 15.5, lineHeight: 19 },
  statValue: { fontFamily: fontFamily.extrabold, fontSize: 24, lineHeight: 29, letterSpacing: -0.3 },
};
