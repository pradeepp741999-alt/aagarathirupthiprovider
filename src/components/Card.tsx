import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, Pressable } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, onPress, padded = true, elevated = true }: Props) {
  const content = (
    <View
      style={[
        styles.base,
        elevated && shadow.sm,
        padded && { padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});
