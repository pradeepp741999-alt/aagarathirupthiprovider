import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, type } from '../../theme';
import { Avatar, Button, Card, EmptyState, Input, ProgressBar, RatingStars, ScreenHeader } from '../../components';
import { useReviewStore } from '../../store/useReviewStore';
import { formatShortDate } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Reviews'>;

const breakdownLabels: { key: 'quality' | 'communication' | 'value' | 'timeliness'; label: string }[] = [
  { key: 'quality', label: 'Service Quality' },
  { key: 'communication', label: 'Communication' },
  { key: 'value', label: 'Value for Money' },
  { key: 'timeliness', label: 'Timeliness' },
];

export function ReviewsScreen({ navigation }: Props) {
  const reviews = useReviewStore((s) => s.reviews);
  const replyToReview = useReviewStore((s) => s.replyToReview);

  // Derived locally (not as zustand selectors) so each render doesn't hand
  // React a freshly-allocated object as the store "snapshot" — that mismatch
  // is what was triggering an infinite re-render loop.
  const averageRating = useMemo(() => (reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0), [reviews]);
  const breakdown = useMemo(() => {
    const withBreakdown = reviews.filter((r) => r.breakdown);
    const n = withBreakdown.length || 1;
    const totals = withBreakdown.reduce(
      (acc, r) => ({
        quality: acc.quality + (r.breakdown?.quality ?? 0),
        communication: acc.communication + (r.breakdown?.communication ?? 0),
        value: acc.value + (r.breakdown?.value ?? 0),
        timeliness: acc.timeliness + (r.breakdown?.timeliness ?? 0),
      }),
      { quality: 0, communication: 0, value: 0, timeliness: 0 }
    );
    return { quality: totals.quality / n, communication: totals.communication / n, value: totals.value / n, timeliness: totals.timeliness / n };
  }, [reviews]);
  const distribution = useMemo(() => {
    const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (dist[rounded] !== undefined) dist[rounded] += 1;
    });
    return dist;
  }, [reviews]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);

  const maxCount = Math.max(1, ...Object.values(distribution));

  const submitReply = (id: string) => {
    const message = replyDrafts[id]?.trim();
    if (!message) return;
    replyToReview(id, message);
    setOpenReplyFor(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Reviews & Ratings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: 90 }}>
              <Text style={[type.display, { color: colors.ink }]}>{averageRating.toFixed(1)}</Text>
              <RatingStars rating={averageRating} size={13} />
              <Text style={[type.caption, { color: colors.muted, marginTop: 4 }]}>{reviews.length} reviews</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <View key={star} style={styles.distRow}>
                  <Text style={[type.tiny, { color: colors.muted, width: 10 }]}>{star}</Text>
                  <Ionicons name="star" size={10} color={colors.gold} style={{ marginRight: 6 }} />
                  <View style={{ flex: 1 }}>
                    <ProgressBar value={(distribution[star as 1 | 2 | 3 | 4 | 5] ?? 0) / maxCount} color={colors.gold} height={6} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Rating Breakdown</Text>
        <Card>
          {breakdownLabels.map((b, i) => (
            <View key={b.key} style={[styles.breakdownRow, i < breakdownLabels.length - 1 && { marginBottom: spacing.md }]}>
              <Text style={[type.caption, { color: colors.body, width: 130 }]}>{b.label}</Text>
              <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                <ProgressBar value={breakdown[b.key] / 5} color={colors.primary} />
              </View>
              <Text style={[type.caption, { color: colors.ink }]}>{breakdown[b.key].toFixed(1)}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>All Reviews</Text>
        {reviews.length === 0 ? (
          <EmptyState icon="star-outline" title="No reviews yet" message="Reviews from completed bookings will appear here." />
        ) : (
          reviews.map((r) => (
            <Card key={r.id} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Avatar name={r.customerName} color={r.avatarColor} size={40} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[type.bodyMedium, { color: colors.ink }]}>{r.customerName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <RatingStars rating={r.rating} size={12} />
                    <Text style={[type.tiny, { color: colors.muted, marginLeft: 6 }]}>{r.eventType} · {formatShortDate(r.date)}</Text>
                  </View>
                </View>
              </View>
              <Text style={[type.body, { color: colors.body, marginTop: spacing.sm }]}>{r.comment}</Text>

              {r.providerReply ? (
                <View style={styles.replyBox}>
                  <Text style={[type.tiny, { color: colors.primaryDark }]}>Your reply</Text>
                  <Text style={[type.caption, { color: colors.body, marginTop: 2 }]}>{r.providerReply.message}</Text>
                </View>
              ) : openReplyFor === r.id ? (
                <View style={{ marginTop: spacing.sm }}>
                  <Input
                    placeholder="Write a reply..."
                    value={replyDrafts[r.id] ?? ''}
                    onChangeText={(v) => setReplyDrafts((prev) => ({ ...prev, [r.id]: v }))}
                  />
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <Button label="Cancel" variant="outline" size="sm" onPress={() => setOpenReplyFor(null)} style={{ flex: 1 }} />
                    <Button label="Post Reply" size="sm" onPress={() => submitReply(r.id)} style={{ flex: 1 }} />
                  </View>
                </View>
              ) : (
                <Pressable onPress={() => setOpenReplyFor(r.id)} style={{ marginTop: spacing.sm }}>
                  <Text style={[type.caption, { color: colors.primary }]}>Reply to this review</Text>
                </Pressable>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...type.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center' },
  replyBox: { marginTop: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md },
});
