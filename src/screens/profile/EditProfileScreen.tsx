import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';
import { Button, Input, ScreenHeader } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);

  const [businessName, setBusinessName] = useState(provider.businessName);
  const [ownerName, setOwnerName] = useState(provider.ownerName);
  const [whatsapp, setWhatsapp] = useState(provider.whatsapp);
  const [email, setEmail] = useState(provider.email ?? '');
  const [tagline, setTagline] = useState(provider.tagline);
  const [description, setDescription] = useState(provider.description);
  const [yearsActive, setYearsActive] = useState(String(provider.yearsActive));

  const handleSave = () => {
    updateProvider({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      tagline: tagline.trim(),
      description: description.trim(),
      yearsActive: Number(yearsActive) || 0,
    });
    Alert.alert('Saved', 'Your profile has been updated.');
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }}>
        <Input label="Business / Brand Name" icon="business-outline" value={businessName} onChangeText={setBusinessName} />
        <Input label="Owner Full Name" icon="person-outline" value={ownerName} onChangeText={setOwnerName} />
        <Input label="WhatsApp Number" icon="logo-whatsapp" keyboardType="number-pad" maxLength={10} prefix="+91" value={whatsapp} onChangeText={(v) => setWhatsapp(v.replace(/\D/g, ''))} />
        <Input label="Email" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Input label="Tagline" icon="pricetag-outline" value={tagline} onChangeText={setTagline} maxLength={70} />
        <Input
          label="About your business"
          icon="document-text-outline"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
        />
        <Input label="Years in Business" icon="calendar-outline" keyboardType="number-pad" value={yearsActive} onChangeText={(v) => setYearsActive(v.replace(/\D/g, ''))} />

        <Button label="Save Changes" fullWidth size="lg" onPress={handleSave} />
      </ScrollView>
    </View>
  );
}
