import React from 'react';
import { Pressable, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, type } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor?: string;
  iconBg?: string;
  badge?: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TileButton({ icon, label, iconColor = colors.primary, iconBg, badge, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tile, shadow.sm, { opacity: pressed ? 0.92 : 1 }, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg ?? iconColor + '18' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: { ...type.tiny, color: colors.white, fontSize: 9 },
});
