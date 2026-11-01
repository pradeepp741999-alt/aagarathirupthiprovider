import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { Input } from '../../components';
import { PricingModel } from '../../data/types';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegPricing'>;

interface PricingOption {
  id: PricingModel;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const cateringModels: PricingOption[] = [
  { id: 'per_person', label: 'Per Person', desc: 'Charge a fixed rate per guest or plate', icon: 'people-outline' },
  { id: 'per_dish', label: 'Per Dish / Item', desc: 'Each dish or menu item priced individually', icon: 'restaurant-outline' },
  { id: 'package', label: 'Packages', desc: 'Predefined banquet packages with bundled price', icon: 'cube-outline' },
  { id: 'custom', label: 'Custom Quote', desc: 'Provide a quotation after reviewing each requirement', icon: 'create-outline' },
];

const makeupModels: PricingOption[] = [
  { id: 'per_person', label: 'Per Service', desc: 'Charge a fixed rate per service or makeup session', icon: 'sparkles-outline' },
  { id: 'package', label: 'Packages', desc: 'Predefined bridal or party combo packages with bundled price', icon: 'cube-outline' },
  { id: 'custom', label: 'Custom Quote', desc: 'Provide a quotation after reviewing event & venue needs', icon: 'create-outline' },
];

const defaultModels: PricingOption[] = [
  { id: 'per_person', label: 'Per Event', desc: 'Fixed base rate per event setup', icon: 'calendar-outline' },
  { id: 'package', label: 'Packages', desc: 'Predefined service bundles with fixed price', icon: 'cube-outline' },
  { id: 'custom', label: 'Custom Quote', desc: 'Provide custom quote per event specification', icon: 'create-outline' },
];

export function RegPricingScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);

  const isMakeup = provider.category === 'makeup';
  const isCatering = provider.category === 'catering';

  const models = isMakeup ? makeupModels : isCatering ? cateringModels : defaultModels;

  // No option selected by default for new users
  const [pricingModel, setPricingModel] = useState<PricingModel | ''>(provider.pricingModel || '');
  const [startingPrice, setStartingPrice] = useState(
    provider.startingPrice && provider.startingPrice > 0 ? String(provider.startingPrice) : ''
  );
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!pricingModel) {
      setError('Please select a pricing option.');
      return;
    }

    const priceNum = Number(startingPrice.replace(/\D/g, ''));
    if (!startingPrice.trim() || priceNum <= 0) {
      setError('Please enter starting price.');
      return;
    }

    setError('');
    updateProvider({ pricingModel, startingPrice: priceNum });
    goToStep(4);
    navigation.navigate('RegCoverageArea');
  };

  const getPriceLabel = () => {
    if (isMakeup) {
      if (pricingModel === 'package') return 'Starting package price (₹)';
      return 'Starting price per service (₹)';
    }
    if (isCatering) {
      if (pricingModel === 'per_person') return 'Starting price per plate / guest (₹)';
      if (pricingModel === 'per_dish') return 'Lowest dish price (₹)';
      if (pricingModel === 'package') return 'Starting package price (₹)';
    }
    return 'Starting price (₹)';
  };

  return (
    <RegistrationLayout
      stepIndex={3}
      title="How do you price your service?"
      subtitle={'This decides how your "starting price" is shown to customers.'}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {error ? (
        <View style={styles.errorBox}>
          <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}

      <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
        Pricing model <Text style={{ color: colors.danger }}>*</Text>
      </Text>

      {models.map((m) => {
        const active = pricingModel === m.id;
        return (
          <Pressable
            key={m.label}
            onPress={() => {
              setPricingModel(m.id);
              setError('');
            }}
            style={[styles.card, shadow.sm, active && { borderColor: colors.primary, borderWidth: 2 }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: active ? colors.primary : colors.primarySoft }]}>
              <Ionicons name={m.icon} size={20} color={active ? colors.white : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{m.label}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>{m.desc}</Text>
            </View>
            <Ionicons
              name={active ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={active ? colors.primary : colors.faint}
            />
          </Pressable>
        );
      })}

      <Input
        label={`${getPriceLabel()} *`}
        icon="cash-outline"
        keyboardType="number-pad"
        value={startingPrice}
        onChangeText={(v) => {
          setStartingPrice(v.replace(/\D/g, ''));
          setError('');
        }}
        placeholder="e.g. 2000"
        containerStyle={{ marginTop: spacing.lg }}
      />
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
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
