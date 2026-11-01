import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius } from '../../theme';
import { Button, Card, DocStatusBadge, ProviderStatusBadge } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { useAuthStore } from '../../store/useAuthStore';

export function PendingApprovalScreen() {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);
  const logout = useAuthStore((s) => s.logout);

  const rejected = provider.status === 'rejected';
  const suspended = provider.status === 'suspended';

  // Safely extract first name without throwing if ownerName is null/undefined
  const ownerNameStr = typeof provider.ownerName === 'string' ? provider.ownerName.trim() : '';
  const firstName = ownerNameStr ? ownerNameStr.split(' ')[0] : 'Partner';

  const handleOpenHome = () => {
    updateProvider({ status: 'approved', verified: true });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={rejected || suspended ? 'alert-circle' : 'checkmark-circle'}
            size={36}
            color={rejected || suspended ? colors.danger : colors.success}
          />
        </View>

        <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl, textAlign: 'center' }]}>
          {rejected
            ? 'Application Rejected'
            : suspended
            ? 'Account Suspended'
            : 'Application Submitted & Under Review'}
        </Text>

        <Text style={[type.body, { color: colors.muted, marginTop: 8, textAlign: 'center' }]}>
          {rejected
            ? 'Our team could not verify your application. Please review the notes below and resubmit.'
            : suspended
            ? 'Your provider account has been temporarily suspended. Contact support for details.'
            : `Thanks for registering, ${firstName}! Your application has been submitted and is under verification. In the meantime, you can explore your dashboard.`}
        </Text>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <ProviderStatusBadge status={provider.status} />
        </View>

        {/* Primary Action Button: Open Home page */}
        {!rejected && !suspended && (
          <Button
            label="Open Home / Provider Dashboard"
            variant="primary"
            fullWidth
            size="lg"
            icon="home-outline"
            style={{ marginTop: spacing.xl }}
            onPress={handleOpenHome}
          />
        )}

        <Card style={{ marginTop: spacing.xl }}>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.md }]}>
            {provider.businessName || 'Your Business'}
          </Text>
          <Row label="Owner" value={ownerNameStr || '—'} />
          <Row label="Category" value={provider.category ? String(provider.category).toUpperCase() : '—'} />
          <Row label="District" value={provider.district || '—'} />
          <Row label="Mobile" value={provider.mobile ? `+91 ${provider.mobile}` : '—'} />
        </Card>

        {provider.documents && provider.documents.length > 0 && (
          <>
            <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md }]}>
              Document Verification
            </Text>
            <Card>
              {provider.documents.map((doc, i) => (
                <View
                  key={doc.id}
                  style={[styles.docRow, i < provider.documents.length - 1 && styles.docRowBorder]}
                >
                  <Text style={[type.body, { color: colors.ink, flex: 1 }]} numberOfLines={1}>
                    {doc.label}
                  </Text>
                  <DocStatusBadge status={doc.status} compact />
                </View>
              ))}
            </Card>
          </>
        )}

        {rejected && (
          <Button
            label="Edit & Resubmit Application"
            fullWidth
            size="lg"
            style={{ marginTop: spacing.xxl }}
            onPress={() => goToStep(0)}
          />
        )}

        <Button label="Log Out" variant="ghost" fullWidth onPress={logout} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.caption, { color: colors.muted }]}>{label}</Text>
      <Text style={[type.caption, { color: colors.ink, fontWeight: '600' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
