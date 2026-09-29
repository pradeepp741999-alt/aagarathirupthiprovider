import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Button, Chip, Input, ScreenHeader, Stepper } from '../../components';
import { categories } from '../../data/categories';
import { districts, salemAreas, distanceOptions } from '../../data/districts';
import { PricingModel, ServiceCategoryId } from '../../data/types';
import { useProviderStore } from '../../store/useProviderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessSettings'>;

const vegOptions: { id: 'veg' | 'non_veg' | 'both'; label: string }[] = [
  { id: 'veg', label: 'Vegetarian only' },
  { id: 'non_veg', label: 'Non-vegetarian only' },
  { id: 'both', label: 'Both' },
];

const pricingModels: { id: PricingModel; label: string }[] = [
  { id: 'per_person', label: 'Per Person' },
  { id: 'per_dish', label: 'Per Dish' },
  { id: 'package', label: 'Package' },
  { id: 'custom', label: 'Custom Quote' },
];

export function BusinessSettingsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const setServiceAreas = useProviderStore((s) => s.setServiceAreas);

  const [secondary, setSecondary] = useState<ServiceCategoryId[]>(provider.secondaryCategories);
  const [district, setDistrict] = useState(provider.district);
  const [areas, setAreas] = useState<string[]>(provider.areas);
  const [travelDistanceKm, setTravelDistanceKm] = useState(provider.serviceAreas[0]?.travelDistanceKm ?? 25);
  const [minCapacity, setMinCapacity] = useState(provider.minCapacity);
  const [maxCapacity, setMaxCapacity] = useState(provider.maxCapacity);
  const [veg, setVeg] = useState(provider.veg);
  const [pricingModel, setPricingModel] = useState(provider.pricingModel);
  const [startingPrice, setStartingPrice] = useState(String(provider.startingPrice));

  const areaOptions = district === 'salem' ? salemAreas : [];
  const toggleArea = (a: string) => setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const toggleSecondary = (id: ServiceCategoryId) => {
    if (id === provider.category) return;
    setSecondary((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleSave = () => {
    updateProvider({ secondaryCategories: secondary, district, areas, minCapacity, maxCapacity, veg, pricingModel, startingPrice: Number(startingPrice) || 0 });
    setServiceAreas([{ district, areas, travelDistanceKm }]);
    Alert.alert('Saved', 'Business settings updated.');
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Coverage & Categories" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Text style={styles.label}>Primary Category</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <Chip label={categories.find((c) => c.id === provider.category)?.name ?? provider.category} selected tone="default" />
        </View>

        <Text style={styles.label}>Additional Categories</Text>
        <View style={styles.wrapRow}>
          {categories.filter((c) => c.id !== provider.category).map((c) => (
            <Chip key={c.id} label={c.name} icon={c.icon as any} selected={secondary.includes(c.id)} onPress={() => toggleSecondary(c.id)} />
          ))}
        </View>

        <Text style={styles.label}>District</Text>
        <View style={styles.wrapRow}>
          {districts.map((d) => (
            <Chip key={d.id} label={d.name} selected={district === d.id} onPress={() => setDistrict(d.id)} />
          ))}
        </View>

        <Text style={styles.label}>Areas Served</Text>
        <View style={styles.wrapRow}>
          {areaOptions.map((a) => (
            <Chip key={a} label={a} selected={areas.includes(a)} onPress={() => toggleArea(a)} />
          ))}
          {areas.filter((a) => !areaOptions.includes(a)).map((a) => (
            <Chip key={a} label={a} selected onPress={() => toggleArea(a)} tone="info" />
          ))}
        </View>

        <Text style={styles.label}>Travel Distance</Text>
        <View style={styles.wrapRow}>
          {distanceOptions.map((d) => (
            <Chip key={d} label={`Within ${d} km`} selected={travelDistanceKm === d} onPress={() => setTravelDistanceKm(d)} />
          ))}
        </View>

        <Text style={styles.label}>Guest Capacity</Text>
        <View style={{ marginBottom: spacing.md }}>
          <Text style={[type.caption, { color: colors.muted, marginBottom: spacing.sm }]}>Minimum</Text>
          <Stepper value={minCapacity} onChange={setMinCapacity} step={10} min={10} max={maxCapacity} suffix="guests" />
        </View>
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[type.caption, { color: colors.muted, marginBottom: spacing.sm }]}>Maximum</Text>
          <Stepper value={maxCapacity} onChange={setMaxCapacity} step={50} min={minCapacity} max={5000} suffix="guests" />
        </View>

        {provider.category === 'catering' && (
          <>
            <Text style={styles.label}>Food Type</Text>
            <View style={styles.wrapRow}>
              {vegOptions.map((v) => (
                <Chip key={v.id} label={v.label} selected={veg === v.id} onPress={() => setVeg(v.id)} />
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>Pricing Model</Text>
        <View style={styles.wrapRow}>
          {pricingModels.map((m) => (
            <Chip key={m.id} label={m.label} selected={pricingModel === m.id} onPress={() => setPricingModel(m.id)} />
          ))}
        </View>
        <Input label="Starting Price (₹)" icon="cash-outline" keyboardType="number-pad" value={startingPrice} onChangeText={(v) => setStartingPrice(v.replace(/\D/g, ''))} />

        <Button label="Save Changes" fullWidth size="lg" onPress={handleSave} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.bodyMedium, color: colors.ink, marginBottom: spacing.sm },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
});
