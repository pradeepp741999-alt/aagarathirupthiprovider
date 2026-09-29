import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type } from '../../theme';
import { Avatar, Card, ListRow, ProviderStatusBadge, RatingStars, VerifiedBadge } from '../../components';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useProviderStore } from '../../store/useProviderStore';
import { useAuthStore } from '../../store/useAuthStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'More'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function MoreScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const logout = useAuthStore((s) => s.logout);
  const startFresh = useProviderStore((s) => s.startFresh);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          startFresh();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.header}>
          <Avatar name={provider.businessName || 'Provider'} size={64} color={provider.logoColor} />
          <Text style={[type.h1, { color: colors.ink, marginTop: spacing.md }]}>{provider.businessName || 'Your Business'}</Text>
          <Text style={[type.body, { color: colors.muted, marginTop: 2 }]}>{provider.ownerName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 8 }}>
            {provider.verified ? <VerifiedBadge /> : <ProviderStatusBadge status={provider.status} compact />}
            <RatingStars rating={provider.rating} showValue reviewCount={provider.reviewCount} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.xl }}>
          <Text style={styles.groupTitle}>Business</Text>
          <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
            <ListRow icon="business-outline" label="Edit Profile" meta="Business name, tagline, description" onPress={() => navigation.navigate('EditProfile')} />
            <Divider />
            <ListRow icon="map-outline" label="Coverage & Categories" meta="Service areas and categories offered" onPress={() => navigation.navigate('BusinessSettings')} />
            <Divider />
            <ListRow icon="restaurant-outline" label="Manage Services" meta="Dishes, packages & pricing" onPress={() => navigation.navigate('ServicesManagement')} />
            <Divider />
            <ListRow icon="time-outline" label="Availability Calendar" onPress={() => navigation.navigate('AvailabilityCalendar')} />
            <Divider />
            <ListRow icon="document-text-outline" label="Verification Documents" onPress={() => navigation.navigate('Documents')} />
          </Card>

          <Text style={styles.groupTitle}>Growth</Text>
          <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
            <ListRow icon="stats-chart-outline" label="Reports & Analytics" onPress={() => navigation.navigate('Reports')} />
            <Divider />
            <ListRow icon="star-outline" label="Reviews & Ratings" onPress={() => navigation.navigate('Reviews')} />
            <Divider />
            <ListRow icon="wallet-outline" label="Earnings & Payouts" onPress={() => navigation.navigate('Earnings')} />
            <Divider />
            <ListRow icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
          </Card>

          <Text style={styles.groupTitle}>Support</Text>
          <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
            <ListRow icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('HelpSupport')} />
            <Divider />
            <ListRow
              icon="shield-checkmark-outline"
              label="Privacy & Security"
              onPress={() =>
                Alert.alert('Privacy & Security', 'Your bank and document details are encrypted. Customer contact details are only shared with you once an enquiry is submitted.')
              }
            />
          </Card>

          <Text style={styles.groupTitle}>Account</Text>
          <Card padded={false} style={{ paddingHorizontal: spacing.lg }}>
            <ListRow icon="log-out-outline" label="Log Out" onPress={handleLogout} danger showChevron={false} />
          </Card>
        </View>

        <Text style={[type.tiny, { color: colors.faint, textAlign: 'center', marginTop: spacing.xl }]}>
          Aagara Thirupthi Provider · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.divider }} />;
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  groupTitle: { ...type.caption, color: colors.muted, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase' },
});
