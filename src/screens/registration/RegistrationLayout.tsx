import React from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius } from '../../theme';
import { Button, ProgressSteps } from '../../components';
import { registrationSteps } from '../../store/useProviderStore';

interface Props {
  stepIndex: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  continueLabel?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
}

export function RegistrationLayout({
  stepIndex,
  title,
  subtitle,
  onBack,
  children,
  footer,
  continueLabel = 'Continue',
  onContinue,
  continueDisabled,
}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {onBack ? (
              <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
                <Ionicons name="chevron-back" size={22} color={colors.ink} />
              </Pressable>
            ) : (
              <View style={styles.backBtn} />
            )}
            <Text style={[type.caption, { color: colors.muted }]}>
              Step {stepIndex + 1} of {registrationSteps.length}
            </Text>
            <View style={styles.backBtn} />
          </View>
          <ProgressSteps steps={registrationSteps} currentIndex={stepIndex} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[type.h1, { color: colors.ink }]}>{title}</Text>
          {subtitle && <Text style={[type.body, { color: colors.muted, marginTop: 6 }]}>{subtitle}</Text>}
          <View style={{ marginTop: spacing.xxl }}>{children}</View>
        </ScrollView>

        <View style={styles.footer}>
          {footer}
          {onContinue && (
            <Button label={continueLabel} fullWidth size="lg" onPress={onContinue} disabled={continueDisabled} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  backBtn: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
});
