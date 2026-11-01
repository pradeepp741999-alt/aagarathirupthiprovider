import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button } from '../../components';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const OTP_LENGTH = 6;
const HERO_HEIGHT = 200;

export function OtpScreen({ navigation, route }: Props) {
  const { mobile, email, loginType = mobile ? 'mobile' : 'email', txnId } = route.params;
  const isEmail = loginType === 'email' || (!mobile && !!email);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // Handle single character or pasted text in onChangeText
  const handleChange = (value: string, index: number) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Multi-character input (e.g. paste)
    if (clean.length > 1) {
      const chars = clean.slice(0, OTP_LENGTH).split('');
      const next = [...digits];
      chars.forEach((c, i) => {
        if (i < OTP_LENGTH) next[i] = c;
      });
      setDigits(next);
      setError('');
      const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
      inputs.current[focusIndex]?.focus();
      return;
    }

    // Single digit input
    const next = [...digits];
    next[index] = clean.slice(-1);
    setDigits(next);
    setError('');

    // Auto-advance to next box
    if (index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  // Clipboard paste support on web
  const handleWebPaste = (e: any) => {
    if (Platform.OS === 'web' && e?.clipboardData) {
      const text = e.clipboardData.getData('text') || '';
      const clean = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      if (clean.length > 0) {
        e.preventDefault();
        const chars = clean.split('');
        const next = [...digits];
        chars.forEach((c: string, i: number) => {
          if (i < OTP_LENGTH) next[i] = c;
        });
        setDigits(next);
        setError('');
        const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
        inputs.current[focusIndex]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    const res = await verifyOtp({
      mobile,
      email,
      otp: code,
      txnId,
    });
    if (!res.success) {
      setError(res.message || 'Invalid OTP. Please check and try again.');
    }
  };

  const handleResend = async () => {
    setTimer(30);
    setError('');
    const res = await resendOtp({ mobile, email });
    if (!res.success) {
      setError(res.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: authPhoto(1000, 600) }} style={styles.hero} />
      <SafeAreaView style={styles.heroSafe} edges={['top']}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
      </SafeAreaView>

      <View style={styles.sheetContainer}>
        <View style={[styles.sheet, shadow.md]}>
          <View style={styles.iconCircle}>
            <Ionicons name={isEmail ? 'mail-open-outline' : 'shield-checkmark'} size={28} color={colors.secondary} />
          </View>

          <Text style={[type.h1, { color: colors.ink, marginTop: spacing.md }]}>
            {isEmail ? 'Verify Email Code' : 'Verify Mobile Number'}
          </Text>

          <View style={styles.mobileRow}>
            <Text style={[type.body, { color: colors.muted }]}>
              {isEmail ? 'Verification code sent to ' : 'OTP sent to '}
              <Text style={{ color: colors.ink, fontWeight: '700' }}>
                {isEmail ? email : `+91 ${mobile}`}
              </Text>
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={8}
              style={styles.changeBtn}
            >
              <Text style={[type.caption, { color: colors.primary, fontWeight: '700' }]}>Change</Text>
            </Pressable>
          </View>

          {/* Centered OTP Boxes */}
          <View
            style={styles.otpRow}
            // @ts-ignore Web event support
            onPaste={handleWebPaste}
          >
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
                maxLength={i === 0 ? 6 : 1}
                selectTextOnFocus
                autoFocus={i === 0}
                style={[
                  styles.otpBox,
                  d ? styles.otpBoxFilled : null,
                  error ? styles.otpBoxError : null,
                ]}
              />
            ))}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={[type.caption, { color: colors.danger, marginLeft: 6 }]}>{error}</Text>
            </View>
          ) : null}

          <Button
            label="Verify & Continue"
            fullWidth
            size="lg"
            loading={isLoading}
            onPress={handleVerify}
            icon="arrow-forward"
            iconPosition="right"
            style={{ marginTop: spacing.xl }}
          />

          <View style={styles.resendRow}>
            {timer > 0 ? (
              <View style={styles.timerChip}>
                <Ionicons name="time-outline" size={14} color={colors.muted} />
                <Text style={[type.caption, { color: colors.muted, marginLeft: 4 }]}>
                  Resend OTP in 0:{timer.toString().padStart(2, '0')}
                </Text>
              </View>
            ) : (
              <Pressable onPress={handleResend} style={styles.resendBtn}>
                <Ionicons name="refresh" size={14} color={colors.primary} />
                <Text style={[type.bodyMedium, { color: colors.primary, fontWeight: '700', marginLeft: 4 }]}>
                  Resend OTP
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.demoHint}>
            <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
            <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>
              Demo OTP: enter <Text style={{ fontWeight: '700' }}>123456</Text> to test instantly
            </Text>
          </View>
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
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  sheetContainer: {
    flex: 1,
    paddingTop: HERO_HEIGHT - 32,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 8,
  },
  changeBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xl,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    outlineStyle: 'none' as any,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  otpBoxError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
