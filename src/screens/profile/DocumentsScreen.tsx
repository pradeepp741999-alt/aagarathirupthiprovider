import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { DocStatusBadge, ScreenHeader } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Documents'>;

export function DocumentsScreen({ navigation }: Props) {
  const documents = useProviderStore((s) => s.provider.documents);
  const setDocumentStatus = useProviderStore((s) => s.setDocumentStatus);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Verification Documents" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        {documents.map((doc) => (
          <View key={doc.id} style={[styles.card, shadow.sm]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
                {doc.label}{!doc.required && <Text style={{ color: colors.muted }}> (optional)</Text>}
              </Text>
              {doc.fileName && <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]} numberOfLines={1}>{doc.fileName}</Text>}
              <View style={{ marginTop: 4 }}>
                <DocStatusBadge status={doc.status} compact />
              </View>
            </View>
            <Pressable onPress={() => setDocumentStatus(doc.id, 'uploaded', 'document.pdf')} style={styles.uploadBtn}>
              <Ionicons name={doc.fileName ? 'refresh' : 'cloud-upload-outline'} size={16} color={colors.primary} />
              <Text style={[type.caption, { color: colors.primary, marginLeft: 4 }]}>{doc.fileName ? 'Replace' : 'Upload'}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md, gap: spacing.md,
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill, backgroundColor: colors.primarySoft,
  },
});
