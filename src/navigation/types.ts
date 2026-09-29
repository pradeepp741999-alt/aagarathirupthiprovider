import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Otp: { mobile: string };
};

export type RegistrationStackParamList = {
  RegBusinessInfo: undefined;
  RegCategory: undefined;
  RegServiceDetails: undefined;
  RegPricing: undefined;
  RegCoverageArea: undefined;
  RegDocuments: undefined;
  RegBankDetails: undefined;
  RegReview: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Enquiries: undefined;
  Bookings: undefined;
  Crm: undefined;
  More: undefined;
};

export type RootStackParamList = {
  AuthFlow: undefined;
  RegistrationFlow: undefined;
  PendingApproval: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ServicesManagement: { initialTab?: 'dishes' | 'packages' } | undefined;
  DishEditor: { dishId?: string } | undefined;
  PackageEditor: { packageId?: string } | undefined;
  AvailabilityCalendar: undefined;
  EnquiryDetail: { enquiryId: string };
  BookingDetail: { bookingId: string };
  Reviews: undefined;
  CustomerDetail: { customerId: string };
  Reports: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  BusinessSettings: undefined;
  Earnings: undefined;
  HelpSupport: undefined;
  Documents: undefined;
};
