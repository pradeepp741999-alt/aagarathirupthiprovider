import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Chip, Input } from '../../components';
import { districts, salemAreas, distanceOptions } from '../../data/districts';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegCoverageArea'>;

export function RegCoverageAreaScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const setServiceAreas = useProviderStore((s) => s.setServiceAreas);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [district, setDistrict] = useState(provider.district || 'salem');
  const [areas, setAreas] = useState<string[]>(provider.areas.length ? provider.areas : []);
  const [customArea, setCustomArea] = useState('');
  const [travelDistanceKm, setTravelDistanceKm] = useState(provider.serviceAreas[0]?.travelDistanceKm ?? 25);

  const areaOptions = district === 'salem' ? salemAreas : [];

  const toggleArea = (a: string) => {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const addCustomArea = () => {
    const trimmed = customArea.trim();
    if (trimmed && !areas.includes(trimmed)) {
      setAreas((prev) => [...prev, trimmed]);
      setCustomArea('');
    }
  };

  const handleContinue = () => {
    updateProvider({ district, areas });
    setServiceAreas([{ district, areas, travelDistanceKm }]);
    goToStep(5);
    navigation.navigate('RegDocuments');
  };

  return (
    <RegistrationLayout
      stepIndex={4}
      title="Where do you provide service?"
      subtitle="Customers in these districts and areas will be able to find you."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={areas.length === 0}
    >
      <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>District</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
        {districts.map((d) => (
          <Chip key={d.id} label={d.name} selected={district === d.id} onPress={() => setDistrict(d.id)} />
        ))}
      </View>

      <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Areas you serve</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
        {areaOptions.map((a) => (
          <Chip key={a} label={a} selected={areas.includes(a)} onPress={() => toggleArea(a)} />
        ))}
        {areas.filter((a) => !areaOptions.includes(a)).map((a) => (
          <Chip key={a} label={a} selected onPress={() => toggleArea(a)} tone="info" />
        ))}
      </View>
      <Input
        placeholder="Add another area and press done"
        icon="location-outline"
        value={customArea}
        onChangeText={setCustomArea}
        onSubmitEditing={addCustomArea}
        returnKeyType="done"
      />

      <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
        How far will you travel for an event?
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {distanceOptions.map((d) => (
          <Chip key={d} label={`Within ${d} km`} selected={travelDistanceKm === d} onPress={() => setTravelDistanceKm(d)} />
        ))}
      </View>
    </RegistrationLayout>
  );
}
