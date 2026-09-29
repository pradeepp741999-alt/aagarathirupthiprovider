import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type, shadow } from '../theme';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
  editable?: boolean;
  onPress?: () => void;
}

export function SearchBar({ value, onChangeText, placeholder, onFilterPress, filterActive, editable = true, onPress }: Props) {
  return (
    <View style={[styles.wrap, shadow.sm]}>
      <Ionicons name="search" size={19} color={colors.muted} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search...'}
        placeholderTextColor={colors.faint}
        style={[type.body, styles.input]}
        editable={editable}
        onPressIn={onPress}
      />
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Filters"
          style={[styles.filterBtn, filterActive && { backgroundColor: colors.primary }]}
        >
          <Ionicons name="options" size={17} color={filterActive ? colors.white : colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 50,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  input: { flex: 1, color: colors.ink, paddingVertical: 0, outlineStyle: 'none' as any },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
