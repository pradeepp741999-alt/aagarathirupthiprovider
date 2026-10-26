import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from './types';
import { RegBusinessInfoScreen } from '../screens/registration/RegBusinessInfoScreen';
import { RegCategoryScreen } from '../screens/registration/RegCategoryScreen';
import { RegServiceDetailsScreen } from '../screens/registration/RegServiceDetailsScreen';
import { RegPricingScreen } from '../screens/registration/RegPricingScreen';
import { RegCoverageAreaScreen } from '../screens/registration/RegCoverageAreaScreen';
import { RegDocumentsScreen } from '../screens/registration/RegDocumentsScreen';
import { RegReviewScreen } from '../screens/registration/RegReviewScreen';

const Stack = createNativeStackNavigator<RegistrationStackParamList>();

export function RegistrationNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="RegBusinessInfo" component={RegBusinessInfoScreen} />
      <Stack.Screen name="RegCategory" component={RegCategoryScreen} />
      <Stack.Screen name="RegServiceDetails" component={RegServiceDetailsScreen} />
      <Stack.Screen name="RegPricing" component={RegPricingScreen} />
      <Stack.Screen name="RegCoverageArea" component={RegCoverageAreaScreen} />
      <Stack.Screen name="RegDocuments" component={RegDocumentsScreen} />
      <Stack.Screen name="RegReview" component={RegReviewScreen} />
    </Stack.Navigator>
  );
}
