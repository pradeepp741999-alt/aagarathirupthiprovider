import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button } from '../../components';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const OTP_LENGTH = 4;
const HERO_HEIGHT = 220;

export function OtpScreen({ navigation, route }: Props) {
  const { mobile } = route.params;
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);
  const completeLogin = useAuthStore((s) => s.completeLogin);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError('');
    if (clean && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (digits.some((d) => d === '')) {
      setError('Enter the complete OTP');
      return;
    }
    // Demo app: any 4-digit code is accepted (no real SMS backend wired up yet).
    completeLogin();
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: authPhoto(1000, 600) }} style={styles.hero} />
      <SafeAreaView style={styles.heroSafe} edges={['top']}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
      </SafeAreaView>

      <View style={styles.sheet}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={26} color={colors.secondary} />
        </View>
        <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl }]}>Verify OTP</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 6 }]}>
          Enter the 4-digit code sent to{'\n'}
          <Text style={{ color: colors.ink, fontFamily: type.bodyMedium.fontFamily }}>+91 {mobile}</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              value={d}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.otpBox, d ? styles.otpBoxFilled : null, error ? styles.otpBoxError : null]}
            />
          ))}
        </View>
        {error ? <Text style={[type.caption, { color: colors.danger, marginTop: 8 }]}>{error}</Text> : null}

        <Button label="Verify & Continue" fullWidth size="lg" onPress={handleVerify} style={{ marginTop: spacing.xxl }} />

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={[type.caption, { color: colors.muted }]}>Resend OTP in 0:{timer.toString().padStart(2, '0')}</Text>
          ) : (
            <Pressable onPress={() => setTimer(30)}>
              <Text style={[type.bodyMedium, { color: colors.primary }]}>Resend OTP</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_HEIGHT, backgroundColor: colors.divider },
  heroSafe: { paddingHorizontal: spacing.lg },
  backBtn: {
    width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.overlay,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm,
  },
  sheet: {
    flex: 1,
    marginTop: HERO_HEIGHT - radius.xxl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpRow: { flexDirection: 'row', marginTop: spacing.xxl },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: type.h2.fontFamily,
    color: colors.ink,
    marginRight: spacing.md,
    outlineStyle: 'none' as any,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.surface },
  otpBoxError: { borderColor: colors.danger },
  resendRow: { alignItems: 'center', marginTop: spacing.xl },
});
