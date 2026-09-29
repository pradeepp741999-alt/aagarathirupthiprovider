import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, type } from '../theme';

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: Slice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 140, strokeWidth = 16, centerLabel, centerValue }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(1, data.reduce((sum, d) => sum + d.value, 0));
  let offset = 0;

  return (
    <View style={styles.row}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.divider}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {data.map((slice, i) => {
            const sliceLength = (slice.value / total) * circumference;
            const dashArray = `${sliceLength} ${circumference - sliceLength}`;
            const strokeDashoffset = -offset;
            offset += sliceLength;
            return (
              <Circle
                key={slice.label + i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={strokeDashoffset}
                fill="none"
                strokeLinecap="butt"
                rotation={-90}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
          })}
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            {centerValue && <Text style={[type.h2, { color: colors.ink }]}>{centerValue}</Text>}
            {centerLabel && <Text style={[type.tiny, { color: colors.muted }]}>{centerLabel}</Text>}
          </View>
        )}
      </View>
      <View style={styles.legend}>
        {data.map((slice) => (
          <View key={slice.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: slice.color }]} />
            <Text style={[type.caption, { color: colors.body, flex: 1 }]} numberOfLines={1}>
              {slice.label}
            </Text>
            <Text style={[type.bodyMedium, { color: colors.ink }]}>{slice.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  center: { alignItems: 'center', justifyContent: 'center' },
  legend: { flex: 1, gap: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
