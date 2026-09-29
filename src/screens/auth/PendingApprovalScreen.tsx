import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius } from '../../theme';
import { Button, Card, DocStatusBadge, ProviderStatusBadge } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { useAuthStore } from '../../store/useAuthStore';

// Shown once registration is submitted, mirroring the doc's provider-approval
// workflow (section 39): Pending → Under Review → Approved/Rejected. A
// provider can track document verification here while waiting on admin.
export function PendingApprovalScreen() {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);
  const logout = useAuthStore((s) => s.logout);

  const rejected = provider.status === 'rejected';
  const suspended = provider.status === 'suspended';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={rejected || suspended ? 'alert-circle' : 'time'}
            size={34}
            color={rejected || suspended ? colors.danger : colors.warning}
          />
        </View>
        <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl, textAlign: 'center' }]}>
          {rejected ? 'Application Rejected' : suspended ? 'Account Suspended' : 'Application Under Review'}
        </Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 8, textAlign: 'center' }]}>
          {rejected
            ? 'Our team could not verify your application. Please review the notes below and resubmit.'
            : suspended
            ? 'Your provider account has been temporarily suspended. Contact support for details.'
            : "Thanks for registering, " + (provider.ownerName.split(' ')[0] || 'there') + "! Our team is verifying your documents and business details. This usually takes 24–48 hours."}
        </Text>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <ProviderStatusBadge status={provider.status} />
        </View>

        <Card style={{ marginTop: spacing.xxl }}>
          <Text style={[type.h3, { color: colors.ink, marginBottom: spacing.md }]}>{provider.businessName || 'Your Business'}</Text>
          <Row label="Owner" value={provider.ownerName} />
          <Row label="Category" value={provider.category} />
          <Row label="District" value={provider.district} />
          <Row label="Mobile" value={'+91 ' + provider.mobile} />
        </Card>

        <Text style={[type.h3, { color: colors.ink, marginTop: spacing.xxl, marginBottom: spacing.md }]}>
          Document Verification
        </Text>
        <Card>
          {provider.documents.map((doc, i) => (
            <View
              key={doc.id}
              style={[styles.docRow, i < provider.documents.length - 1 && styles.docRowBorder]}
            >
              <Text style={[type.body, { color: colors.ink, flex: 1 }]} numberOfLines={1}>{doc.label}</Text>
              <DocStatusBadge status={doc.status} compact />
            </View>
          ))}
        </Card>

        {rejected && (
          <Button
            label="Edit & Resubmit Application"
            fullWidth
            size="lg"
            style={{ marginTop: spacing.xxl }}
            onPress={() => goToStep(0)}
          />
        )}

        {!rejected && !suspended && (
          <Button
            label="Simulate Admin Approval (Demo)"
            variant="secondary"
            fullWidth
            size="lg"
            icon="flash"
            style={{ marginTop: spacing.xxl }}
            onPress={() => updateProvider({ status: 'approved', verified: true })}
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
      <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: radius.xxl,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.xxl,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
