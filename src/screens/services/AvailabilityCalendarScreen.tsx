import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type, shadow } from '../../theme';
import { Button, Card, ScreenHeader } from '../../components';
import { useServiceStore } from '../../store/useServiceStore';
import { AvailabilityDayStatus } from '../../data/types';
import { toISODate } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'AvailabilityCalendar'>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AvailabilityCalendarScreen({ navigation }: Props) {
  const availability = useServiceStore((s) => s.availability);
  const setDayStatus = useServiceStore((s) => s.setDayStatus);
  const getDayStatus = useServiceStore((s) => s.getDayStatus);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));
  const [noteText, setNoteText] = useState('');

  const fetchMonthAvailability = useServiceStore((s) => s.fetchMonthAvailability);

  React.useEffect(() => {
    fetchMonthAvailability(currentYear, currentMonth + 1).catch(() => {});
  }, [currentYear, currentMonth]);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(toISODate(today));
  };

  // Month title e.g. "October 2026"
  const monthDate = new Date(currentYear, currentMonth, 1);
  const monthName = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Compute calendar grid days
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Selected date info
  const selectedStatus = getDayStatus(selectedDate);
  const selectedEntry = availability.find((a) => a.date === selectedDate);

  const handleUpdateStatus = (status: AvailabilityDayStatus) => {
    setDayStatus(selectedDate, status, noteText.trim() || undefined);
  };

  const handleDateSelect = (iso: string) => {
    setSelectedDate(iso);
    const existing = availability.find((a) => a.date === iso);
    setNoteText(existing?.note ?? '');
  };

  // Month statistics
  let monthAvailable = 0;
  let monthBooked = 0;
  let monthBlocked = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dIso = toISODate(new Date(currentYear, currentMonth, d));
    const st = getDayStatus(dIso);
    if (st === 'unavailable') monthBlocked++;
    else if (st === 'booked' || st === 'partial') monthBooked++;
    else monthAvailable++;
  }

  // Build grid cells
  const gridCells: ({ dayNumber: number; iso: string } | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISODate(new Date(currentYear, currentMonth, d));
    gridCells.push({ dayNumber: d, iso });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Availability Calendar"
        subtitle="Manage available, booked & blocked dates"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={goToToday} style={styles.todayBtn}>
            <Text style={[type.caption, { color: colors.primary, fontWeight: '700' }]}>Today</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        {/* Month Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[type.caption, { color: colors.ink }]}>{monthAvailable} Available</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.secondary }]} />
            <Text style={[type.caption, { color: colors.ink }]}>{monthBooked} Booked</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.danger }]} />
            <Text style={[type.caption, { color: colors.ink }]}>{monthBlocked} Blocked</Text>
          </View>
        </View>

        {/* Month Navigation Card */}
        <Card style={{ paddingVertical: spacing.md, paddingHorizontal: spacing.sm }}>
          <View style={styles.navRow}>
            <Pressable onPress={prevMonth} style={styles.navArrow} hitSlop={10}>
              <Ionicons name="chevron-back" size={22} color={colors.ink} />
            </Pressable>
            <Text style={[type.h2, { color: colors.ink }]}>{monthName}</Text>
            <Pressable onPress={nextMonth} style={styles.navArrow} hitSlop={10}>
              <Ionicons name="chevron-forward" size={22} color={colors.ink} />
            </Pressable>
          </View>

          {/* Weekday Labels Header */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w, idx) => (
              <View key={w} style={styles.weekdayCol}>
                <Text
                  style={[
                    type.caption,
                    {
                      color: idx === 0 || idx === 6 ? colors.secondaryDark : colors.muted,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {w}
                </Text>
              </View>
            ))}
          </View>

          {/* Month Grid Cells */}
          <View style={styles.grid}>
            {gridCells.map((cell, idx) => {
              if (!cell) {
                return <View key={`empty-${idx}`} style={styles.cellEmpty} />;
              }

              const { dayNumber, iso } = cell;
              const status = getDayStatus(iso);
              const isSelected = iso === selectedDate;
              const isToday = iso === toISODate(today);

              let badgeColor = colors.success;
              let badgeText = 'Avail';
              let badgeBg = colors.successSoft;

              if (status === 'unavailable') {
                badgeColor = colors.danger;
                badgeText = 'Block';
                badgeBg = colors.dangerSoft;
              } else if (status === 'booked' || status === 'partial') {
                badgeColor = colors.secondaryDark;
                badgeText = 'Booked';
                badgeBg = colors.secondarySoft;
              }

              return (
                <Pressable
                  key={iso}
                  onPress={() => handleDateSelect(iso)}
                  style={[
                    styles.cell,
                    isSelected && styles.cellSelected,
                    isToday && !isSelected && styles.cellToday,
                  ]}
                >
                  <Text
                    style={[
                      type.bodyMedium,
                      {
                        color: isSelected ? colors.primaryDark : colors.ink,
                        fontWeight: isSelected || isToday ? '800' : '500',
                      },
                    ]}
                  >
                    {dayNumber}
                  </Text>
                  <View style={[styles.dayStatusBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.dayStatusText, { color: badgeColor }]}>{badgeText}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Selected Date Action Panel */}
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.actionHeader}>
            <View>
              <Text style={[type.caption, { color: colors.muted }]}>Selected Date</Text>
              <Text style={[type.h3, { color: colors.ink, marginTop: 2 }]}>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View
              style={[
                styles.currentStatusPill,
                {
                  backgroundColor:
                    selectedStatus === 'unavailable'
                      ? colors.dangerSoft
                      : selectedStatus === 'booked' || selectedStatus === 'partial'
                      ? colors.secondarySoft
                      : colors.successSoft,
                },
              ]}
            >
              <Text
                style={[
                  type.caption,
                  {
                    color:
                      selectedStatus === 'unavailable'
                        ? colors.danger
                        : selectedStatus === 'booked' || selectedStatus === 'partial'
                        ? colors.secondaryDark
                        : colors.success,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {selectedStatus === 'unavailable' ? 'Blocked' : selectedStatus === 'booked' || selectedStatus === 'partial' ? 'Booked' : 'Available'}
              </Text>
            </View>
          </View>

          <Text style={[type.bodyMedium, { color: colors.ink, marginTop: spacing.md, marginBottom: spacing.sm }]}>
            Change Status
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable
              onPress={() => handleUpdateStatus('available')}
              style={[
                styles.actionBtn,
                { borderColor: colors.success },
                selectedStatus === 'available' && { backgroundColor: colors.success },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={selectedStatus === 'available' ? colors.white : colors.success}
              />
              <Text
                style={[
                  type.caption,
                  {
                    color: selectedStatus === 'available' ? colors.white : colors.success,
                    fontWeight: '700',
                    marginLeft: 4,
                  },
                ]}
              >
                Available
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleUpdateStatus('booked')}
              style={[
                styles.actionBtn,
                { borderColor: colors.secondary },
                (selectedStatus === 'booked' || selectedStatus === 'partial') && {
                  backgroundColor: colors.secondary,
                },
              ]}
            >
              <Ionicons
                name="calendar"
                size={16}
                color={
                  selectedStatus === 'booked' || selectedStatus === 'partial'
                    ? colors.white
                    : colors.secondaryDark
                }
              />
              <Text
                style={[
                  type.caption,
                  {
                    color:
                      selectedStatus === 'booked' || selectedStatus === 'partial'
                        ? colors.white
                        : colors.secondaryDark,
                    fontWeight: '700',
                    marginLeft: 4,
                  },
                ]}
              >
                Booked
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleUpdateStatus('unavailable')}
              style={[
                styles.actionBtn,
                { borderColor: colors.danger },
                selectedStatus === 'unavailable' && { backgroundColor: colors.danger },
              ]}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={selectedStatus === 'unavailable' ? colors.white : colors.danger}
              />
              <Text
                style={[
                  type.caption,
                  {
                    color: selectedStatus === 'unavailable' ? colors.white : colors.danger,
                    fontWeight: '700',
                    marginLeft: 4,
                  },
                ]}
              >
                Blocked
              </Text>
            </Pressable>
          </View>

          <Text style={[type.caption, { color: colors.muted, marginTop: spacing.md, marginBottom: 4 }]}>
            Optional note / booking remarks
          </Text>
          <View style={styles.noteInputWrap}>
            <TextInput
              style={styles.noteInput}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="e.g. Wedding Hall Booking / Personal maintenance"
              placeholderTextColor={colors.muted}
            />
            {noteText ? (
              <Pressable
                onPress={() => setDayStatus(selectedDate, selectedStatus, noteText.trim())}
                style={styles.saveNoteBtn}
              >
                <Text style={[type.caption, { color: colors.primary, fontWeight: '700' }]}>Save</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  todayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  navArrow: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  weekdayRow: { flexDirection: 'row', marginBottom: spacing.xs },
  weekdayCol: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellEmpty: { width: '14.28%', height: 60 },
  cell: {
    width: '14.28%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 2,
  },
  cellSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    borderWidth: 1.5,
  },
  cellToday: {
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  dayStatusBadge: {
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dayStatusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  currentStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  noteInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.md,
    marginTop: 2,
  },
  noteInput: { flex: 1, height: 40, color: colors.ink, fontSize: 13 },
  saveNoteBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
