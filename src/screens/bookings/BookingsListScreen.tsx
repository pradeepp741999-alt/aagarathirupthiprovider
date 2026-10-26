import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { BookingStatusBadge, EmptyState, SegmentedTabs } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useBookingStore } from '../../store/useBookingStore';
import { Booking } from '../../data/types';
import { formatCurrency } from '../../utils/currency';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Bookings'>,
  NativeStackScreenProps<RootStackParamList>
>;

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function BookingsListScreen({ navigation }: Props) {
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const [tab, setTab] = useState('upcoming');

  React.useEffect(() => {
    fetchBookings().catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const now = new Date(new Date().toDateString());
    let list: Booking[];
    if (tab === 'completed') list = bookings.filter((b) => b.status === 'completed');
    else if (tab === 'cancelled') list = bookings.filter((b) => b.status === 'cancelled');
    else list = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
    return [...list].sort((a, b) => {
      const diff = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      return tab === 'upcoming' ? diff : -diff;
    });
  }, [bookings, tab]);

  const counts = {
    upcoming: bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[type.h1, { color: colors.ink }]}>Bookings</Text>
          <Pressable style={styles.calendarBtn} onPress={() => navigation.navigate('AvailabilityCalendar')}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <SegmentedTabs options={tabs.map((t) => ({ ...t, count: counts[t.key as keyof typeof counts] }))} value={tab} onChange={setTab} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.md }}
        renderItem={({ item }) => <BookingRow booking={item} onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })} />}
        ListEmptyComponent={
          <EmptyState icon="calendar-outline" title="No bookings here" message="Confirmed bookings from your enquiries will appear here." />
        }
      />
    </SafeAreaView>
  );
}

function BookingRow({ booking, onPress }: { booking: Booking; onPress: () => void }) {
  const eventDate = new Date(booking.eventDate);
  return (
    <Pressable style={[styles.card, shadow.sm]} onPress={onPress}>
      <View style={styles.dateBox}>
        <Text style={[type.h3, { color: colors.primaryDark }]}>{eventDate.getDate()}</Text>
        <Text style={[type.tiny, { color: colors.primaryDark }]}>{eventDate.toLocaleDateString('en-IN', { month: 'short' })}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{booking.customerName} · {booking.eventType}</Text>
        <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]} numberOfLines={1}>{booking.guestCount} guests · {booking.location}</Text>
        <Text style={[type.caption, { color: colors.primaryDark, marginTop: 2 }]}>{formatCurrency(booking.amount)}</Text>
      </View>
      <BookingStatusBadge status={booking.status} compact />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarBtn: {
    width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md,
  },
  dateBox: {
    width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
});
