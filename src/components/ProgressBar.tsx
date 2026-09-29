import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  value: number; // 0-1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ value, color = colors.primary, trackColor = colors.divider, height = 8 }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
