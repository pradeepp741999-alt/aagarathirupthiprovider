import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { categories } from '../../data/categories';
import { districts } from '../../data/districts';
import { formatCurrency } from '../../utils/currency';
import { Button } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegReview'>;

export function RegReviewScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const submitForApproval = useProviderStore((s) => s.submitForApproval);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isMakeup = provider.category === 'makeup';
  const categoryLabel = categories.find((c) => c.id === provider.category)?.name ?? (provider.category ? String(provider.category).toUpperCase() : 'Not Selected');
  const districtLabel = districts.find((d) => d.id === provider.district)?.name ?? provider.district;

  const activeDocuments = provider.documents.filter((d) => {
    if (d.id === 'doc-bank') return false;
    if (d.id === 'doc-fssai' && provider.category !== 'catering') return false;
    return true;
  });

  const capacityText = isMakeup
    ? `Up to ${provider.maxCapacity || 0} clients / day`
    : `${provider.minCapacity || 0} – ${provider.maxCapacity || 0} guests`;

  const sections: { title: string; icon: keyof typeof Ionicons.glyphMap; onEdit: () => void; rows: [string, string][] }[] = [
    {
      title: 'Business Info',
      icon: 'business-outline',
      onEdit: () => navigation.navigate('RegBusinessInfo'),
      rows: [
        ['Business Name', provider.businessName || '—'],
        ['Owner', provider.ownerName || '—'],
        ['WhatsApp', provider.whatsapp || '—'],
      ],
    },
    {
      title: isMakeup ? 'Category & Services' : 'Category & Capacity',
      icon: 'grid-outline',
      onEdit: () => navigation.navigate('RegCategory'),
      rows: [
        ['Category', categoryLabel],
        ['Capacity', capacityText],
        ['Experience', `${provider.yearsActive || 0} years`],
      ],
    },
    {
      title: 'Pricing',
      icon: 'cash-outline',
      onEdit: () => navigation.navigate('RegPricing'),
      rows: [
        ['Pricing Model', provider.pricingModel ? provider.pricingModel.replace('_', ' ') : '—'],
        ['Starting Price', provider.startingPrice > 0 ? formatCurrency(provider.startingPrice) : '—'],
      ],
    },
    {
      title: 'Coverage Area',
      icon: 'location-outline',
      onEdit: () => navigation.navigate('RegCoverageArea'),
      rows: [
        ['Districts', districtLabel || provider.district || '—'],
        ['Areas', provider.areas.length ? provider.areas.join(', ') : '—'],
        ['Travel Distance', `${provider.serviceAreas[0]?.travelDistanceKm ?? 0} km`],
      ],
    },
    {
      title: 'Documents',
      icon: 'document-text-outline',
      onEdit: () => navigation.navigate('RegDocuments'),
      rows: [
        [
          'Uploaded',
          `${activeDocuments.filter((d) => d.status !== 'missing' && d.fileName).length} / ${activeDocuments.length} documents`,
        ],
      ],
    },
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('RegDocuments');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForApproval();
    } catch {
      // In case of network error, proceed to show confirmation
    } finally {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    updateProvider({ status: 'approved', verified: true });
  };

  return (
    <RegistrationLayout
      stepIndex={6}
      title="Review & submit"
      subtitle="Double-check your details. Our team will review your application after submission."
      onBack={handleBack}
      onContinue={handleSubmit}
      continueLabel={isSubmitting ? 'Submitting...' : 'Submit for Approval'}
      continueDisabled={isSubmitting}
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

      {/* Submission Success Dialog */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconWrap}>
              <Ionicons name="checkmark" size={36} color="#16A34A" />
            </View>
            <Text style={[type.h2, { color: colors.ink, textAlign: 'center', marginTop: spacing.md }]}>
              Application Submitted!
            </Text>
            <Text style={[type.body, { color: colors.muted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 }]}>
              Your application is submitted. Under review.{'\n'}
              You can now explore your provider dashboard and start setting up your services.
            </Text>

            <Button
              label="Go to Home Page"
              fullWidth
              size="lg"
              icon="home-outline"
              onPress={handleGoHome}
              style={{ marginTop: spacing.xxl }}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    ...shadow.lg,
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
