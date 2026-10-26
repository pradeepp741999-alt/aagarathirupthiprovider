import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Chip, Input } from '../../components';
import { districts, districtAreas, salemAreas, distanceOptions } from '../../data/districts';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegCoverageArea'>;

export function RegCoverageAreaScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const setServiceAreas = useProviderStore((s) => s.setServiceAreas);
  const goToStep = useProviderStore((s) => s.goToStep);

  const initialDistricts = provider.district
    ? provider.district.includes(',')
      ? provider.district.split(',').map((s) => s.trim())
      : [provider.district]
    : ['salem'];

  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialDistricts);
  const [areas, setAreas] = useState<string[]>(
    provider.areas.length ? provider.areas : salemAreas.slice(0, 4)
  );
  const [customArea, setCustomArea] = useState('');
  const [travelDistanceKm, setTravelDistanceKm] = useState(
    provider.serviceAreas[0]?.travelDistanceKm ?? 25
  );

  const allDistrictIds = districts.map((d) => d.id);
  const isAllSelected = allDistrictIds.every((id) => selectedDistricts.includes(id));

  // Toggle "All" option
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedDistricts(['salem']);
    } else {
      setSelectedDistricts([...allDistrictIds]);
    }
  };

  // Toggle individual district
  const toggleDistrict = (id: string) => {
    if (selectedDistricts.includes(id)) {
      if (selectedDistricts.length === 1) return; // Keep at least one
      setSelectedDistricts((prev) => prev.filter((d) => d !== id));
    } else {
      setSelectedDistricts((prev) => [...prev, id]);
    }
  };

  // Areas available from chosen districts
  const areaOptions = Array.from(
    new Set(selectedDistricts.flatMap((d) => districtAreas[d] || []))
  );

  const toggleArea = (a: string) => {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const selectAllAreas = () => {
    setAreas((prev) => Array.from(new Set([...prev, ...areaOptions])));
  };

  const addCustomArea = () => {
    const trimmed = customArea.trim();
    if (trimmed && !areas.includes(trimmed)) {
      setAreas((prev) => [...prev, trimmed]);
      setCustomArea('');
    }
  };

  const handleContinue = () => {
    const primaryDistrict = selectedDistricts[0] || 'salem';
    updateProvider({
      district: isAllSelected ? 'All Districts' : selectedDistricts.join(', '),
      areas,
    });
    setServiceAreas(
      selectedDistricts.map((d) => ({
        district: d,
        areas: areas.filter(
          (a) => (districtAreas[d] || []).includes(a) || d === primaryDistrict
        ),
        travelDistanceKm,
      }))
    );
    goToStep(5);
    navigation.navigate('RegDocuments');
  };

  return (
    <RegistrationLayout
      stepIndex={4}
      title="Where do you provide service?"
      subtitle="Select the districts and areas where customers can find and book you."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={selectedDistricts.length === 0 || areas.length === 0}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]}>Districts ({selectedDistricts.length} selected)</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
        <Chip
          label="All Districts"
          icon={isAllSelected ? 'checkbox' : 'square-outline'}
          selected={isAllSelected}
          onPress={toggleAll}
          tone="info"
        />
        {districts.map((d) => {
          const isSelected = selectedDistricts.includes(d.id);
          return (
            <Chip
              key={d.id}
              label={d.name}
              selected={isSelected}
              onPress={() => toggleDistrict(d.id)}
            />
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]}>Areas you serve ({areas.length})</Text>
        {areaOptions.length > 0 && (
          <Pressable onPress={selectAllAreas} hitSlop={6}>
            <Text style={[type.caption, { color: colors.primary }]}>Select all in districts</Text>
          </Pressable>
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
        {areaOptions.map((a) => (
          <Chip key={a} label={a} selected={areas.includes(a)} onPress={() => toggleArea(a)} />
        ))}
        {areas
          .filter((a) => !areaOptions.includes(a))
          .map((a) => (
            <Chip key={a} label={a} selected onPress={() => toggleArea(a)} tone="info" />
          ))}
      </View>
      <Input
        placeholder="Add another area and press Enter/Done"
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
          <Chip
            key={d}
            label={`Within ${d} km`}
            selected={travelDistanceKm === d}
            onPress={() => setTravelDistanceKm(d)}
          />
        ))}
      </View>
    </RegistrationLayout>
  );
}
