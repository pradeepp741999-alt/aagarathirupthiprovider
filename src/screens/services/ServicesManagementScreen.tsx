import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { EmptyState, ScreenHeader, SegmentedTabs } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';
import { Dish, MenuPackage } from '../../data/types';
import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'ServicesManagement'>;

export function ServicesManagementScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<'dishes' | 'packages'>(route.params?.initialTab ?? 'dishes');
  const dishes = useServiceStore((s) => s.dishes);
  const packages = useServiceStore((s) => s.packages);
  const updateDish = useServiceStore((s) => s.updateDish);
  const updatePackage = useServiceStore((s) => s.updatePackage);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Manage Services"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => navigation.navigate(tab === 'dishes' ? 'DishEditor' : 'PackageEditor', {})}
            hitSlop={8}
          >
            <Ionicons name="add-circle" size={26} color={colors.primary} />
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
        <SegmentedTabs
          options={[
            { key: 'dishes', label: 'Dishes', count: dishes.length },
            { key: 'packages', label: 'Packages', count: packages.length },
          ]}
          value={tab}
          onChange={(k) => setTab(k as 'dishes' | 'packages')}
        />
      </View>

      {tab === 'dishes' ? (
        <FlatList
          data={dishes}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <DishRow dish={item} onPress={() => navigation.navigate('DishEditor', { dishId: item.id })} onToggle={(v) => updateDish(item.id, { active: v })} />
          )}
          ListEmptyComponent={<EmptyState icon="restaurant-outline" title="No dishes yet" message="Add your menu dishes so customers can select them." />}
        />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <PackageRow pkg={item} onPress={() => navigation.navigate('PackageEditor', { packageId: item.id })} onToggle={(v) => updatePackage(item.id, { active: v })} />
          )}
          ListEmptyComponent={<EmptyState icon="cube-outline" title="No packages yet" message="Bundle dishes into packages for easy booking." />}
        />
      )}
    </View>
  );
}

function DishRow({ dish, onPress, onToggle }: { dish: Dish; onPress: () => void; onToggle: (v: boolean) => void }) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={[styles.vegDot, { borderColor: dish.veg ? colors.success : colors.danger }]}>
        <View style={[styles.vegDotInner, { backgroundColor: dish.veg ? colors.success : colors.danger }]} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
          {dish.name} {dish.popular && '⭐'}
        </Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>{dish.category} · {formatCurrency(dish.price)}</Text>
      </View>
      <Switch value={dish.active} onValueChange={onToggle} trackColor={{ true: colors.primary, false: colors.border }} />
    </Pressable>
  );
}

function PackageRow({ pkg, onPress, onToggle }: { pkg: MenuPackage; onPress: () => void; onToggle: (v: boolean) => void }) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: colors.secondarySoft }]}>
        <Ionicons name="cube" size={18} color={colors.secondaryDark} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{pkg.name}</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>
          {formatCurrency(pkg.pricePerPerson)}/person · Min {pkg.minGuests} guests
        </Text>
      </View>
      <Switch value={pkg.active} onValueChange={onToggle} trackColor={{ true: colors.primary, false: colors.border }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md,
  },
  vegDot: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  vegDotInner: { width: 9, height: 9, borderRadius: 5 },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
