import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, type } from '../theme';

interface Props {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = colors.primary, size = 40 }: Props) {
  const initials = name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[type.bodyMedium, { color: colors.white, fontSize: size * 0.38 }]}>{initials || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
