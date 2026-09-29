import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '../theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}

export function Stepper({ value, onChange, step = 10, min = 0, max = 10000, suffix }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.btn, value <= min && styles.btnDisabled]}
        onPress={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={18} color={value <= min ? colors.faint : colors.primary} />
      </Pressable>
      <Text style={[type.h3, styles.value]}>
        {value.toLocaleString('en-IN')}
        {suffix ? <Text style={[type.caption, { color: colors.muted }]}> {suffix}</Text> : null}
      </Text>
      <Pressable
        style={[styles.btn, value >= max && styles.btnDisabled]}
        onPress={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
      >
        <Ionicons name="add" size={18} color={value >= max ? colors.faint : colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: colors.surfaceAlt },
  value: { color: colors.ink, minWidth: 90, textAlign: 'center' },
});
