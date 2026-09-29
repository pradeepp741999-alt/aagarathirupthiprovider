import React from 'react';
import { Pressable, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, spacing, type } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  meta?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SummaryCard({ icon, label, value, meta, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.card, shadow.md, { opacity: pressed ? 0.95 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={17} color={colors.white} />
        </View>
        {onPress && <Ionicons name="arrow-forward" size={17} color="rgba(255,255,255,0.75)" />}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {meta && <Text style={styles.meta}>{meta}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { ...type.display, color: colors.white },
  label: { ...type.bodyMedium, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  meta: { ...type.caption, color: 'rgba(255,255,255,0.65)', marginTop: spacing.sm },
});
