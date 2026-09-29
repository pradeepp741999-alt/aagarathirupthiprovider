import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { Avatar, Button, Card, EnquiryStatusBadge, Input, ScreenHeader } from '../../components';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useCrmStore } from '../../store/useCrmStore';
import { formatCurrency } from '../../utils/currency';
import { formatDateTime, formatLongDate } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'EnquiryDetail'>;

export function EnquiryDetailScreen({ navigation, route }: Props) {
  const { enquiryId } = route.params;
  const enquiry = useEnquiryStore((s) => s.enquiries.find((e) => e.id === enquiryId));
  const markSeen = useEnquiryStore((s) => s.markSeen);
  const sendQuote = useEnquiryStore((s) => s.sendQuote);
  const rejectEnquiry = useEnquiryStore((s) => s.rejectEnquiry);
  const updateStatus = useEnquiryStore((s) => s.updateStatus);
  const addMessage = useEnquiryStore((s) => s.addMessage);
  const createFromEnquiry = useBookingStore((s) => s.createFromEnquiry);
  const bookings = useBookingStore((s) => s.bookings);
  const crmCustomers = useCrmStore((s) => s.customers);
  const updateStage = useCrmStore((s) => s.updateStage);

  const [quote, setQuote] = useState(enquiry?.quote ? String(enquiry.quote) : enquiry ? String(enquiry.estimatedTotal) : '');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    if (enquiry?.status === 'new') markSeen(enquiry.id);
  }, [enquiry?.id]);

  if (!enquiry) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Enquiry" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const linkedBooking = bookings.find((b) => b.enquiryId === enquiry.id);
  const linkedCustomer = crmCustomers.find((c) => c.enquiryIds.includes(enquiry.id));

  const handleSendQuote = () => {
    const amount = Number(quote);
    if (!amount) return;
    sendQuote(enquiry.id, amount, quoteMessage.trim());
    if (linkedCustomer) updateStage(linkedCustomer.id, 'quoted');
    setQuoteMessage('');
  };

  const handleConfirmBooking = () => {
    createFromEnquiry(enquiry, enquiry.quote ?? enquiry.estimatedTotal);
    updateStatus(enquiry.id, 'confirmed');
    if (linkedCustomer) updateStage(linkedCustomer.id, 'booked');
  };

  const handleReject = () => {
    rejectEnquiry(enquiry.id, rejectReason.trim());
    if (linkedCustomer) updateStage(linkedCustomer.id, 'lost');
    setShowReject(false);
  };

  const handleFollowUp = () => {
    if (!followUp.trim()) return;
    addMessage(enquiry.id, followUp.trim());
    setFollowUp('');
  };

  const call = (mobile: string) => Linking.openURL(`tel:${mobile}`).catch(() => {});
  const whatsapp = (mobile: string) => Linking.openURL(`https://wa.me/91${mobile}`).catch(() => {});

  const isActive = !['completed', 'cancelled', 'rejected'].includes(enquiry.status);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Enquiry Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar name={enquiry.customerName} color={enquiry.avatarColor} size={48} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[type.h3, { color: colors.ink }]}>{enquiry.customerName}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>+91 {enquiry.customerMobile}</Text>
            </View>
            <EnquiryStatusBadge status={enquiry.status} />
          </View>
          <View style={styles.contactRow}>
            <Pressable style={styles.contactBtn} onPress={() => call(enquiry.customerMobile)}>
              <Ionicons name="call" size={15} color={colors.primary} />
              <Text style={[type.caption, { color: colors.primary, marginLeft: 6 }]}>Call</Text>
            </Pressable>
            <Pressable style={[styles.contactBtn, { backgroundColor: '#E7F6EC' }]} onPress={() => whatsapp(enquiry.customerWhatsapp)}>
              <Ionicons name="logo-whatsapp" size={15} color={colors.success} />
              <Text style={[type.caption, { color: colors.success, marginLeft: 6 }]}>WhatsApp</Text>
            </Pressable>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Event Details</Text>
        <Card>
          <DetailRow icon="sparkles-outline" label="Event Type" value={enquiry.eventType} />
          <DetailRow icon="calendar-outline" label="Event Date" value={formatLongDate(enquiry.eventDate)} />
          <DetailRow icon="location-outline" label="Location" value={enquiry.location} />
          <DetailRow icon="people-outline" label="Guests" value={`${enquiry.guestCount} people`} last />
        </Card>

        <Text style={styles.sectionTitle}>Requested Items</Text>
        <Card>
          {enquiry.items.map((item, i) => (
            <View key={i} style={[styles.itemRow, i < enquiry.items.length - 1 && styles.itemRowBorder]}>
              <Text style={[type.body, { color: colors.ink, flex: 1 }]}>{item.name}</Text>
              <Text style={[type.caption, { color: colors.muted, marginRight: spacing.sm }]}>x{item.qty}</Text>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{formatCurrency(item.price * item.qty)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[type.bodyMedium, { color: colors.ink }]}>Estimated Total</Text>
            <Text style={[type.h3, { color: colors.primaryDark }]}>{formatCurrency(enquiry.estimatedTotal)}</Text>
          </View>
          {enquiry.notes && (
            <View style={styles.notesBox}>
              <Text style={[type.caption, { color: colors.muted }]}>Customer notes</Text>
              <Text style={[type.body, { color: colors.ink, marginTop: 2 }]}>{enquiry.notes}</Text>
            </View>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Communication</Text>
        <Card>
          {enquiry.timeline.map((entry, i) => (
            <View key={entry.id} style={[styles.timelineRow, i < enquiry.timeline.length - 1 && styles.itemRowBorder]}>
              <View style={[styles.timelineDot, { backgroundColor: entry.author === 'provider' ? colors.primary : entry.author === 'customer' ? colors.secondary : colors.muted }]} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={[type.caption, { color: colors.ink }]}>{entry.message}</Text>
                <Text style={[type.tiny, { color: colors.faint, marginTop: 2 }]}>
                  {entry.author === 'provider' ? 'You' : entry.author === 'customer' ? enquiry.customerName : 'System'} · {formatDateTime(entry.at)}
                </Text>
              </View>
            </View>
          ))}

          {isActive && (
            <View style={{ marginTop: spacing.md }}>
              <Input
                placeholder="Send a follow-up message..."
                value={followUp}
                onChangeText={setFollowUp}
                rightElement={
                  <Pressable onPress={handleFollowUp} hitSlop={8}>
                    <Ionicons name="send" size={18} color={colors.primary} />
                  </Pressable>
                }
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          )}
        </Card>

        {(enquiry.status === 'new' || enquiry.status === 'reviewing') && !showReject && (
          <>
            <Text style={styles.sectionTitle}>Send a Quote</Text>
            <Card>
              <Input label="Quote Amount (₹)" icon="cash-outline" keyboardType="number-pad" value={quote} onChangeText={(v) => setQuote(v.replace(/\D/g, ''))} />
              <Input
                label="Message to customer (optional)"
                icon="chatbubble-outline"
                value={quoteMessage}
                onChangeText={setQuoteMessage}
                placeholder="e.g. Can do it for this price, all-inclusive."
                multiline
              />
              <Button label="Send Quote" fullWidth onPress={handleSendQuote} />
              <Button label="Not able to take this" variant="ghost" fullWidth onPress={() => setShowReject(true)} style={{ marginTop: spacing.sm }} />
            </Card>
          </>
        )}

        {showReject && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>Let the customer know why</Text>
            <Input placeholder="e.g. Fully booked on that date" value={rejectReason} onChangeText={setRejectReason} />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button label="Cancel" variant="outline" onPress={() => setShowReject(false)} style={{ flex: 1 }} />
              <Button label="Confirm Reject" variant="danger" onPress={handleReject} style={{ flex: 1 }} />
            </View>
          </Card>
        )}

        {enquiry.status === 'responded' && (
          <Card style={{ marginTop: spacing.md }}>
            <View style={styles.quoteBanner}>
              <Ionicons name="pricetag" size={16} color={colors.secondaryDark} />
              <Text style={[type.bodyMedium, { color: colors.secondaryDark, marginLeft: 6 }]}>
                Quote sent: {formatCurrency(enquiry.quote ?? 0)} — waiting for customer to confirm.
              </Text>
            </View>
            <Button label="Mark as Confirmation Pending" variant="outline" fullWidth style={{ marginTop: spacing.md }} onPress={() => updateStatus(enquiry.id, 'confirmation_pending')} />
          </Card>
        )}

        {enquiry.status === 'confirmation_pending' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.md }]}>
              Customer is ready to confirm at {formatCurrency(enquiry.quote ?? enquiry.estimatedTotal)}.
            </Text>
            <Button label="Confirm Booking" fullWidth icon="checkmark-circle" onPress={handleConfirmBooking} />
          </Card>
        )}

        {enquiry.status === 'confirmed' && (
          <Card style={{ marginTop: spacing.md }}>
            <View style={styles.quoteBanner}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[type.bodyMedium, { color: colors.success, marginLeft: 6 }]}>Booking confirmed</Text>
            </View>
            {linkedBooking && (
              <Button label="View Booking" variant="outline" fullWidth style={{ marginTop: spacing.md }} onPress={() => navigation.navigate('BookingDetail', { bookingId: linkedBooking.id })} />
            )}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, !last && styles.itemRowBorder]}>
      <Ionicons name={icon} size={16} color={colors.muted} style={{ width: 22 }} />
      <Text style={[type.caption, { color: colors.muted, flex: 1 }]}>{label}</Text>
      <Text style={[type.bodyMedium, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill, backgroundColor: colors.primarySoft,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.md, marginTop: spacing.xs },
  notesBox: { marginTop: spacing.md, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md },
  timelineRow: { flexDirection: 'row', paddingVertical: spacing.sm },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  quoteBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondarySoft,
    borderRadius: radius.md, padding: spacing.md,
  },
});
