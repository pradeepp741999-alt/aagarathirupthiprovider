import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { Chip, EmptyState, ScreenHeader, SegmentedTabs } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';
import { Dish, MenuPackage, SpecialCombo } from '../../data/types';
import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'ServicesManagement'>;

export function ServicesManagementScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<'dishes' | 'packages' | 'combos'>(
    (route.params?.initialTab as any) ?? 'dishes'
  );
  const dishes = useServiceStore((s) => s.dishes);
  const packages = useServiceStore((s) => s.packages);
  const combos = useServiceStore((s) => s.combos);
  const fetchCatalog = useServiceStore((s) => s.fetchCatalog);
  const updateDish = useServiceStore((s) => s.updateDish);
  const updatePackage = useServiceStore((s) => s.updatePackage);
  const updateCombo = useServiceStore((s) => s.updateCombo);

  React.useEffect(() => {
    fetchCatalog().catch(() => {});
  }, []);

  const handleAdd = () => {
    if (tab === 'dishes') navigation.navigate('DishEditor', {});
    else if (tab === 'packages') navigation.navigate('PackageEditor', {});
    else navigation.navigate('ComboEditor', {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Manage Services"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={handleAdd} hitSlop={8}>
            <Ionicons name="add-circle" size={26} color={colors.primary} />
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
        <SegmentedTabs
          options={[
            { key: 'dishes', label: 'Dishes', count: dishes.length },
            { key: 'packages', label: 'Packages', count: packages.length },
            { key: 'combos', label: 'Special Combos', count: combos.length },
          ]}
          value={tab}
          onChange={(k) => setTab(k as 'dishes' | 'packages' | 'combos')}
        />
      </View>

      {tab === 'dishes' && (
        <FlatList
          data={dishes}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <DishRow
              dish={item}
              onPress={() => navigation.navigate('DishEditor', { dishId: item.id })}
              onToggle={(v) => updateDish(item.id, { active: v })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No dishes yet"
              message="Add your menu dishes so customers can select and compare them."
            />
          }
        />
      )}

      {tab === 'packages' && (
        <FlatList
          data={packages}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <PackageRow
              pkg={item}
              onPress={() => navigation.navigate('PackageEditor', { packageId: item.id })}
              onToggle={(v) => updatePackage(item.id, { active: v })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="No packages yet"
              message="Bundle dishes into packages for easy booking."
            />
          }
        />
      )}

      {tab === 'combos' && (
        <FlatList
          data={combos}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
          renderItem={({ item }) => (
            <ComboCard
              combo={item}
              onPress={() => navigation.navigate('ComboEditor', { comboId: item.id })}
              onToggle={(v) => updateCombo(item.id, { active: v })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="sparkles-outline"
              title="No special combos yet"
              message="Create promotional combos with included dishes, special pricing and validity."
            />
          }
        />
      )}
    </View>
  );
}

function DishRow({
  dish,
  onPress,
  onToggle,
}: {
  dish: Dish;
  onPress: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      {dish.photo ? (
        <Image source={{ uri: dish.photo }} style={styles.dishThumbnail} />
      ) : (
        <View style={[styles.vegDot, { borderColor: dish.veg ? colors.success : colors.danger }]}>
          <View
            style={[
              styles.vegDotInner,
              { backgroundColor: dish.veg ? colors.success : colors.danger },
            ]}
          />
        </View>
      )}
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
          {dish.name} {dish.popular && '⭐'}
        </Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>
          {dish.category} · {formatCurrency(dish.price)}
        </Text>
      </View>
      <Switch
        value={dish.active}
        onValueChange={onToggle}
        trackColor={{ true: colors.primary, false: colors.border }}
      />
    </Pressable>
  );
}

function PackageRow({
  pkg,
  onPress,
  onToggle,
}: {
  pkg: MenuPackage;
  onPress: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: colors.secondarySoft }]}>
        <Ionicons name="cube" size={18} color={colors.secondaryDark} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>
          {pkg.name}
        </Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>
          {formatCurrency(pkg.pricePerPerson)}/person · Min {pkg.minGuests} guests
        </Text>
      </View>
      <Switch
        value={pkg.active}
        onValueChange={onToggle}
        trackColor={{ true: colors.primary, false: colors.border }}
      />
    </Pressable>
  );
}

function ComboCard({
  combo,
  onPress,
  onToggle,
}: {
  combo: SpecialCombo;
  onPress: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Pressable style={[styles.comboCard, shadow.sm]} onPress={onPress}>
      {combo.image && <Image source={{ uri: combo.image }} style={styles.comboBanner} />}
      <View style={{ padding: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Text style={[type.h3, { color: colors.ink }]} numberOfLines={1}>
              {combo.name}
            </Text>
            {combo.description ? (
              <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]} numberOfLines={2}>
                {combo.description}
              </Text>
            ) : null}
          </View>
          <Switch
            value={combo.active}
            onValueChange={onToggle}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: spacing.sm }}>
          {combo.includedItems.map((item, idx) => (
            <View key={idx} style={styles.comboItemPill}>
              <Text style={[type.tiny, { color: colors.body }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.comboFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={[type.h3, { color: colors.primaryDark }]}>{formatCurrency(combo.price)}</Text>
            {combo.originalPrice && (
              <Text style={[type.caption, { color: colors.muted, textDecorationLine: 'line-through' }]}>
                {formatCurrency(combo.originalPrice)}
              </Text>
            )}
          </View>
          <View style={styles.validityBadge}>
            <Ionicons name="time-outline" size={12} color={colors.gold} />
            <Text style={[type.tiny, { color: colors.body, marginLeft: 4 }]}>Valid: {combo.validUntil}</Text>
          </View>
        </View>
      </View>
    </Pressable>
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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dishThumbnail: { width: 44, height: 44, borderRadius: radius.md },
  vegDot: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDotInner: { width: 9, height: 9, borderRadius: 5 },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  comboCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  comboBanner: { width: '100%', height: 110, resizeMode: 'cover' },
  comboItemPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  comboFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.xs,
  },
  validityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
