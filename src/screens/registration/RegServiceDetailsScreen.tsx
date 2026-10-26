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

const makeupServiceOptions = [
  'Bridal Makeup',
  'Engagement / Reception',
  'Party / Guest Makeup',
  'Groom Styling',
  'Saree Draping',
  'Hair Styling',
  'HD / Airbrush Makeup',
];

const travelOptions: { id: string; label: string }[] = [
  { id: 'venue', label: 'Travel to venue' },
  { id: 'studio', label: 'At studio only' },
  { id: 'both', label: 'Both venue & studio' },
];

export function RegServiceDetailsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);

  const isMakeup = provider.category === 'makeup';

  const [veg, setVeg] = useState(provider.veg);
  const [minCapacity, setMinCapacity] = useState(provider.minCapacity || (isMakeup ? 1 : 50));
  const [maxCapacity, setMaxCapacity] = useState(provider.maxCapacity || (isMakeup ? 5 : 500));
  const [yearsActive, setYearsActive] = useState(provider.yearsActive || 1);

  // Makeup specific state
  const [selectedMakeupServices, setSelectedMakeupServices] = useState<string[]>([
    'Bridal Makeup',
    'Engagement / Reception',
    'Saree Draping',
  ]);
  const [travelType, setTravelType] = useState('both');
  const [trialAvailable, setTrialAvailable] = useState(true);
  const [maxClientsPerDay, setMaxClientsPerDay] = useState(3);

  const toggleMakeupService = (svc: string) => {
    setSelectedMakeupServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleContinue = () => {
    if (isMakeup) {
      updateProvider({
        minCapacity: 1,
        maxCapacity: maxClientsPerDay,
        yearsActive,
        tagline: provider.tagline || selectedMakeupServices.slice(0, 3).join(', '),
      });
    } else {
      updateProvider({ veg, minCapacity, maxCapacity, yearsActive });
    }
    goToStep(3);
    navigation.navigate('RegPricing');
  };

  return (
    <RegistrationLayout
      stepIndex={2}
      title={isMakeup ? 'Makeup service details' : 'Service capacity'}
      subtitle={
        isMakeup
          ? 'Tell clients about your makeup specialties and booking capacity.'
          : 'Help customers know if you can handle the size of their event.'
      }
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {isMakeup ? (
        <>
          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Services you offer
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            {makeupServiceOptions.map((svc) => (
              <Chip
                key={svc}
                label={svc}
                selected={selectedMakeupServices.includes(svc)}
                onPress={() => toggleMakeupService(svc)}
              />
            ))}
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Service location
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            {travelOptions.map((t) => (
              <Chip
                key={t.id}
                label={t.label}
                selected={travelType === t.id}
                onPress={() => setTravelType(t.id)}
              />
            ))}
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Bridal trial session
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            <Chip
              label="Trial available on request"
              selected={trialAvailable}
              onPress={() => setTrialAvailable(true)}
            />
            <Chip
              label="No trial sessions"
              selected={!trialAvailable}
              onPress={() => setTrialAvailable(false)}
            />
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Maximum clients / makeups per day
          </Text>
          <Stepper
            value={maxClientsPerDay}
            onChange={setMaxClientsPerDay}
            step={1}
            min={1}
            max={15}
            suffix="clients/day"
          />

          <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Years of experience
          </Text>
          <Stepper value={yearsActive} onChange={setYearsActive} step={1} min={0} max={40} suffix="years" />

          <View style={styles.hintBox}>
            <Text style={[type.caption, { color: colors.body }]}>
              You'll be able to create bridal packages, party makeup packages and combos from the Services tab after registration.
            </Text>
          </View>
        </>
      ) : (
        <>
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

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Minimum guests you accept
          </Text>
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
        </>
      )}
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
