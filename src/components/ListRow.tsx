import React from 'react';
import { View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  meta?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showChevron?: boolean;
  danger?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
}

export function ListRow({
  icon,
  iconColor,
  label,
  meta,
  onPress,
  right,
  showChevron = true,
  danger,
  switchValue,
  onSwitchChange,
}: Props) {
  const color = danger ? colors.danger : iconColor ?? colors.primary;
  const isSwitchRow = onSwitchChange !== undefined;

  return (
    <Pressable
      onPress={isSwitchRow ? undefined : onPress}
      disabled={isSwitchRow ? true : !onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed && onPress ? 0.7 : 1 }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyMedium, { color: danger ? colors.danger : colors.ink }]}>{label}</Text>
        {meta && <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>{meta}</Text>}
      </View>
      {isSwitchRow ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      ) : (
        right ?? (showChevron && onPress && <Ionicons name="chevron-forward" size={18} color={colors.faint} />)
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
