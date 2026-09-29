import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { AvailabilityBadge, ScreenHeader } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';
import { AvailabilityDayStatus } from '../../data/types';
import { nextDays, toISODate, weekdayLabel } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'AvailabilityCalendar'>;

const statusOptions: { key: AvailabilityDayStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'available', label: 'Available', icon: 'checkmark-circle' },
  { key: 'partial', label: 'Partial', icon: 'time' },
  { key: 'unavailable', label: 'Booked', icon: 'close-circle' },
];

export function AvailabilityCalendarScreen({ navigation }: Props) {
  const availability = useServiceStore((s) => s.availability);
  const setDayStatus = useServiceStore((s) => s.setDayStatus);
  const getDayStatus = useServiceStore((s) => s.getDayStatus);

  const days = nextDays(45, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Availability Calendar" subtitle="Next 45 days" onBack={() => navigation.goBack()} />
      <FlatList
        data={days}
        keyExtractor={(d) => toISODate(d)}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.sm }}
        renderItem={({ item }) => {
          const iso = toISODate(item);
          const status = getDayStatus(iso);
          const note = availability.find((a) => a.date === iso)?.note;
          const isToday = iso === toISODate(new Date());
          return (
            <View style={[styles.row, shadow.sm, isToday && { borderColor: colors.primary, borderWidth: 1.5 }]}>
              <View style={styles.dateCol}>
                <Text style={[type.tiny, { color: colors.muted }]}>{weekdayLabel(item)}</Text>
                <Text style={[type.h3, { color: colors.ink }]}>{item.getDate()}</Text>
                <Text style={[type.tiny, { color: colors.muted }]}>{item.toLocaleDateString('en-IN', { month: 'short' })}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <AvailabilityBadge status={status} />
                {note && <Text style={[type.tiny, { color: colors.muted, marginTop: 4 }]} numberOfLines={1}>{note}</Text>}
                <View style={styles.btnRow}>
                  {statusOptions.map((opt) => (
                    <Pressable
                      key={opt.key}
                      onPress={() => setDayStatus(iso, opt.key)}
                      style={[styles.statusBtn, status === opt.key && styles.statusBtnActive]}
                    >
                      <Ionicons name={opt.icon} size={13} color={status === opt.key ? colors.white : colors.muted} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.divider, padding: spacing.md, marginBottom: spacing.md, gap: spacing.md,
  },
  dateCol: { width: 48, alignItems: 'center' },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  statusBtn: {
    width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider,
  },
  statusBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
