import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { DocStatusBadge } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegDocuments'>;

export function RegDocumentsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const setDocumentStatus = useProviderStore((s) => s.setDocumentStatus);
  const goToStep = useProviderStore((s) => s.goToStep);

  const requiredMissing = provider.documents.some((d) => d.required && d.status === 'missing');

  const simulateUpload = (docId: string) => {
    setDocumentStatus(docId, 'uploaded', 'document.pdf');
  };

  const handleContinue = () => {
    goToStep(6);
    navigation.navigate('RegBankDetails');
  };

  return (
    <RegistrationLayout
      stepIndex={5}
      title="Upload verification documents"
      subtitle="These help us verify your business and keep the platform trustworthy for customers."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={requiredMissing}
      continueLabel={requiredMissing ? 'Upload required documents' : 'Continue'}
    >
      {provider.documents.map((doc) => (
        <View key={doc.id} style={[styles.card, shadow.sm]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
              {doc.label}{!doc.required && <Text style={{ color: colors.muted }}> (optional)</Text>}
            </Text>
            {doc.fileName ? (
              <Text style={[type.caption, { color: colors.muted }]} numberOfLines={1}>{doc.fileName}</Text>
            ) : (
              <DocStatusBadge status={doc.status} compact />
            )}
          </View>
          <Pressable onPress={() => simulateUpload(doc.id)} style={styles.uploadBtn}>
            <Ionicons name={doc.fileName ? 'refresh' : 'cloud-upload-outline'} size={16} color={colors.primary} />
            <Text style={[type.caption, { color: colors.primary, marginLeft: 4 }]}>
              {doc.fileName ? 'Replace' : 'Upload'}
            </Text>
          </Pressable>
        </View>
      ))}
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
});
