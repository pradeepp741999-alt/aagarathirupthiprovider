import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '../theme';
import { AvailabilityDayStatus, BookingStatus, CrmStage, DocumentItem, EnquiryStatus, ProviderStatus } from '../data/types';

type Meta = { label: string; bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap };

export const enquiryStatusMeta: Record<EnquiryStatus, Meta> = {
  new: { label: 'New Lead', bg: colors.infoSoft, fg: colors.info, icon: 'sparkles' },
  reviewing: { label: 'Reviewing', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  responded: { label: 'Quoted', bg: colors.secondarySoft, fg: colors.secondaryDark, icon: 'chatbubble-ellipses' },
  confirmation_pending: { label: 'Awaiting Confirm', bg: colors.warningSoft, fg: colors.warning, icon: 'hourglass' },
  confirmed: { label: 'Confirmed', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  completed: { label: 'Completed', bg: colors.primarySoft, fg: colors.primaryDark, icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelled', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
  rejected: { label: 'Rejected', bg: colors.dangerSoft, fg: colors.danger, icon: 'ban' },
};

export const bookingStatusMeta: Record<BookingStatus, Meta> = {
  confirmed: { label: 'Confirmed', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  in_progress: { label: 'In Progress', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  completed: { label: 'Completed', bg: colors.primarySoft, fg: colors.primaryDark, icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelled', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
};

export const providerStatusMeta: Record<ProviderStatus, Meta> = {
  draft: { label: 'Draft', bg: colors.divider, fg: colors.muted, icon: 'document' },
  pending: { label: 'Pending Submission', bg: colors.infoSoft, fg: colors.info, icon: 'paper-plane' },
  under_review: { label: 'Under Review', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  approved: { label: 'Approved', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  rejected: { label: 'Rejected', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
  suspended: { label: 'Suspended', bg: colors.dangerSoft, fg: colors.danger, icon: 'alert-circle' },
};

export const crmStageMeta: Record<CrmStage, Meta> = {
  new_lead: { label: 'New Lead', bg: colors.infoSoft, fg: colors.info, icon: 'sparkles' },
  contacted: { label: 'Contacted', bg: colors.goldSoft, fg: colors.gold, icon: 'call' },
  quoted: { label: 'Quoted', bg: colors.secondarySoft, fg: colors.secondaryDark, icon: 'pricetag' },
  booked: { label: 'Booked', bg: colors.successSoft, fg: colors.success, icon: 'calendar' },
  completed: { label: 'Completed', bg: colors.primarySoft, fg: colors.primaryDark, icon: 'checkmark-done-circle' },
  lost: { label: 'Lost', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
};

export const docStatusMeta: Record<DocumentItem['status'], Meta> = {
  missing: { label: 'Missing', bg: colors.dangerSoft, fg: colors.danger, icon: 'alert-circle' },
  uploaded: { label: 'Uploaded', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  verified: { label: 'Verified', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  rejected: { label: 'Rejected', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
};

export const availabilityMeta: Record<AvailabilityDayStatus, Meta> = {
  available: { label: 'Available', bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' },
  unavailable: { label: 'Blocked', bg: colors.dangerSoft, fg: colors.danger, icon: 'close-circle' },
  partial: { label: 'Partial', bg: colors.warningSoft, fg: colors.warning, icon: 'time' },
  booked: { label: 'Booked', bg: colors.secondarySoft, fg: colors.secondaryDark, icon: 'calendar' },
};

function BaseBadge({ meta, compact }: { meta: Meta; compact?: boolean }) {
  return (
    <View style={[styles.base, { backgroundColor: meta.bg }]}>
      <Ionicons name={meta.icon} size={11} color={meta.fg} style={{ marginRight: 4 }} />
      <Text style={[type.tiny, { color: meta.fg }]}>{compact ? meta.label.split(' ')[0] : meta.label}</Text>
    </View>
  );
}

export function EnquiryStatusBadge({ status, compact }: { status: EnquiryStatus; compact?: boolean }) {
  return <BaseBadge meta={enquiryStatusMeta[status]} compact={compact} />;
}
export function BookingStatusBadge({ status, compact }: { status: BookingStatus; compact?: boolean }) {
  return <BaseBadge meta={bookingStatusMeta[status]} compact={compact} />;
}
export function ProviderStatusBadge({ status, compact }: { status: ProviderStatus; compact?: boolean }) {
  return <BaseBadge meta={providerStatusMeta[status]} compact={compact} />;
}
export function CrmStageBadge({ stage, compact }: { stage: CrmStage; compact?: boolean }) {
  return <BaseBadge meta={crmStageMeta[stage]} compact={compact} />;
}
export function DocStatusBadge({ status, compact }: { status: DocumentItem['status']; compact?: boolean }) {
  return <BaseBadge meta={docStatusMeta[status]} compact={compact} />;
}
export function AvailabilityBadge({ status, compact }: { status: AvailabilityDayStatus; compact?: boolean }) {
  return <BaseBadge meta={availabilityMeta[status]} compact={compact} />;
}

export function VerifiedBadge() {
  return (
    <View style={[styles.base, { backgroundColor: colors.primarySoft }]}>
      <Ionicons name="shield-checkmark" size={12} color={colors.primaryDark} style={{ marginRight: 4 }} />
      <Text style={[type.tiny, { color: colors.primaryDark }]}>Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
