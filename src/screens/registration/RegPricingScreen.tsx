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

const models: { id: PricingModel; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'per_person', label: 'Per Person', desc: 'Charge a fixed rate per guest', icon: 'people-outline' },
  { id: 'per_dish', label: 'Per Dish / Item', desc: 'Each dish or item priced individually', icon: 'restaurant-outline' },
  { id: 'package', label: 'Packages', desc: 'Predefined packages with a bundled price', icon: 'cube-outline' },
  { id: 'custom', label: 'Custom Quote', desc: 'Provide a quotation after reviewing each enquiry', icon: 'create-outline' },
];

export function RegPricingScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [pricingModel, setPricingModel] = useState<PricingModel>(provider.pricingModel);
  const [startingPrice, setStartingPrice] = useState(provider.startingPrice ? String(provider.startingPrice) : '');

  const handleContinue = () => {
    updateProvider({ pricingModel, startingPrice: Number(startingPrice) || 0 });
    goToStep(4);
    navigation.navigate('RegCoverageArea');
  };

  return (
    <RegistrationLayout
      stepIndex={3}
      title="How do you price your service?"
      subtitle={'This decides how your "starting price" is shown to customers.'}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {models.map((m) => {
        const active = pricingModel === m.id;
        return (
          <Pressable
            key={m.id}
            onPress={() => setPricingModel(m.id)}
            style={[styles.card, shadow.sm, active && { borderColor: colors.primary, borderWidth: 2 }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: active ? colors.primary : colors.primarySoft }]}>
              <Ionicons name={m.icon} size={20} color={active ? colors.white : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{m.label}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>{m.desc}</Text>
            </View>
          </Pressable>
        );
      })}

      <Input
        label={pricingModel === 'per_person' ? 'Starting price per person (₹)' : pricingModel === 'per_dish' ? 'Lowest dish price (₹)' : 'Starting price (₹)'}
        icon="cash-outline"
        keyboardType="number-pad"
        value={startingPrice}
        onChangeText={(v) => setStartingPrice(v.replace(/\D/g, ''))}
        placeholder="e.g. 200"
        containerStyle={{ marginTop: spacing.lg }}
      />
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
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
