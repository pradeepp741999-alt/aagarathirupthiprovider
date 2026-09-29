import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { Card, ListRow, ScreenHeader } from '../../components';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const faqs = [
  { q: 'How long does provider approval take?', a: 'Our team typically verifies your documents and business details within 24–48 hours of submission.' },
  { q: 'How do I respond to a customer enquiry?', a: "Open the enquiry from the Enquiries tab, review the requirement, and send a quote with your price and a short message. The customer is notified instantly." },
  { q: 'When do I get paid for a booking?', a: 'Payouts are settled to your registered bank account after the event is marked completed, as per the current settlement cycle.' },
  { q: 'Can I pause taking new enquiries temporarily?', a: 'Yes — mark the relevant dates as "Booked" or "Unavailable" from the Availability Calendar so customers see accurate availability.' },
  { q: 'How are customer reviews calculated?', a: 'Your overall rating is the average of all ratings received. Reviews are only allowed on completed bookings to keep them trustworthy.' },
];

export function HelpSupportScreen({ navigation }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
          <ListRow icon="call-outline" label="Call Support" meta="+91 90000 12345" onPress={() => Linking.openURL('tel:9000012345').catch(() => {})} />
          <View style={styles.divider} />
          <ListRow icon="logo-whatsapp" label="WhatsApp Support" meta="Chat with our team" onPress={() => Linking.openURL('https://wa.me/919000012345').catch(() => {})} />
          <View style={styles.divider} />
          <ListRow icon="mail-outline" label="Email Support" meta="providers@aagarathirupthi.app" onPress={() => Linking.openURL('mailto:providers@aagarathirupthi.app').catch(() => {})} />
        </Card>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((f, i) => {
          const open = openIndex === i;
          return (
            <Pressable key={f.q} style={[styles.faqCard, shadow.sm]} onPress={() => setOpenIndex(open ? null : i)}>
              <View style={styles.faqHeader}>
                <Text style={[type.bodyMedium, { color: colors.ink, flex: 1 }]}>{f.q}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
              </View>
              {open && <Text style={[type.body, { color: colors.muted, marginTop: spacing.sm }]}>{f.a}</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  divider: { height: 1, backgroundColor: colors.divider },
  faqCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.divider,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center' },
});
