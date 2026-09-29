import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import { ReportPoint } from '../data/types';

interface Props {
  data: ReportPoint[];
  color?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
}

export function BarChart({ data, color = colors.primary, height = 120, valueFormatter }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={styles.wrap}>
      <View style={[styles.barsRow, { height }]}>
        {data.map((d) => (
          <View key={d.label} style={styles.barCol}>
            <Text style={[type.tiny, { color: colors.ink, marginBottom: 4 }]}>
              {valueFormatter ? valueFormatter(d.value) : d.value}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  { height: `${Math.max(4, (d.value / max) * 100)}%`, backgroundColor: color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d) => (
          <Text key={d.label} style={[type.tiny, styles.labelText]} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  track: { width: '100%', flex: 1, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: radius.sm, minHeight: 4 },
  labelsRow: { flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm },
  labelText: { flex: 1, textAlign: 'center', color: colors.muted },
});
