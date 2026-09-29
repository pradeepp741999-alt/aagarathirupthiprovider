import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Avatar, EmptyState, EnquiryStatusBadge, SearchBar, SegmentedTabs } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { Enquiry, EnquiryStatus } from '../../data/types';
import { formatCurrency } from '../../utils/currency';
import { formatShortDate, timeAgo } from '../../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Enquiries'>,
  NativeStackScreenProps<RootStackParamList>
>;

const filters: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'responded', label: 'Quoted' },
  { key: 'confirmation_pending', label: 'Awaiting Confirm' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled / Rejected' },
];

export function EnquiriesListScreen({ navigation }: Props) {
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: enquiries.length };
    enquiries.forEach((e) => {
      const key = ['cancelled', 'rejected'].includes(e.status) ? 'cancelled' : e.status;
      c[key] = (c[key] ?? 0) + 1;
    });
    return c;
  }, [enquiries]);

  const filtered = useMemo(() => {
    let list = enquiries;
    if (filter !== 'all') {
      list = list.filter((e) => (filter === 'cancelled' ? ['cancelled', 'rejected'].includes(e.status) : e.status === filter));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.customerName.toLowerCase().includes(q) || e.eventType.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [enquiries, filter, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={styles.header}>
        <Text style={[type.h1, { color: colors.ink }]}>Enquiries</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>
          {counts.all} total · {counts.new ?? 0} new leads
        </Text>
        <View style={{ marginTop: spacing.lg }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search by customer or event type" />
        </View>
        <View style={{ marginTop: spacing.md }}>
          <SegmentedTabs
            options={filters.map((f) => ({ ...f, count: counts[f.key] ?? 0 }))}
            value={filter}
            onChange={setFilter}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.md }}
        renderItem={({ item }) => <EnquiryRow enquiry={item} onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: item.id })} />}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No enquiries here" message="New customer enquiries for your services will show up here." />
        }
      />
    </SafeAreaView>
  );
}

function EnquiryRow({ enquiry, onPress }: { enquiry: Enquiry; onPress: () => void }) {
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar name={enquiry.customerName} color={enquiry.avatarColor} size={42} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{enquiry.customerName}</Text>
          <Text style={[type.caption, { color: colors.muted, marginTop: 1 }]} numberOfLines={1}>
            {enquiry.eventType} · {enquiry.guestCount} guests
          </Text>
        </View>
        <EnquiryStatusBadge status={enquiry.status} compact />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={colors.muted} />
          <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>{formatShortDate(enquiry.eventDate)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={colors.muted} />
          <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]} numberOfLines={1}>{enquiry.location}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Text style={[type.caption, { color: colors.primaryDark }]}>{formatCurrency(enquiry.quote ?? enquiry.estimatedTotal)}</Text>
      </View>
      <Text style={[type.tiny, { color: colors.faint, marginTop: 6 }]}>{timeAgo(enquiry.createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
});
