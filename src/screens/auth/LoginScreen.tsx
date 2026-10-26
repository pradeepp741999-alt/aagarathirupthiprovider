import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button, Input } from '../../components';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useProviderStore } from '../../store/useProviderStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const HERO_HEIGHT = 220;

export function LoginScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const setMobileStore = useAuthStore((s) => s.setMobile);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const completeLogin = useAuthStore((s) => s.completeLogin);
  const loadDemoProvider = useProviderStore((s) => s.loadDemoProvider);

  const handleSendOtp = async () => {
    const digits = mobile.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    const res = await sendOtp(digits);
    if (res.success) {
      navigation.navigate('Otp', { mobile: digits });
    } else {
      setError(res.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleDemo = () => {
    setMobileStore('9876500001');
    loadDemoProvider();
    completeLogin({ id: 'prov-demo', mobile: '9876500001', status: 'approved' });
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: authPhoto(1000, 600) }} style={styles.hero} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.sheet}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={26} color={colors.primary} />
            </View>
            <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl }]}>Provider Login</Text>
            <Text style={[type.body, { color: colors.muted, marginTop: 6 }]}>
              We'll send a one-time password (OTP) to verify your business mobile number.
            </Text>

            <Input
              label="Mobile Number"
              icon="phone-portrait-outline"
              prefix="+91"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={(v) => setMobile(v.replace(/\D/g, ''))}
              placeholder="98765 43210"
              error={error}
              containerStyle={{ marginTop: spacing.xxl }}
            />

            <Button label="Send OTP" fullWidth size="lg" loading={isLoading} onPress={handleSendOtp} icon="arrow-forward" iconPosition="right" />

            <Pressable onPress={handleDemo} style={styles.demoBtn}>
              <Ionicons name="flash" size={15} color={colors.secondary} />
              <Text style={[type.bodyMedium, { color: colors.secondary, marginLeft: 6 }]}>
                Explore with a demo (already-approved) provider
              </Text>
            </Pressable>

            <Text style={styles.terms}>
              By continuing, you agree to Aagara Thirupthi's Provider Terms of Service and Privacy Policy.
            </Text>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_HEIGHT, backgroundColor: colors.divider },
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
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  terms: { ...type.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xl },
});
