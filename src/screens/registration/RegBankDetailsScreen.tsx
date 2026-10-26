import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme';
import { Input } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegBankDetails'>;

export function RegBankDetailsScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const setBankDetails = useProviderStore((s) => s.setBankDetails);
  const goToStep = useProviderStore((s) => s.goToStep);

  const [accountHolder, setAccountHolder] = useState(provider.bankDetails?.accountHolder || provider.ownerName);
  const [accountNumber, setAccountNumber] = useState(provider.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState(provider.bankDetails?.ifsc || '');
  const [upiId, setUpiId] = useState(provider.bankDetails?.upiId ?? '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!accountHolder.trim() || !accountNumber.trim() || !ifsc.trim()) {
      setError('All bank fields except UPI are required');
      return;
    }
    setBankDetails({ accountHolder, accountNumber, ifsc, upiId: upiId || undefined });
    goToStep(7);
    navigation.navigate('RegReview');
  };

  return (
    <RegistrationLayout
      stepIndex={6}
      title="Where should we send payouts?"
      subtitle="Booking payments and settlements will be transferred to this account."
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      <View style={styles.noticeBox}>
        <Ionicons name="lock-closed" size={14} color={colors.info} />
        <Text style={[type.caption, { color: colors.info, marginLeft: 6, flex: 1 }]}>
          Your bank details are encrypted and only used for settlements.
        </Text>
      </View>

      <Input label="Account Holder Name" icon="person-outline" value={accountHolder} onChangeText={setAccountHolder} />
      <Input label="Account Number" icon="card-outline" keyboardType="number-pad" value={accountNumber} onChangeText={setAccountNumber} />
      <Input label="IFSC Code" icon="business-outline" autoCapitalize="characters" value={ifsc} onChangeText={setIfsc} placeholder="e.g. HDFC0001234" />
      <Input label="UPI ID (optional)" icon="phone-portrait-outline" autoCapitalize="none" value={upiId} onChangeText={setUpiId} placeholder="you@upi" />
      {!!error && <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>}
    </RegistrationLayout>
  );
}

const styles = StyleSheet.create({
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoSoft,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
});
