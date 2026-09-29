import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '../theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const toneMap = {
  default: { bg: colors.primarySoft, fg: colors.primaryDark, activeBg: colors.primary },
  success: { bg: colors.successSoft, fg: colors.success, activeBg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning, activeBg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger, activeBg: colors.danger },
  info: { bg: colors.infoSoft, fg: colors.info, activeBg: colors.info },
};

export function Chip({ label, selected, onPress, icon, style, tone = 'default' }: Props) {
  const t = toneMap[tone];
  const isInteractive = !!onPress;
  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? t.activeBg : isInteractive ? colors.surfaceAlt : t.bg,
          borderColor: selected ? t.activeBg : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.white : t.fg}
          style={{ marginRight: 5 }}
        />
      )}
      <Text style={[type.caption, { color: selected ? colors.white : t.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
