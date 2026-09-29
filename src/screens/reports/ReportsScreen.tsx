import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { Avatar, BarChart, Card, DonutChart, ProgressBar, ScreenHeader, StatCard } from '../../components';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useCrmStore } from '../../store/useCrmStore';
import { useReviewStore } from '../../store/useReviewStore';
import { formatCompactCurrency, formatCurrency } from '../../utils/currency';
import { CrmStage } from '../../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Reports'>;

const funnelStages: { key: CrmStage; label: string; color: string }[] = [
  { key: 'new_lead', label: 'New Lead', color: colors.info },
  { key: 'contacted', label: 'Contacted', color: colors.gold },
  { key: 'quoted', label: 'Quoted', color: colors.secondary },
  { key: 'booked', label: 'Booked', color: colors.success },
  { key: 'completed', label: 'Completed', color: colors.primary },
  { key: 'lost', label: 'Lost', color: colors.danger },
];

export function ReportsScreen({ navigation }: Props) {
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const bookings = useBookingStore((s) => s.bookings);
  const customers = useCrmStore((s) => s.customers);
  const reviews = useReviewStore((s) => s.reviews);
  const reviewCount = reviews.length;
  const averageRating = useMemo(() => (reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0), [reviews]);

  // Computed locally (not via a zustand selector) — a selector that returns a
  // freshly-built object every call breaks useSyncExternalStore's snapshot
  // contract and causes an infinite render loop.
  const stageCounts = useMemo(() => {
    const counts: Record<CrmStage, number> = { new_lead: 0, contacted: 0, quoted: 0, booked: 0, completed: 0, lost: 0 };
    customers.forEach((c) => {
      counts[c.stage] += 1;
    });
    return counts;
  }, [customers]);

  const totalRevenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + b.amount, 0);
  const bookedCount = enquiries.filter((e) => ['confirmed', 'confirmation_pending', 'completed'].includes(e.status)).length;
  const conversionRate = enquiries.length ? Math.round((bookedCount / enquiries.length) * 100) : 0;

  const weeklyTrend = useMemo(() => {
    const buckets = Array.from({ length: 6 }, (_, i) => ({ label: `W${i + 1}`, value: 0 }));
    const now = new Date();
    enquiries.forEach((e) => {
      const created = new Date(e.createdAt);
      const weeksAgo = Math.floor((now.getTime() - created.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const idx = 5 - weeksAgo;
      if (idx >= 0 && idx < 6) buckets[idx].value += 1;
    });
    return buckets;
  }, [enquiries]);

  const eventTypeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    enquiries.forEach((e) => {
      counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value], i) => ({ label, value, color: colors.chart[i % colors.chart.length] }));
  }, [enquiries]);

  const topCustomers = useMemo(() => [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 5), [customers]);
  const maxFunnel = Math.max(1, ...funnelStages.map((f) => stageCounts[f.key]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Reports & Analytics" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <View style={styles.statsGrid}>
          <StatCard icon="document-text" label="Total Enquiries" value={enquiries.length} tone="primary" />
          <StatCard icon="trending-up" label="Conversion Rate" value={`${conversionRate}%`} tone="success" />
          <StatCard icon="cash" label="Total Revenue" value={formatCompactCurrency(totalRevenue)} tone="gold" />
          <StatCard icon="star" label="Avg Rating" value={`${averageRating.toFixed(1)} (${reviewCount})`} tone="secondary" />
        </View>

        <Text style={styles.sectionTitle}>Enquiries — Last 6 Weeks</Text>
        <Card>
          <BarChart data={weeklyTrend} color={colors.primary} />
        </Card>

        <Text style={styles.sectionTitle}>Enquiries by Event Type</Text>
        <Card>
          {eventTypeBreakdown.length > 0 ? (
            <DonutChart data={eventTypeBreakdown} centerValue={String(enquiries.length)} centerLabel="Total" />
          ) : (
            <Text style={[type.caption, { color: colors.muted }]}>Not enough data yet.</Text>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Customer Pipeline (CRM)</Text>
        <Card>
          {funnelStages.map((f, i) => (
            <View key={f.key} style={[styles.funnelRow, i < funnelStages.length - 1 && { marginBottom: spacing.md }]}>
              <Text style={[type.caption, { color: colors.body, width: 84 }]}>{f.label}</Text>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <ProgressBar value={stageCounts[f.key] / maxFunnel} color={f.color} />
              </View>
              <Text style={[type.bodyMedium, { color: colors.ink, width: 24, textAlign: 'right' }]}>{stageCounts[f.key]}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Top Customers by Value</Text>
        <Card>
          {topCustomers.map((c, i) => (
            <Pressable
              key={c.id}
              style={[styles.customerRow, i < topCustomers.length - 1 && styles.rowBorder]}
              onPress={() => navigation.navigate('CustomerDetail', { customerId: c.id })}
            >
              <Text style={[type.caption, { color: colors.faint, width: 18 }]}>{i + 1}</Text>
              <Avatar name={c.name} color={c.avatarColor} size={32} />
              <Text style={[type.bodyMedium, { color: colors.ink, flex: 1, marginLeft: spacing.sm }]} numberOfLines={1}>{c.name}</Text>
              <Text style={[type.bodyMedium, { color: colors.primaryDark }]}>{formatCurrency(c.lifetimeValue)}</Text>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  funnelRow: { flexDirection: 'row', alignItems: 'center' },
  customerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
