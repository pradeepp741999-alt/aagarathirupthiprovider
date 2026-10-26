import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { Button, Chip, Input, ScreenHeader } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ComboEditor'>;

const sampleComboImages = [
  { label: 'Feast', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Buffet', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Traditional', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sweets Box', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
];

export function ComboEditorScreen({ navigation, route }: Props) {
  const comboId = route.params?.comboId;
  const combo = useServiceStore((s) => s.combos.find((c) => c.id === comboId));
  const addCombo = useServiceStore((s) => s.addCombo);
  const updateCombo = useServiceStore((s) => s.updateCombo);
  const removeCombo = useServiceStore((s) => s.removeCombo);

  const [name, setName] = useState(combo?.name ?? '');
  const [description, setDescription] = useState(combo?.description ?? '');
  const [items, setItems] = useState<string[]>(combo?.includedItems ?? ['Main Dish', 'Side Dish', 'Dessert']);
  const [newItem, setNewItem] = useState('');
  const [price, setPrice] = useState(combo ? String(combo.price) : '');
  const [originalPrice, setOriginalPrice] = useState(combo?.originalPrice ? String(combo.originalPrice) : '');
  const [image, setImage] = useState(combo?.image ?? sampleComboImages[0].url);
  const [validUntil, setValidUntil] = useState(combo?.validUntil ?? '31 Dec 2026');
  const [active, setActive] = useState(combo?.active ?? true);
  const [error, setError] = useState('');

  const addItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
      setNewItem('');
    }
  };

  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  };

  const handleSave = () => {
    if (!name.trim() || !price) {
      setError('Combo name and price are required');
      return;
    }
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      includedItems: items,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: image.trim() || undefined,
      validUntil: validUntil.trim() || 'Ongoing',
      active,
    };
    if (combo) updateCombo(combo.id, payload);
    else addCombo(payload);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (combo) removeCombo(combo.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={combo ? 'Edit Special Combo' : 'New Special Combo'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Input
          label="Combo Name"
          icon="sparkles-outline"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Grand Wedding Dinner Combo"
          error={error}
        />
        <Input
          label="Description (optional)"
          icon="document-text-outline"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Complete banquet package with live dessert counter"
          multiline
        />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Combo Offer Price (₹)"
              icon="cash-outline"
              keyboardType="number-pad"
              value={price}
              onChangeText={(v) => setPrice(v.replace(/\D/g, ''))}
              placeholder="e.g. 350"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Original Price (₹)"
              icon="pricetag-outline"
              keyboardType="number-pad"
              value={originalPrice}
              onChangeText={(v) => setOriginalPrice(v.replace(/\D/g, ''))}
              placeholder="e.g. 420"
            />
          </View>
        </View>

        <Input
          label="Validity / Expiry"
          icon="calendar-outline"
          value={validUntil}
          onChangeText={setValidUntil}
          placeholder="e.g. 31 Dec 2026 or Valid for next 30 days"
        />

        <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
          Included Items ({items.length})
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
          {items.map((it) => (
            <Chip key={it} label={it} icon="checkmark-circle" selected onPress={() => removeItem(it)} tone="success" />
          ))}
        </View>
        <Input
          placeholder="Type dish/item name and press Enter"
          icon="add-outline"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={addItem}
          returnKeyType="done"
          containerStyle={{ marginBottom: spacing.lg }}
        />

        <Input
          label="Combo Image URL"
          icon="image-outline"
          value={image}
          onChangeText={setImage}
          placeholder="https://..."
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
          {sampleComboImages.map((s) => (
            <Chip
              key={s.label}
              label={s.label}
              icon="camera-outline"
              selected={image === s.url}
              onPress={() => setImage(s.url)}
            />
          ))}
        </View>

        <View style={styles.toggleRow}>
          <Text style={[type.body, { color: colors.ink, flex: 1 }]}>Active (visible to customers)</Text>
          <Switch value={active} onValueChange={setActive} trackColor={{ true: colors.primary, false: colors.border }} />
        </View>

        <Button
          label={combo ? 'Save Combo' : 'Create Special Combo'}
          fullWidth
          size="lg"
          onPress={handleSave}
          style={{ marginTop: spacing.xl }}
        />
        {combo && (
          <Button
            label="Delete Combo"
            variant="danger"
            fullWidth
            onPress={handleDelete}
            style={{ marginTop: spacing.sm }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
});
