import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button } from '../../components';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const highlights = [
  { icon: 'people', text: 'Grow your business with a steady stream of enquiries' },
  { icon: 'stats-chart', text: 'Track bookings, revenue & reviews from one dashboard' },
  { icon: 'chatbubbles', text: 'Respond to customers and manage your CRM in one place' },
] as const;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <ImageBackground source={{ uri: authPhoto(1200, 1800) }} style={{ flex: 1 }}>
      <LinearGradient
        colors={['rgba(18,26,25,0.35)', 'rgba(18,26,25,0.82)', colors.ink]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="briefcase" size={22} color={colors.white} />
          </View>
          <Text style={styles.brand}>Aagara Thirupthi{'\n'}Provider</Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Run your event{'\n'}service business here</Text>
          <Text style={styles.subtitle}>
            Register once, manage your services, respond to enquiries, track bookings and grow with real customer reviews — all in one app.
          </Text>

          <View style={{ marginTop: spacing.xl }}>
            {highlights.map((h) => (
              <View key={h.text} style={styles.highlightRow}>
                <View style={styles.highlightIcon}>
                  <Ionicons name={h.icon} size={16} color={colors.primary} />
                </View>
                <Text style={styles.highlightText}>{h.text}</Text>
              </View>
            ))}
          </View>

          <Button
            label="Get Started"
            icon="arrow-forward"
            iconPosition="right"
            fullWidth
            size="lg"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brand: { ...type.h3, color: colors.white },
  bottomSheet: { paddingBottom: spacing.xl },
  title: { ...type.display, fontSize: 30, lineHeight: 36, color: colors.white, marginBottom: spacing.sm },
  subtitle: { ...type.body, color: 'rgba(255,255,255,0.8)' },
  highlightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  highlightIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  highlightText: { ...type.bodyMedium, color: colors.white, flex: 1 },
});
