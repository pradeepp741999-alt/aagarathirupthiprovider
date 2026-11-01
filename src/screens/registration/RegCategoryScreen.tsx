import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { categories } from '../../data/categories';
import { ServiceCategoryId } from '../../data/types';
import { Chip } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegCategory'>;

export function RegCategoryScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [category, setCategory] = useState<ServiceCategoryId | ''>(provider.category || '');
  const [secondary, setSecondary] = useState<ServiceCategoryId[]>(
    (provider.secondaryCategories || []).filter((c) => c !== provider.category)
  );
  const [error, setError] = useState('');

  const handleSelectCategory = (id: ServiceCategoryId) => {
    setCategory(id);
    setError('');
    // Ensure primary category is excluded from additional services
    setSecondary((prev) => prev.filter((c) => c !== id));
  };

  const toggleSecondary = (id: ServiceCategoryId) => {
    if (id === category) return;
    setSecondary((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleContinue = () => {
    if (!category) {
      setError('Please select your primary category to continue.');
      return;
    }
    updateProvider({ category, secondaryCategories: secondary });
    goToStep(2);
    navigation.navigate('RegServiceDetails');
  };

  return (
    <RegistrationLayout
      stepIndex={1}
      title="What service do you provide?"
      subtitle="Choose your primary category. You can add more services later."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {categories.map((cat) => {
        const active = category === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => handleSelectCategory(cat.id)}
            style={[styles.card, shadow.sm, active && { borderColor: cat.color, borderWidth: 2 }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: cat.color + '18' }]}>
              <Ionicons name={cat.icon as any} size={22} color={cat.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { color: colors.ink }]}>{cat.name}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>{cat.tagline}</Text>
            </View>
            <Ionicons
              name={active ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={active ? cat.color : colors.faint}
            />
          </Pressable>
        );
      })}

      {error ? (
        <Text style={[type.caption, { color: colors.danger, marginTop: spacing.xs, marginBottom: spacing.sm }]}>
          {error}
        </Text>
      ) : null}

      {/* Render additional services only once, excluding currently selected primary category */}
      {category ? (
        <View style={{ marginTop: spacing.xl }}>
          <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>
            Also offer additional services? (optional)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {categories
              .filter((c) => c.id !== category)
              .map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  icon={c.icon as any}
                  selected={secondary.includes(c.id)}
                  onPress={() => toggleSecondary(c.id)}
                />
              ))}
          </View>
        </View>
      ) : null}
    </RegistrationLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconWrap: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
