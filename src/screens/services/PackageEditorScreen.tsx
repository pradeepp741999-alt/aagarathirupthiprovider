import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { Button, Input, ScreenHeader, Stepper } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageEditor'>;

export function PackageEditorScreen({ navigation, route }: Props) {
  const packageId = route.params?.packageId;
  const pkg = useServiceStore((s) => s.packages.find((p) => p.id === packageId));
  const addPackage = useServiceStore((s) => s.addPackage);
  const updatePackage = useServiceStore((s) => s.updatePackage);
  const removePackage = useServiceStore((s) => s.removePackage);

  const [name, setName] = useState(pkg?.name ?? '');
  const [pricePerPerson, setPricePerPerson] = useState(pkg ? String(pkg.pricePerPerson) : '');
  const [minGuests, setMinGuests] = useState(pkg?.minGuests ?? 50);
  const [veg, setVeg] = useState(pkg?.veg ?? true);
  const [active, setActive] = useState(pkg?.active ?? true);
  const [includes, setIncludes] = useState<string[]>(pkg?.includes ?? []);
  const [includeDraft, setIncludeDraft] = useState('');
  const [error, setError] = useState('');

  const addInclude = () => {
    const trimmed = includeDraft.trim();
    if (trimmed) {
      setIncludes((prev) => [...prev, trimmed]);
      setIncludeDraft('');
    }
  };

  const removeInclude = (item: string) => setIncludes((prev) => prev.filter((i) => i !== item));

  const handleSave = () => {
    if (!name.trim() || !pricePerPerson) {
      setError('Package name and price are required');
      return;
    }
    const payload = { name: name.trim(), pricePerPerson: Number(pricePerPerson), minGuests, veg, active, includes };
    if (pkg) updatePackage(pkg.id, payload);
    else addPackage(payload);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (pkg) removePackage(pkg.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={pkg ? 'Edit Package' : 'Add Package'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Input label="Package Name" icon="cube-outline" value={name} onChangeText={setName} placeholder="e.g. Classic Veg Wedding Package" error={error} />
        <Input label="Price per Person (₹)" icon="cash-outline" keyboardType="number-pad" value={pricePerPerson} onChangeText={(v) => setPricePerPerson(v.replace(/\D/g, ''))} />

        <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Minimum Guests</Text>
        <Stepper value={minGuests} onChange={setMinGuests} step={10} min={10} max={2000} suffix="guests" />

        <View style={styles.toggleRow}>
          <Text style={[type.body, { color: colors.ink, flex: 1 }]}>Vegetarian</Text>
          <Switch value={veg} onValueChange={setVeg} trackColor={{ true: colors.primary, false: colors.border }} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[type.body, { color: colors.ink, flex: 1 }]}>Active (visible to customers)</Text>
          <Switch value={active} onValueChange={setActive} trackColor={{ true: colors.primary, false: colors.border }} />
        </View>

        <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm }]}>What's Included</Text>
        {includes.map((item) => (
          <View key={item} style={styles.includeRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[type.body, { color: colors.ink, flex: 1, marginLeft: spacing.sm }]}>{item}</Text>
            <Pressable onPress={() => removeInclude(item)} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.muted} />
            </Pressable>
          </View>
        ))}
        <Input
          placeholder="Add an item, e.g. Serving staff"
          value={includeDraft}
          onChangeText={setIncludeDraft}
          onSubmitEditing={addInclude}
          returnKeyType="done"
          rightElement={
            <Pressable onPress={addInclude} hitSlop={8}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
            </Pressable>
          }
        />

        <Button label={pkg ? 'Save Changes' : 'Add Package'} fullWidth size="lg" onPress={handleSave} style={{ marginTop: spacing.md }} />
        {pkg && <Button label="Delete Package" variant="danger" fullWidth onPress={handleDelete} style={{ marginTop: spacing.sm }} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  includeRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.sm,
  },
});
