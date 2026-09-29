// Aagara Thirupthi Provider — color system
// Same brand family as the customer app (warm coral primary, deep teal
// secondary, gold accent, cream base) so the Provider Portal reads as part
// of the same product, not a different app. The Provider chrome leans on
// secondary teal for wayfinding — customers see orange, providers see teal —
// while every token stays visually consistent with the consumer palette.

export const colors = {
  // Brand
  primary: '#0E7C7B',
  primaryDark: '#0A5D5C',
  primaryLight: '#DCF2F1',
  primarySoft: '#E9F6F5',

  secondary: '#FF6A3D',
  secondaryDark: '#E14F24',
  secondaryLight: '#FFE4D6',
  secondarySoft: '#FFF1EA',

  gold: '#F4A81D',
  goldSoft: '#FDF0D8',

  // Neutrals (warm-tinted, not pure gray)
  ink: '#211A16',
  body: '#4A3F38',
  muted: '#8B7F76',
  faint: '#C9BEB5',
  border: '#EEE4DA',
  divider: '#F3EBE3',

  // Surfaces
  background: '#FBF7F3',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF8F3',
  overlay: 'rgba(33, 26, 22, 0.55)',

  // Status
  success: '#178A4C',
  successSoft: '#E3F6EA',
  warning: '#C98A00',
  warningSoft: '#FDF1D9',
  danger: '#D6423A',
  dangerSoft: '#FBE7E5',
  info: '#2563A8',
  infoSoft: '#E5EFFA',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Chart palette (reports)
  chart: ['#0E7C7B', '#FF6A3D', '#F4A81D', '#2563A8', '#8B5CF6', '#D6423A'],
};

export type AppColors = typeof colors;
