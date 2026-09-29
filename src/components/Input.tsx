import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightElement?: React.ReactNode;
  prefix?: string;
}

export function Input({ label, icon, error, containerStyle, rightElement, prefix, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ marginBottom: spacing.lg }, containerStyle]}>
      {label && <Text style={[type.bodyMedium, styles.label]}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          {
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
            backgroundColor: focused ? colors.surface : colors.surfaceAlt,
          },
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={colors.muted} style={{ marginRight: 8 }} />}
        {prefix && <Text style={[type.body, { color: colors.ink, marginRight: 4 }]}>{prefix}</Text>}
        <TextInput
          placeholderTextColor={colors.faint}
          style={[type.body, styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightElement}
      </View>
      {!!error && <Text style={[type.caption, { color: colors.danger, marginTop: 4 }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.ink, marginBottom: 7 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  input: { flex: 1, color: colors.ink, paddingVertical: 0, outlineStyle: 'none' as any },
});
