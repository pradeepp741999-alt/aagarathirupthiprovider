import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, type } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  tone?: 'primary' | 'secondary' | 'gold' | 'success' | 'danger';
  delta?: { value: string; positive: boolean };
  style?: StyleProp<ViewStyle>;
}

const toneMap = {
  primary: colors.primary,
  secondary: colors.secondary,
  gold: colors.gold,
  success: colors.success,
  danger: colors.danger,
};

export function StatCard({ icon, label, value, tone = 'primary', delta, style }: Props) {
  const c = toneMap[tone];
  return (
    <View style={[styles.card, shadow.sm, style]}>
      <View style={[styles.iconWrap, { backgroundColor: c + '18' }]}>
        <Ionicons name={icon} size={16} color={c} />
      </View>
      <Text style={[type.statValue, { color: colors.ink, marginTop: spacing.sm }]}>{value}</Text>
      <View style={styles.labelRow}>
        <Text style={[type.caption, { color: colors.muted }]} numberOfLines={1}>{label}</Text>
        {delta && (
          <Text style={[type.tiny, { color: delta.positive ? colors.success : colors.danger, marginLeft: 4 }]}>
            {delta.positive ? '↑' : '↓'} {delta.value}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
});
