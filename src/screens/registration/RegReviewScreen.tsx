import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { categories } from '../../data/categories';
import { districts } from '../../data/districts';
import { formatCurrency } from '../../utils/currency';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegReview'>;

export function RegReviewScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const submitForApproval = useProviderStore((s) => s.submitForApproval);

  const categoryLabel = categories.find((c) => c.id === provider.category)?.name ?? provider.category;
  const districtLabel = districts.find((d) => d.id === provider.district)?.name ?? provider.district;

  const sections: { title: string; icon: keyof typeof Ionicons.glyphMap; onEdit: () => void; rows: [string, string][] }[] = [
    {
      title: 'Business Info',
      icon: 'business-outline',
      onEdit: () => navigation.navigate('RegBusinessInfo'),
      rows: [
        ['Business Name', provider.businessName],
        ['Owner', provider.ownerName],
        ['WhatsApp', provider.whatsapp],
      ],
    },
    {
      title: 'Category & Capacity',
      icon: 'grid-outline',
      onEdit: () => navigation.navigate('RegCategory'),
      rows: [
        ['Category', categoryLabel],
        ['Capacity', `${provider.minCapacity} – ${provider.maxCapacity} guests`],
        ['Years Active', String(provider.yearsActive)],
      ],
    },
    {
      title: 'Pricing',
      icon: 'cash-outline',
      onEdit: () => navigation.navigate('RegPricing'),
      rows: [
        ['Pricing Model', provider.pricingModel.replace('_', ' ')],
        ['Starting Price', formatCurrency(provider.startingPrice)],
      ],
    },
    {
      title: 'Coverage Area',
      icon: 'location-outline',
      onEdit: () => navigation.navigate('RegCoverageArea'),
      rows: [
        ['District', districtLabel],
        ['Areas', provider.areas.join(', ') || '—'],
        ['Travel Distance', `${provider.serviceAreas[0]?.travelDistanceKm ?? 0} km`],
      ],
    },
    {
      title: 'Documents',
      icon: 'document-text-outline',
      onEdit: () => navigation.navigate('RegDocuments'),
      rows: [['Uploaded', `${provider.documents.filter((d) => d.status !== 'missing').length} / ${provider.documents.length}`]],
    },
    {
      title: 'Bank Details',
      icon: 'card-outline',
      onEdit: () => navigation.navigate('RegBankDetails'),
      rows: [
        ['Account Holder', provider.bankDetails.accountHolder],
        ['Account Number', provider.bankDetails.accountNumber ? '••••' + provider.bankDetails.accountNumber.slice(-4) : ''],
      ],
    },
  ];

  return (
    <RegistrationLayout
      stepIndex={7}
      title="Review & submit"
      subtitle="Double-check your details. Our team will review your application after submission."
      onBack={() => navigation.goBack()}
      onContinue={submitForApproval}
      continueLabel="Submit for Approval"
    >
      {sections.map((section) => (
        <View key={section.title} style={[styles.card, shadow.sm]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <Ionicons name={section.icon} size={16} color={colors.primary} />
              <Text style={[type.bodyMedium, { color: colors.ink, marginLeft: 6 }]}>{section.title}</Text>
            </View>
            <Pressable onPress={section.onEdit} hitSlop={8}>
              <Text style={[type.caption, { color: colors.primary }]}>Edit</Text>
            </Pressable>
          </View>
          {section.rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={[type.caption, { color: colors.muted }]}>{label}</Text>
              <Text style={[type.caption, { color: colors.ink, flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                {value || '—'}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={[type.caption, { color: colors.muted, textAlign: 'center', marginTop: spacing.md }]}>
        By submitting, you agree that the information provided is accurate and confirm the Provider Terms of Service.
      </Text>
    </RegistrationLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3, gap: spacing.sm },
});
