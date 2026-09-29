import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

interface Props {
  options: { key: string; label: string; count?: number }[];
  value: string;
  onChange: (key: string) => void;
}

export function SegmentedTabs({ options, value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[type.bodyMedium, { color: active ? colors.white : colors.body }]}>{opt.label}</Text>
            {opt.count !== undefined && opt.count > 0 && (
              <View style={[styles.countPill, active && styles.countPillActive]}>
                <Text style={[type.tiny, { color: active ? colors.white : colors.primaryDark, fontSize: 10 }]}>
                  {opt.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, paddingRight: spacing.lg },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  countPill: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
});
