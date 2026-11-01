import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Chip, Input } from '../../components';
import { districts, districtAreas, distanceOptions } from '../../data/districts';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegCoverageArea'>;

export function RegCoverageAreaScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const setServiceAreas = useProviderStore((s) => s.setServiceAreas);
  const goToStep = useProviderStore((s) => s.goToStep);

  // Parse existing districts from provider store without pre-selecting Salem or anything for new users
  const initialDistricts: string[] = provider.district
    ? provider.district === 'All Districts'
      ? districts.map((d) => d.id)
      : provider.district.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialDistricts);
  const [areas, setAreas] = useState<string[]>(provider.areas || []);
  const [customArea, setCustomArea] = useState('');
  const [travelDistanceKm, setTravelDistanceKm] = useState(
    provider.serviceAreas[0]?.travelDistanceKm ?? 25
  );
  const [error, setError] = useState('');

  const allDistrictIds = districts.map((d) => d.id);
  const isAllDistrictsSelected =
    allDistrictIds.length > 0 && allDistrictIds.every((id) => selectedDistricts.includes(id));

  // Toggle "All Districts"
  const toggleAllDistricts = () => {
    setError('');
    if (isAllDistrictsSelected) {
      // Unselect all districts and clear areas
      setSelectedDistricts([]);
      setAreas([]);
    } else {
      // Select all 38 districts
      setSelectedDistricts([...allDistrictIds]);
    }
  };

  // Toggle individual district
  const toggleDistrict = (id: string) => {
    setError('');
    if (selectedDistricts.includes(id)) {
      const nextDistricts = selectedDistricts.filter((d) => d !== id);
      setSelectedDistricts(nextDistricts);

      // Clean up areas that belonged solely to this unselected district
      const remainingAreas = new Set(nextDistricts.flatMap((d) => districtAreas[d] || []));
      setAreas((prev) => prev.filter((a) => remainingAreas.has(a)));
    } else {
      setSelectedDistricts((prev) => [...prev, id]);
    }
  };

  // Available area options based on currently selected districts
  const areaOptions = Array.from(
    new Set(selectedDistricts.flatMap((d) => districtAreas[d] || []))
  );

  const areAllAreasSelected =
    areaOptions.length > 0 && areaOptions.every((a) => areas.includes(a));

  // Toggle "Select all in districts" / "Unselect all"
  const toggleSelectAllAreas = () => {
    setError('');
    if (areAllAreasSelected) {
      // Unselect all district areas
      setAreas([]);
    } else {
      // Select all district areas
      setAreas(Array.from(new Set([...areas, ...areaOptions])));
    }
  };

  const toggleArea = (a: string) => {
    setError('');
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const addCustomArea = () => {
    const trimmed = customArea.trim();
    if (trimmed && !areas.includes(trimmed)) {
      setAreas((prev) => [...prev, trimmed]);
      setCustomArea('');
      setError('');
    }
  };

  const handleContinue = () => {
    if (selectedDistricts.length === 0) {
      setError('Please select at least one district you serve.');
      return;
    }

    if (areas.length === 0) {
      setError('Please select at least one service area.');
      return;
    }

    const primaryDistrict = selectedDistricts[0] || 'salem';
    updateProvider({
      district: isAllDistrictsSelected ? 'All Districts' : selectedDistricts.join(', '),
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
    >
      {error ? (
        <View style={styles.errorBox}>
          <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]}>
          Districts ({selectedDistricts.length} selected) <Text style={{ color: colors.danger }}>*</Text>
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
        <Chip
          label="All Districts"
          icon={isAllDistrictsSelected ? 'checkbox' : 'square-outline'}
          selected={isAllDistrictsSelected}
          onPress={toggleAllDistricts}
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

      {/* Areas section - only visible after user selects district */}
      {selectedDistricts.length > 0 ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={[type.bodyMedium, { color: colors.ink }]}>
              Areas you serve ({areas.length}) <Text style={{ color: colors.danger }}>*</Text>
            </Text>
            {areaOptions.length > 0 && (
              <Pressable onPress={toggleSelectAllAreas} hitSlop={6}>
                <Text style={[type.caption, { color: colors.primary, fontWeight: '600' }]}>
                  {areAllAreasSelected ? 'Unselect all' : 'Select all in districts'}
                </Text>
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
        </>
      ) : (
        <View style={styles.emptyDistrictBox}>
          <Text style={[type.caption, { color: colors.muted, textAlign: 'center' }]}>
            Please select at least one district above to view and choose your service areas.
          </Text>
        </View>
      )}

      <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
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

const styles = StyleSheet.create({
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyDistrictBox: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.divider,
    borderRadius: 10,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
});
