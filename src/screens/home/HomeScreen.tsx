import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { Avatar, EnquiryStatusBadge, RatingStars, SectionHeader, StatCard, SummaryCard, TileButton, VerifiedBadge } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useProviderStore } from '../../store/useProviderStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatCompactCurrency } from '../../utils/currency';
import { formatShortDate } from '../../utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function HomeScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const bookings = useBookingStore((s) => s.bookings);
  const unread = useNotificationStore((s) => s.unreadCount());

  const newLeads = enquiries.filter((e) => e.status === 'new');
  const pendingEnquiries = enquiries.filter((e) => ['new', 'reviewing', 'responded', 'confirmation_pending'].includes(e.status));
  const now = new Date();
  const upcomingBookings = bookings
    .filter((b) => b.status === 'confirmed' && new Date(b.eventDate) >= new Date(now.toDateString()))
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const monthRevenue = bookings
    .filter((b) => b.status !== 'cancelled' && new Date(b.eventDate).getMonth() === now.getMonth() && new Date(b.eventDate).getFullYear() === now.getFullYear())
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Avatar name={provider.businessName || 'Provider'} color={provider.logoColor} size={44} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={[type.caption, { color: colors.muted }]}>{greetingForHour(now.getHours())} 👋</Text>
                <Text style={[type.h2, { color: colors.ink, marginTop: 1 }]} numberOfLines={1}>
                  {provider.businessName || 'Your Business'}
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={6}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.ink} />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 8 }}>
            {provider.verified && <VerifiedBadge />}
            <RatingStars rating={provider.rating} showValue reviewCount={provider.reviewCount} />
          </View>
        </View>

        <View style={styles.body}>
          <SummaryCard
            icon="document-text"
            label={pendingEnquiries.length === 1 ? 'Enquiry needs attention' : 'Enquiries need attention'}
            value={pendingEnquiries.length}
            meta={newLeads.length > 0 ? `${newLeads.length} brand-new lead${newLeads.length > 1 ? 's' : ''} just came in` : 'All caught up — nice work!'}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })}
          />

          <View style={styles.statsGrid}>
            <StatCard icon="calendar" label="Upcoming Bookings" value={upcomingBookings.length} tone="secondary" />
            <StatCard icon="cash" label="This Month" value={formatCompactCurrency(monthRevenue)} tone="gold" />
            <StatCard icon="star" label="Rating" value={provider.rating.toFixed(1)} tone="primary" />
            <StatCard icon="people" label="Total Reviews" value={provider.reviewCount} tone="success" />
          </View>

          <SectionHeader title="Quick Actions" />
          <View style={styles.tileGrid}>
            <TileButton icon="document-text" label="Enquiries" iconColor={colors.info} badge={newLeads.length} onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })} style={styles.tile} />
            <TileButton icon="calendar" label="Bookings" iconColor={colors.secondary} onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })} style={styles.tile} />
            <TileButton icon="restaurant" label="Services" iconColor={colors.primary} onPress={() => navigation.navigate('ServicesManagement')} style={styles.tile} />
            <TileButton icon="time" label="Availability" iconColor={colors.gold} onPress={() => navigation.navigate('AvailabilityCalendar')} style={styles.tile} />
            <TileButton icon="star" label="Reviews" iconColor={colors.gold} onPress={() => navigation.navigate('Reviews')} style={styles.tile} />
            <TileButton icon="people" label="Customers" iconColor={colors.info} onPress={() => navigation.navigate('MainTabs', { screen: 'Crm' })} style={styles.tile} />
            <TileButton icon="stats-chart" label="Reports" iconColor={colors.primary} onPress={() => navigation.navigate('Reports')} style={styles.tile} />
            <TileButton icon="wallet" label="Earnings" iconColor={colors.success} onPress={() => navigation.navigate('Earnings')} style={styles.tile} />
          </View>

          {newLeads.length > 0 && (
            <>
              <SectionHeader title="New Leads" actionLabel="View all" onAction={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })} />
              {newLeads.slice(0, 3).map((e) => (
                <Pressable key={e.id} style={[styles.enquiryCard, shadow.sm]} onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: e.id })}>
                  <Avatar name={e.customerName} color={e.avatarColor} size={40} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{e.customerName}</Text>
                    <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{e.eventType} · {e.guestCount} guests · {formatShortDate(e.eventDate)}</Text>
                  </View>
                  <EnquiryStatusBadge status={e.status} compact />
                </Pressable>
              ))}
              <View style={{ height: spacing.lg }} />
            </>
          )}

          {upcomingBookings.length > 0 && (
            <>
              <SectionHeader title="Upcoming Bookings" actionLabel="View all" onAction={() => navigation.navigate('MainTabs', { screen: 'Bookings' })} />
              {upcomingBookings.slice(0, 3).map((b) => (
                <Pressable key={b.id} style={[styles.enquiryCard, shadow.sm]} onPress={() => navigation.navigate('BookingDetail', { bookingId: b.id })}>
                  <View style={styles.dateBox}>
                    <Text style={[type.h3, { color: colors.primaryDark }]}>{new Date(b.eventDate).getDate()}</Text>
                    <Text style={[type.tiny, { color: colors.primaryDark }]}>{new Date(b.eventDate).toLocaleDateString('en-IN', { month: 'short' })}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{b.customerName} · {b.eventType}</Text>
                    <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{b.guestCount} guests · {b.location}</Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bellBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider,
  },
  badge: {
    position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 9,
    backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: colors.background,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.xl },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  tile: { flexGrow: 0, flexBasis: '22.5%', minWidth: 78 },
  enquiryCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.divider,
  },
  dateBox: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
});
