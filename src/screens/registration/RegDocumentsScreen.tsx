import React, { useState } from 'react';
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

  const [fssaiNumber, setFssaiNumber] = useState('');
  const [fssaiExpiry, setFssaiExpiry] = useState('');
  const [error, setError] = useState('');

  const isCatering =
    provider.category === 'catering' || provider.secondaryCategories.includes('catering');

  // Filter documents: only show FSSAI if catering provider
  const displayedDocs = provider.documents.filter((d) => {
    if (d.id === 'doc-bank') return false; // bank proof is removed
    if (d.id === 'doc-fssai' && !isCatering) return false;
    return true;
  });

  const requiredMissing = displayedDocs.some((d) => d.required && (!d.fileName || d.status === 'missing'));

  const handleOpenFilePicker = (docId: string) => {
    setError('');
    if (typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file && file.name) {
          setDocumentStatus(docId, 'uploaded', file.name);
        }
      };
      input.click();
    } else {
      setDocumentStatus(docId, 'uploaded', `${docId}_uploaded.pdf`);
    }
  };

  const handleRemoveFile = (docId: string) => {
    setDocumentStatus(docId, 'missing', undefined);
  };

  const handleContinue = () => {
    if (requiredMissing) {
      setError('Please upload the required Owner ID and Address Proof documents to continue.');
      return;
    }
    setError('');
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
      {error ? (
        <View style={styles.errorBox}>
          <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}

      {displayedDocs.map((doc) => {
        const isFssai = doc.id === 'doc-fssai';
        const hasFile = Boolean(doc.fileName && doc.status === 'uploaded');

        return (
          <View key={doc.id} style={{ marginBottom: spacing.md }}>
            <View style={[styles.card, shadow.sm, hasFile && styles.cardUploaded]}>
              <View style={[styles.iconWrap, { backgroundColor: hasFile ? '#DCFCE7' : colors.primarySoft }]}>
                <Ionicons
                  name={hasFile ? 'checkmark-circle' : 'document-attach-outline'}
                  size={20}
                  color={hasFile ? '#16A34A' : colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
                  {doc.label}
                  {doc.required ? (
                    <Text style={{ color: colors.danger }}> *</Text>
                  ) : (
                    <Text style={{ color: colors.muted }}> (optional)</Text>
                  )}
                </Text>
                {hasFile ? (
                  <Text style={[type.caption, { color: colors.primaryDark, fontWeight: '600' }]} numberOfLines={1}>
                    {doc.fileName}
                  </Text>
                ) : (
                  <Text style={[type.caption, { color: colors.muted }]}>
                    No file chosen (PDF, PNG, JPG up to 10MB)
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {hasFile ? (
                  <>
                    <Pressable onPress={() => handleOpenFilePicker(doc.id)} style={styles.uploadBtn}>
                      <Ionicons name="refresh" size={14} color={colors.primary} />
                      <Text style={[type.caption, { color: colors.primary, marginLeft: 4 }]}>Replace</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveFile(doc.id)} style={styles.removeBtn} hitSlop={6}>
                      <Ionicons name="trash-outline" size={16} color={colors.danger} />
                    </Pressable>
                  </>
                ) : (
                  <Pressable onPress={() => handleOpenFilePicker(doc.id)} style={styles.uploadBtn}>
                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                    <Text style={[type.caption, { color: colors.primary, marginLeft: 4, fontWeight: '600' }]}>
                      Upload
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {isFssai && hasFile && (
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
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardUploaded: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  removeBtn: {
    padding: 6,
    borderRadius: radius.pill,
  },
  fssaiDetailsCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
});
