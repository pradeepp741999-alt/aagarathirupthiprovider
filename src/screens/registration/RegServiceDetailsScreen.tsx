import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Chip, Stepper } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegServiceDetails'>;

const vegOptions: { id: 'veg' | 'non_veg' | 'both'; label: string }[] = [
  { id: 'veg', label: 'Vegetarian only' },
  { id: 'non_veg', label: 'Non-vegetarian only' },
  { id: 'both', label: 'Both veg & non-veg' },
];

export function RegServiceDetailsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [veg, setVeg] = useState(provider.veg);
  const [minCapacity, setMinCapacity] = useState(provider.minCapacity || 50);
  const [maxCapacity, setMaxCapacity] = useState(provider.maxCapacity || 500);
  const [yearsActive, setYearsActive] = useState(provider.yearsActive || 1);

  const handleContinue = () => {
    updateProvider({ veg, minCapacity, maxCapacity, yearsActive });
    goToStep(3);
    navigation.navigate('RegPricing');
  };

  return (
    <RegistrationLayout
      stepIndex={2}
      title="Service capacity"
      subtitle="Help customers know if you can handle the size of their event."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {provider.category === 'catering' && (
        <>
          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Food type</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            {vegOptions.map((v) => (
              <Chip key={v.id} label={v.label} selected={veg === v.id} onPress={() => setVeg(v.id)} />
            ))}
          </View>
        </>
      )}

      <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Minimum guests you accept</Text>
      <Stepper value={minCapacity} onChange={setMinCapacity} step={10} min={10} max={maxCapacity} suffix="guests" />

      <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
        Maximum guests you can serve
      </Text>
      <Stepper value={maxCapacity} onChange={setMaxCapacity} step={50} min={minCapacity} max={5000} suffix="guests" />

      <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
        Years in business
      </Text>
      <Stepper value={yearsActive} onChange={setYearsActive} step={1} min={0} max={60} suffix="years" />

      <View style={styles.hintBox}>
        <Text style={[type.caption, { color: colors.body }]}>
          You'll add your detailed menu, dishes, packages and pricing after registration, from the Services tab.
        </Text>
      </View>
    </RegistrationLayout>
  );
}

const styles = StyleSheet.create({
  hintBox: {
    marginTop: spacing.xxl,
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: spacing.lg,
  },
});
