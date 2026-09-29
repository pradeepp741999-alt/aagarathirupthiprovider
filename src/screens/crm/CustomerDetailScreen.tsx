import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { Avatar, Button, Card, Chip, CrmStageBadge, EnquiryStatusBadge, Input, ScreenHeader } from '../../components';
import { useCrmStore } from '../../store/useCrmStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { CrmStage } from '../../data/types';
import { formatCurrency } from '../../utils/currency';
import { timeAgo } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerDetail'>;

const stages: { key: CrmStage; label: string }[] = [
  { key: 'new_lead', label: 'New Lead' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'booked', label: 'Booked' },
  { key: 'completed', label: 'Completed' },
  { key: 'lost', label: 'Lost' },
];

export function CustomerDetailScreen({ navigation, route }: Props) {
  const customer = useCrmStore((s) => s.customers.find((c) => c.id === route.params.customerId));
  const updateStage = useCrmStore((s) => s.updateStage);
  const addNote = useCrmStore((s) => s.addNote);
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const [note, setNote] = useState('');

  if (!customer) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Customer" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const linkedEnquiries = enquiries.filter((e) => customer.enquiryIds.includes(e.id));
  const call = () => Linking.openURL(`tel:${customer.mobile}`).catch(() => {});
  const whatsapp = () => Linking.openURL(`https://wa.me/91${customer.whatsapp}`).catch(() => {});

  const submitNote = () => {
    if (!note.trim()) return;
    addNote(customer.id, note.trim());
    setNote('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Customer Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar name={customer.name} color={customer.avatarColor} size={52} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[type.h3, { color: colors.ink }]}>{customer.name}</Text>
              <Text style={[type.caption, { color: colors.muted }]}>+91 {customer.mobile}</Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <Pressable style={styles.contactBtn} onPress={call}>
              <Ionicons name="call" size={15} color={colors.primary} />
              <Text style={[type.caption, { color: colors.primary, marginLeft: 6 }]}>Call</Text>
            </Pressable>
            <Pressable style={[styles.contactBtn, { backgroundColor: '#E7F6EC' }]} onPress={whatsapp}>
              <Ionicons name="logo-whatsapp" size={15} color={colors.success} />
              <Text style={[type.caption, { color: colors.success, marginLeft: 6 }]}>WhatsApp</Text>
            </Pressable>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={{ flex: 1 }} padded>
            <Text style={[type.h2, { color: colors.ink }]}>{customer.totalEnquiries}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Enquiries</Text>
          </Card>
          <Card style={{ flex: 1 }} padded>
            <Text style={[type.h2, { color: colors.ink }]}>{customer.totalBookings}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Bookings</Text>
          </Card>
          <Card style={{ flex: 1 }} padded>
            <Text style={[type.h2, { color: colors.ink }]}>{formatCurrency(customer.lifetimeValue)}</Text>
            <Text style={[type.caption, { color: colors.muted }]}>Lifetime Value</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Pipeline Stage</Text>
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {stages.map((s) => (
              <Chip key={s.key} label={s.label} selected={customer.stage === s.key} onPress={() => updateStage(customer.id, s.key)} />
            ))}
          </View>
          <View style={{ marginTop: spacing.md }}>
            <CrmStageBadge stage={customer.stage} />
          </View>
        </Card>

        {customer.tags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {customer.tags.map((t) => (
                <Chip key={t} label={t} tone="info" />
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Enquiry History</Text>
        <Card>
          {linkedEnquiries.length === 0 ? (
            <Text style={[type.caption, { color: colors.muted }]}>No enquiries yet.</Text>
          ) : (
            linkedEnquiries.map((e, i) => (
              <Pressable
                key={e.id}
                style={[styles.enqRow, i < linkedEnquiries.length - 1 && styles.rowBorder]}
                onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: e.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{e.eventType}</Text>
                  <Text style={[type.caption, { color: colors.muted }]}>{formatCurrency(e.quote ?? e.estimatedTotal)}</Text>
                </View>
                <EnquiryStatusBadge status={e.status} compact />
              </Pressable>
            ))
          )}
        </Card>

        <Text style={styles.sectionTitle}>Notes</Text>
        <Card>
          <Input
            placeholder="Add a note about this customer..."
            value={note}
            onChangeText={setNote}
            rightElement={
              <Pressable onPress={submitNote} hitSlop={8}>
                <Ionicons name="send" size={18} color={colors.primary} />
              </Pressable>
            }
            containerStyle={{ marginBottom: customer.notes.length ? spacing.md : 0 }}
          />
          {customer.notes.map((n, i) => (
            <View key={n.id} style={[styles.noteRow, i < customer.notes.length - 1 && styles.rowBorder]}>
              <Text style={[type.caption, { color: colors.ink }]}>{n.message}</Text>
              <Text style={[type.tiny, { color: colors.faint, marginTop: 2 }]}>{timeAgo(n.at)}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.pill, backgroundColor: colors.primarySoft,
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  enqRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  noteRow: { paddingVertical: spacing.sm },
});
