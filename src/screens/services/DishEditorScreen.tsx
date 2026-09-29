import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Button, Chip, Input, ScreenHeader } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';
import { dishCategories } from '../../data/categories';

type Props = NativeStackScreenProps<RootStackParamList, 'DishEditor'>;

export function DishEditorScreen({ navigation, route }: Props) {
  const dishId = route.params?.dishId;
  const dish = useServiceStore((s) => s.dishes.find((d) => d.id === dishId));
  const addDish = useServiceStore((s) => s.addDish);
  const updateDish = useServiceStore((s) => s.updateDish);
  const removeDish = useServiceStore((s) => s.removeDish);

  const [name, setName] = useState(dish?.name ?? '');
  const [category, setCategory] = useState(dish?.category ?? dishCategories[0]);
  const [price, setPrice] = useState(dish ? String(dish.price) : '');
  const [veg, setVeg] = useState(dish?.veg ?? true);
  const [popular, setPopular] = useState(dish?.popular ?? false);
  const [active, setActive] = useState(dish?.active ?? true);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !price) {
      setError('Dish name and price are required');
      return;
    }
    const payload = { name: name.trim(), category, price: Number(price), veg, popular, active };
    if (dish) updateDish(dish.id, payload);
    else addDish(payload);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (dish) removeDish(dish.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={dish ? 'Edit Dish' : 'Add Dish'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Input label="Dish Name" icon="restaurant-outline" value={name} onChangeText={setName} placeholder="e.g. Ghee Biriyani" error={error} />
        <Input label="Price (₹)" icon="cash-outline" keyboardType="number-pad" value={price} onChangeText={(v) => setPrice(v.replace(/\D/g, ''))} />

        <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
          {dishCategories.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        <ToggleRow label="Vegetarian" value={veg} onChange={setVeg} />
        <ToggleRow label="Mark as popular" value={popular} onChange={setPopular} />
        <ToggleRow label="Active (visible to customers)" value={active} onChange={setActive} />

        <Button label={dish ? 'Save Changes' : 'Add Dish'} fullWidth size="lg" onPress={handleSave} style={{ marginTop: spacing.xl }} />
        {dish && <Button label="Delete Dish" variant="danger" fullWidth onPress={handleDelete} style={{ marginTop: spacing.sm }} />}
      </ScrollView>
    </View>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={[type.body, { color: colors.ink, flex: 1 }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
});
