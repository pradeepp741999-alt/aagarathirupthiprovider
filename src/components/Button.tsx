import React, { useRef } from 'react';
import { Pressable, Animated, View, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, spacing, type } from '../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading,
  disabled,
  fullWidth,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const paddingV = size === 'sm' ? 10 : size === 'lg' ? 17 : 14;
  const fontSize = size === 'sm' ? 13.5 : size === 'lg' ? 16.5 : 15.5;
  const scale = useRef(new Animated.Value(1)).current;

  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'secondary' ? colors.secondary :
    variant === 'danger' ? colors.danger : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'secondary' || variant === 'danger' ? colors.white :
    variant === 'outline' ? colors.ink : colors.primary;

  const borderColor = variant === 'outline' ? colors.border : 'transparent';
  const isGradient = variant === 'primary';

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={[{ width: fullWidth ? '100%' : undefined, transform: [{ scale }] }, isGradient && shadow.glow, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.55 : 1 }}
      >
        <View
          style={[
            styles.base,
            {
              backgroundColor: isGradient ? undefined : bg,
              borderColor,
              borderWidth: variant === 'outline' ? 1.5 : 0,
              paddingVertical: paddingV,
            },
          ]}
        >
          {isGradient && (
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {loading ? (
            <ActivityIndicator color={textColor} size="small" />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <Ionicons name={icon} size={fontSize + 3} color={textColor} style={{ marginRight: 8 }} />
              )}
              <Text style={[type.button, { color: textColor, fontSize }]} numberOfLines={1}>
                {label}
              </Text>
              {icon && iconPosition === 'right' && (
                <Ionicons name={icon} size={fontSize + 3} color={textColor} style={{ marginLeft: 8 }} />
              )}
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
});
