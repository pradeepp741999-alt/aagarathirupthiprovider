import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { RegistrationNavigator } from './RegistrationNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';
import { useProviderStore } from '../store/useProviderStore';
import { registrationSteps } from '../store/useProviderStore';

import { PendingApprovalScreen } from '../screens/auth/PendingApprovalScreen';
import { ServicesManagementScreen } from '../screens/services/ServicesManagementScreen';
import { DishEditorScreen } from '../screens/services/DishEditorScreen';
import { PackageEditorScreen } from '../screens/services/PackageEditorScreen';
import { ComboEditorScreen } from '../screens/services/ComboEditorScreen';
import { AvailabilityCalendarScreen } from '../screens/services/AvailabilityCalendarScreen';
import { EnquiryDetailScreen } from '../screens/enquiries/EnquiryDetailScreen';
import { BookingDetailScreen } from '../screens/bookings/BookingDetailScreen';
import { ReviewsScreen } from '../screens/reviews/ReviewsScreen';
import { CustomerDetailScreen } from '../screens/crm/CustomerDetailScreen';
import { ReportsScreen } from '../screens/reports/ReportsScreen';
import { NotificationsScreen } from '../screens/home/NotificationsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { BusinessSettingsScreen } from '../screens/profile/BusinessSettingsScreen';
import { EarningsScreen } from '../screens/profile/EarningsScreen';
import { HelpSupportScreen } from '../screens/profile/HelpSupportScreen';
import { DocumentsScreen } from '../screens/profile/DocumentsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const provider = useProviderStore((s) => s.provider);

  React.useEffect(() => {
    checkSession().catch(() => {});
  }, []);

  const registrationComplete = provider.registrationStep >= registrationSteps.length;
  const isLive = provider.status === 'approved';

  let phase: 'auth' | 'registration' | 'pending' | 'live';
  if (!isAuthenticated) phase = 'auth';
  else if (isLive) phase = 'live';
  else if (registrationComplete) phase = 'pending';
  else phase = 'registration';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {phase === 'auth' && <Stack.Screen name="AuthFlow" component={AuthNavigator} />}
      {phase === 'registration' && <Stack.Screen name="RegistrationFlow" component={RegistrationNavigator} />}
      {phase === 'pending' && <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />}
      {phase === 'live' && (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="ServicesManagement" component={ServicesManagementScreen} />
          <Stack.Screen name="DishEditor" component={DishEditorScreen} />
          <Stack.Screen name="PackageEditor" component={PackageEditorScreen} />
          <Stack.Screen name="ComboEditor" component={ComboEditorScreen} />
          <Stack.Screen name="AvailabilityCalendar" component={AvailabilityCalendarScreen} />
          <Stack.Screen name="EnquiryDetail" component={EnquiryDetailScreen} />
          <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
          <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="BusinessSettings" component={BusinessSettingsScreen} />
          <Stack.Screen name="Earnings" component={EarningsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
