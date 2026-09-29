import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { BookingStatusBadge, Card, EmptyState, ScreenHeader, SummaryCard } from '../../components';
import { useBookingStore } from '../../store/useBookingStore';
import { useProviderStore } from '../../store/useProviderStore';
import { formatCurrency } from '../../utils/currency';
import { formatShortDate } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Earnings'>;

export function EarningsScreen({ navigation }: Props) {
  const bookings = useBookingStore((s) => s.bookings);
  const bankDetails = useProviderStore((s) => s.provider.bankDetails);

  const completed = bookings.filter((b) => b.status === 'completed');
  const pending = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const totalEarned = completed.reduce((sum, b) => sum + b.amount, 0);
  const pendingPayout = pending.reduce((sum, b) => sum + b.amount, 0);

  const transactions = [...bookings].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Earnings & Payouts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <SummaryCard icon="wallet" label="Total Earned" value={formatCurrency(totalEarned)} meta={`${completed.length} completed bookings`} />

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <Card style={{ flex: 1 }}>
            <Ionicons name="hourglass-outline" size={16} color={colors.warning} />
            <Text style={[type.h3, { color: colors.ink, marginTop: spacing.sm }]}>{formatCurrency(pendingPayout)}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Pending Settlement</Text>
          </Card>
          <Card style={{ flex: 1 }}>
            <Ionicons name="card-outline" size={16} color={colors.primary} />
            <Text style={[type.h3, { color: colors.ink, marginTop: spacing.sm }]} numberOfLines={1}>
              {bankDetails.accountNumber ? '••••' + bankDetails.accountNumber.slice(-4) : '—'}
            </Text>
            <Text style={[type.caption, { color: colors.muted }]}>Payout Account</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length === 0 ? (
          <EmptyState icon="wallet-outline" title="No transactions yet" message="Earnings from completed bookings will show up here." />
        ) : (
          <Card padded={false}>
            {transactions.map((t, i) => (
              <View key={t.id} style={[styles.row, i < transactions.length - 1 && styles.rowBorder]}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{t.customerName} · {t.eventType}</Text>
                  <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{formatShortDate(t.eventDate)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[type.bodyMedium, { color: colors.ink }]}>{formatCurrency(t.amount)}</Text>
                  <BookingStatusBadge status={t.status} compact />
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
