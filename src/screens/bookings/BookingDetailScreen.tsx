import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { BookingStatusBadge, Button, Card, ScreenHeader } from '../../components';
import { useBookingStore } from '../../store/useBookingStore';
import { categories } from '../../data/categories';
import { formatCurrency } from '../../utils/currency';
import { formatLongDate } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetail'>;

export function BookingDetailScreen({ navigation, route }: Props) {
  const booking = useBookingStore((s) => s.bookings.find((b) => b.id === route.params.bookingId));
  const updateStatus = useBookingStore((s) => s.updateStatus);

  if (!booking) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Booking" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const category = categories.find((c) => c.id === booking.category);
  const call = () => Linking.openURL(`tel:${booking.customerMobile}`).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Booking Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={[styles.iconWrap, { backgroundColor: (category?.color ?? colors.primary) + '18' }]}>
              <Ionicons name={(category?.icon as any) ?? 'calendar'} size={22} color={category?.color ?? colors.primary} />
            </View>
            <BookingStatusBadge status={booking.status} />
          </View>
          <Text style={[type.h2, { color: colors.ink, marginTop: spacing.md }]}>{booking.eventType}</Text>
          <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>Booking #{booking.id.toUpperCase()}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Customer</Text>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{booking.customerName}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>+91 {booking.customerMobile}</Text>
            </View>
            <Pressable style={styles.callBtn} onPress={call}>
              <Ionicons name="call" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Event Details</Text>
        <Card>
          <Row icon="calendar-outline" label="Event Date" value={formatLongDate(booking.eventDate)} />
          <Row icon="location-outline" label="Location" value={booking.location} />
          <Row icon="people-outline" label="Guests" value={`${booking.guestCount} people`} />
          <Row icon="cash-outline" label="Amount" value={formatCurrency(booking.amount)} last />
        </Card>

        {booking.status === 'confirmed' && (
          <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
            <Button label="Mark as In Progress" variant="outline" fullWidth icon="time-outline" onPress={() => updateStatus(booking.id, 'in_progress')} />
            <Button label="Mark as Completed" fullWidth icon="checkmark-circle" onPress={() => updateStatus(booking.id, 'completed')} />
            <Button label="Cancel Booking" variant="danger" fullWidth onPress={() => updateStatus(booking.id, 'cancelled')} />
          </View>
        )}
        {booking.status === 'in_progress' && (
          <Button label="Mark as Completed" fullWidth icon="checkmark-circle" style={{ marginTop: spacing.xl }} onPress={() => updateStatus(booking.id, 'completed')} />
        )}
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, value, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={16} color={colors.muted} style={{ width: 22 }} />
      <Text style={[type.caption, { color: colors.muted, flex: 1 }]}>{label}</Text>
      <Text style={[type.bodyMedium, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  callBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
