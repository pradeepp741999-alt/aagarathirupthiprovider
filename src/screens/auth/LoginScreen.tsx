import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button, Input } from '../../components';
import { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useProviderStore } from '../../store/useProviderStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const HERO_HEIGHT = 200;

export function LoginScreen({ navigation }: Props) {
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const sendOtp = useAuthStore((s) => s.sendOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const completeLogin = useAuthStore((s) => s.completeLogin);
  const loadDemoProvider = useProviderStore((s) => s.loadDemoProvider);

  const handleSendOtp = async () => {
    setError('');

    if (loginMethod === 'mobile') {
      const digits = mobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        setError('Please enter a valid 10-digit Indian mobile number');
        return;
      }
      const res = await sendOtp({ mobile: digits });
      if (res.success) {
        navigation.navigate('Otp', {
          mobile: digits,
          loginType: 'mobile',
          txnId: res.txnId,
        });
      } else {
        setError(res.message || 'Failed to send OTP. Please try again.');
      }
    } else {
      const cleanEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        setError('Please enter a valid email address (e.g. partner@example.com)');
        return;
      }
      const res = await sendOtp({ email: cleanEmail });
      if (res.success) {
        navigation.navigate('Otp', {
          email: cleanEmail,
          loginType: 'email',
          txnId: res.txnId,
        });
      } else {
        setError(res.message || 'Failed to send OTP to email. Please try again.');
      }
    }
  };

  const handleDemoExisting = () => {
    loadDemoProvider();
    completeLogin({
      id: 'prov-001',
      mobile: '9876500001',
      email: 'demo.partner@aagara.com',
      status: 'approved',
      business_name: 'Sree Annapoorna Catering',
    });
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: authPhoto(1000, 600) }} style={styles.hero} />
      <SafeAreaView style={styles.heroOverlay} edges={['top']}>
        <View style={styles.partnerBadge}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={[type.caption, { color: colors.primary, fontWeight: '700', marginLeft: 4 }]}>
            PARTNER PORTAL
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.sheet, shadow.md]}>
            <View style={styles.iconCircle}>
              <Ionicons name="business" size={26} color={colors.primary} />
            </View>

            <Text style={[type.h1, { color: colors.ink, marginTop: spacing.md }]}>
              Welcome, Event Partner
            </Text>
            <Text style={[type.body, { color: colors.muted, marginTop: 4, lineHeight: 20 }]}>
              Log in or register your Catering, Makeup, Decoration, or Audio business using mobile OTP or Email code.
            </Text>

            <View style={styles.perksRow}>
              <View style={styles.perkChip}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={[type.tiny, { color: colors.body, marginLeft: 4 }]}>Verified Leads</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={[type.tiny, { color: colors.body, marginLeft: 4 }]}>Direct Bookings</Text>
              </View>
              <View style={styles.perkChip}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={[type.tiny, { color: colors.body, marginLeft: 4 }]}>Zero Commission</Text>
              </View>
            </View>

            {/* Method Tabs: Mobile vs Email */}
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => {
                  setLoginMethod('mobile');
                  setError('');
                }}
                style={[styles.tabBtn, loginMethod === 'mobile' && styles.tabBtnActive]}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={16}
                  color={loginMethod === 'mobile' ? colors.primary : colors.muted}
                />
                <Text
                  style={[
                    type.bodyMedium,
                    {
                      color: loginMethod === 'mobile' ? colors.primary : colors.muted,
                      fontWeight: loginMethod === 'mobile' ? '700' : '500',
                      marginLeft: 6,
                    },
                  ]}
                >
                  Mobile Number
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setLoginMethod('email');
                  setError('');
                }}
                style={[styles.tabBtn, loginMethod === 'email' && styles.tabBtnActive]}
              >
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={loginMethod === 'email' ? colors.primary : colors.muted}
                />
                <Text
                  style={[
                    type.bodyMedium,
                    {
                      color: loginMethod === 'email' ? colors.primary : colors.muted,
                      fontWeight: loginMethod === 'email' ? '700' : '500',
                      marginLeft: 6,
                    },
                  ]}
                >
                  Email ID
                </Text>
              </Pressable>
            </View>

            {/* Input based on selected method */}
            {loginMethod === 'mobile' ? (
              <Input
                label="Registered Mobile Number"
                icon="phone-portrait-outline"
                prefix="+91"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(v) => {
                  setMobile(v.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="98765 43210"
                error={error}
                containerStyle={{ marginTop: spacing.md }}
              />
            ) : (
              <Input
                label="Registered Email Address"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError('');
                }}
                placeholder="partner@example.com"
                error={error}
                containerStyle={{ marginTop: spacing.md }}
              />
            )}

            <Button
              label={loginMethod === 'mobile' ? 'Send 6-Digit Mobile OTP' : 'Send Email Verification Code'}
              fullWidth
              size="lg"
              loading={isLoading}
              onPress={handleSendOtp}
              icon="arrow-forward"
              iconPosition="right"
              style={{ marginTop: spacing.md }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={[type.tiny, { color: colors.muted, marginHorizontal: spacing.sm }]}>DEMO ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable onPress={handleDemoExisting} style={styles.demoBtn}>
              <Ionicons name="flash" size={16} color={colors.secondary} />
              <Text style={[type.bodyMedium, { color: colors.secondary, marginLeft: 6 }]}>
                Explore as approved provider (Demo)
              </Text>
            </Pressable>

            <Text style={styles.terms}>
              By proceeding, you agree to Aagara Thirupthi's Partner Terms of Service and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_HEIGHT, backgroundColor: colors.divider },
  heroOverlay: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: HERO_HEIGHT - 32,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
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
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 4,
    marginTop: spacing.lg,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
    backgroundColor: colors.secondaryLight + '40',
  },
  terms: { ...type.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xl },
});
