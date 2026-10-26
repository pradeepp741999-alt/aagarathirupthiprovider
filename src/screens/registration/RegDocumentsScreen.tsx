import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { DocStatusBadge, Input } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegDocuments'>;

export function RegDocumentsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const setDocumentStatus = useProviderStore((s) => s.setDocumentStatus);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [fssaiNumber, setFssaiNumber] = React.useState('');
  const [fssaiExpiry, setFssaiExpiry] = React.useState('');

  const isCatering =
    provider.category === 'catering' || provider.secondaryCategories.includes('catering');

  // Filter documents: only show FSSAI if catering
  const displayedDocs = provider.documents.filter((d) => {
    if (d.id === 'doc-bank') return false; // bank proof is removed
    if (d.id === 'doc-fssai' && !isCatering) return false;
    return true;
  });

  const requiredMissing = displayedDocs.some((d) => d.required && d.status === 'missing');

  const simulateUpload = (docId: string) => {
    const defaultName =
      docId === 'doc-fssai'
        ? 'fssai_cert.pdf'
        : docId === 'doc-trade'
        ? 'trade_license.pdf'
        : docId === 'doc-address'
        ? 'address_proof.pdf'
        : 'owner_id.pdf';
    setDocumentStatus(docId, 'uploaded', defaultName);
  };

  const handleContinue = () => {
    goToStep(6);
    navigation.navigate('RegReview');
  };

  return (
    <RegistrationLayout
      stepIndex={5}
      title="Upload verification documents"
      subtitle="Only Owner ID and Address Proof are required to submit. You can provide optional trade licenses anytime."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={requiredMissing}
      continueLabel={requiredMissing ? 'Upload required documents' : 'Continue to Review'}
    >
      {displayedDocs.map((doc) => {
        const isFssai = doc.id === 'doc-fssai';
        return (
          <View key={doc.id} style={{ marginBottom: spacing.md }}>
            <View style={[styles.card, shadow.sm]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
                  {doc.label}
                  {!doc.required && <Text style={{ color: colors.muted }}> (optional)</Text>}
                </Text>
                {doc.fileName ? (
                  <Text style={[type.caption, { color: colors.muted }]} numberOfLines={1}>
                    {doc.fileName}
                  </Text>
                ) : (
                  <DocStatusBadge status={doc.status} compact />
                )}
              </View>
              <Pressable onPress={() => simulateUpload(doc.id)} style={styles.uploadBtn}>
                <Ionicons
                  name={doc.fileName ? 'refresh' : 'cloud-upload-outline'}
                  size={16}
                  color={colors.primary}
                />
                <Text style={[type.caption, { color: colors.primary, marginLeft: 4 }]}>
                  {doc.fileName ? 'Replace' : 'Upload'}
                </Text>
              </Pressable>
            </View>

            {isFssai && doc.status === 'uploaded' && (
              <View style={styles.fssaiDetailsCard}>
                <Text style={[type.caption, { color: colors.primaryDark, fontWeight: '600', marginBottom: spacing.xs }]}>
                  FSSAI Registration Details (Optional)
                </Text>
                <Input
                  label="14-digit FSSAI Number"
                  placeholder="e.g. 12423005000123"
                  value={fssaiNumber}
                  onChangeText={setFssaiNumber}
                  keyboardType="number-pad"
                  containerStyle={{ marginBottom: spacing.sm }}
                />
                <Input
                  label="Certificate Expiry Date"
                  placeholder="DD/MM/YYYY"
                  value={fssaiExpiry}
                  onChangeText={setFssaiExpiry}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            )}
          </View>
        );
      })}
    </RegistrationLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  fssaiDetailsCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
  },
});
