import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { ScreenHeader, EmptyState } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useNotificationStore } from '../../store/useNotificationStore';
import { AppNotification } from '../../data/types';
import { timeAgo } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const iconMap: Record<AppNotification['type'], keyof typeof Ionicons.glyphMap> = {
  enquiry: 'chatbubble-ellipses',
  booking: 'checkmark-circle',
  review: 'star',
  system: 'information-circle',
  approval: 'shield-checkmark',
};

const colorMap: Record<AppNotification['type'], string> = {
  enquiry: colors.primary,
  booking: colors.success,
  review: colors.gold,
  system: colors.info,
  approval: colors.secondary,
};

export function NotificationsScreen({ navigation }: Props) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={markAllRead} hitSlop={8}>
            <Ionicons name="checkmark-done" size={20} color={colors.primary} />
          </Pressable>
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: spacing.xl }}
        renderItem={({ item }) => (
          <Pressable style={[styles.row, !item.read && styles.rowUnread]} onPress={() => markRead(item.id)}>
            <View style={[styles.iconCircle, { backgroundColor: colorMap[item.type] + '20' }]}>
              <Ionicons name={iconMap[item.type]} size={18} color={colorMap[item.type]} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[type.bodyMedium, { color: colors.ink }]}>{item.title}</Text>
              <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]} numberOfLines={2}>{item.message}</Text>
              <Text style={[type.tiny, { color: colors.faint, marginTop: 4 }]}>{timeAgo(item.time)}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState icon="notifications-outline" title="No notifications" message="You're all caught up! We'll notify you about enquiries, bookings and reviews here." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.divider,
  },
  rowUnread: { backgroundColor: colors.primarySoft, borderColor: colors.primaryLight },
  iconCircle: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
});
