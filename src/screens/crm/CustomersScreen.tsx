import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Avatar, Chip, CrmStageBadge, EmptyState, SearchBar } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useCrmStore } from '../../store/useCrmStore';
import { CrmCustomer, CrmStage } from '../../data/types';
import { formatCurrency } from '../../utils/currency';
import { timeAgo } from '../../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Crm'>,
  NativeStackScreenProps<RootStackParamList>
>;

const stageFilters: { key: CrmStage | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new_lead', label: 'New Lead' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'booked', label: 'Booked' },
  { key: 'completed', label: 'Completed' },
  { key: 'lost', label: 'Lost' },
];

export function CustomersScreen({ navigation }: Props) {
  const customers = useCrmStore((s) => s.customers);
  const fetchCustomers = useCrmStore((s) => s.fetchCustomers);
  const [stage, setStage] = useState<CrmStage | 'all'>('all');
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    fetchCustomers().catch(() => {});
  }, []);

  const totalLifetimeValue = customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0);

  const filtered = useMemo(() => {
    let list = customers;
    if (stage !== 'all') list = list.filter((c) => c.stage === stage);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.mobile.includes(q));
    }
    return [...list].sort((a, b) => new Date(b.lastContactAt).getTime() - new Date(a.lastContactAt).getTime());
  }, [customers, stage, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={styles.header}>
        <Text style={[type.h1, { color: colors.ink }]}>Customers</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>
          {customers.length} contacts · {formatCurrency(totalLifetimeValue)} lifetime value
        </Text>
        <View style={{ marginTop: spacing.lg }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name or mobile" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          {stageFilters.map((f) => (
            <Chip key={f.key} label={f.label} selected={stage === f.key} onPress={() => setStage(f.key)} />
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.md }}
        renderItem={({ item }) => <CustomerRow customer={item} onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })} />}
        ListEmptyComponent={<EmptyState icon="people-outline" title="No customers found" message="Everyone who enquires or books with you shows up here." />}
      />
    </SafeAreaView>
  );
}

function CustomerRow({ customer, onPress }: { customer: CrmCustomer; onPress: () => void }) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <Avatar name={customer.name} color={customer.avatarColor} size={44} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{customer.name}</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]}>
          {customer.totalEnquiries} enquiries · {customer.totalBookings} bookings
        </Text>
        <Text style={[type.tiny, { color: colors.faint, marginTop: 2 }]}>Last contact {timeAgo(customer.lastContactAt)}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <CrmStageBadge stage={customer.stage} compact />
        {customer.lifetimeValue > 0 && (
          <Text style={[type.caption, { color: colors.primaryDark, marginTop: 6 }]}>{formatCurrency(customer.lifetimeValue)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md,
  },
});
