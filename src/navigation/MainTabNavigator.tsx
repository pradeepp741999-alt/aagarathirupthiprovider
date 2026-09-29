import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { EnquiriesListScreen } from '../screens/enquiries/EnquiriesListScreen';
import { BookingsListScreen } from '../screens/bookings/BookingsListScreen';
import { CustomersScreen } from '../screens/crm/CustomersScreen';
import { MoreScreen } from '../screens/profile/MoreScreen';
import { useEnquiryStore } from '../store/useEnquiryStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Enquiries: { active: 'document-text', inactive: 'document-text-outline' },
  Bookings: { active: 'calendar', inactive: 'calendar-outline' },
  Crm: { active: 'people', inactive: 'people-outline' },
  More: { active: 'grid', inactive: 'grid-outline' },
};

export function MainTabNavigator() {
  const newLeadCount = useEnquiryStore((s) => s.enquiries.filter((e) => e.status === 'new').length);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: type.caption.fontFamily, fontSize: 10.5, marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarStyle: [styles.tabBar, { height: 58 + insets.bottom, paddingBottom: insets.bottom + 6 }],
        tabBarIcon: ({ focused, color, size }) => {
          const meta = icons[route.name as keyof MainTabParamList];
          return (
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Ionicons name={focused ? meta.active : meta.inactive} size={size - 2} color={color} />
            </View>
          );
        },
        tabBarBadge: route.name === 'Enquiries' && newLeadCount > 0 ? newLeadCount : undefined,
        tabBarBadgeStyle: { backgroundColor: colors.danger, fontSize: 10 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Enquiries" component={EnquiriesListScreen} options={{ title: 'Enquiries' }} />
      <Tab.Screen name="Bookings" component={BookingsListScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Crm" component={CustomersScreen} options={{ title: 'Customers' }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activeIconWrap: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
