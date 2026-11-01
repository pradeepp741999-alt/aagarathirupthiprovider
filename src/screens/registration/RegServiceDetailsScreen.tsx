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

  // State initialized clean for new users without any pre-selected test data
  const [veg, setVeg] = useState<'veg' | 'non_veg' | 'both' | ''>(provider.veg || '');
  const [minCapacity, setMinCapacity] = useState(provider.minCapacity || 0);
  const [maxCapacity, setMaxCapacity] = useState(provider.maxCapacity || 0);
  const [yearsActive, setYearsActive] = useState(provider.yearsActive || 0);

  // Makeup specific clean state
  const [selectedMakeupServices, setSelectedMakeupServices] = useState<string[]>([]);
  const [travelType, setTravelType] = useState<string>('');
  const [trialAvailable, setTrialAvailable] = useState<boolean | null>(null);
  const [maxClientsPerDay, setMaxClientsPerDay] = useState(0);

  const [error, setError] = useState('');

  const toggleMakeupService = (svc: string) => {
    setError('');
    setSelectedMakeupServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleContinue = () => {
    if (isMakeup) {
      if (selectedMakeupServices.length === 0) {
        setError('Please select at least one makeup service you offer.');
        return;
      }
      if (!travelType) {
        setError('Please select your service location (venue, studio, or both).');
        return;
      }
      if (maxClientsPerDay <= 0) {
        setError('Please select maximum clients you can accept per day.');
        return;
      }
      setError('');
      updateProvider({
        minCapacity: 1,
        maxCapacity: maxClientsPerDay,
        yearsActive,
        tagline: selectedMakeupServices.slice(0, 3).join(', '),
      });
    } else {
      if (provider.category === 'catering' && !veg) {
        setError('Please select food type preference (veg / non-veg / both).');
        return;
      }
      if (maxCapacity <= 0) {
        setError('Please specify your guest serving capacity.');
        return;
      }
      setError('');
      updateProvider({
        veg: (veg || 'both') as any,
        minCapacity: minCapacity || 10,
        maxCapacity: maxCapacity || 100,
        yearsActive,
      });
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
      {error ? (
        <View style={styles.errorBox}>
          <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}

      {isMakeup ? (
        <>
          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Services you offer <Text style={{ color: colors.danger }}>*</Text>
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
            Service location <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            {travelOptions.map((t) => (
              <Chip
                key={t.id}
                label={t.label}
                selected={travelType === t.id}
                onPress={() => {
                  setTravelType(t.id);
                  setError('');
                }}
              />
            ))}
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Bridal trial session
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
            <Chip
              label="Trial available on request"
              selected={trialAvailable === true}
              onPress={() => setTrialAvailable(true)}
            />
            <Chip
              label="No trial sessions"
              selected={trialAvailable === false}
              onPress={() => setTrialAvailable(false)}
            />
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Maximum clients / makeups per day <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <Stepper
            value={maxClientsPerDay}
            onChange={(val) => {
              setMaxClientsPerDay(val);
              setError('');
            }}
            step={1}
            min={0}
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
              <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
                Food type <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
                {vegOptions.map((v) => (
                  <Chip
                    key={v.id}
                    label={v.label}
                    selected={veg === v.id}
                    onPress={() => {
                      setVeg(v.id);
                      setError('');
                    }}
                  />
                ))}
              </View>
            </>
          )}

          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Minimum guests you accept
          </Text>
          <Stepper
            value={minCapacity}
            onChange={setMinCapacity}
            step={10}
            min={0}
            max={maxCapacity || 5000}
            suffix="guests"
          />

          <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Maximum guests you can serve <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <Stepper
            value={maxCapacity}
            onChange={(val) => {
              setMaxCapacity(val);
              setError('');
            }}
            step={50}
            min={minCapacity || 0}
            max={5000}
            suffix="guests"
          />

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
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  hintBox: {
    marginTop: spacing.xxl,
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: spacing.lg,
  },
});
