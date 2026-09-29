import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { Input } from '../../components';
import { useProviderStore } from '../../store/useProviderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { RegistrationLayout } from './RegistrationLayout';

type Props = NativeStackScreenProps<RegistrationStackParamList, 'RegBusinessInfo'>;

export function RegBusinessInfoScreen({ navigation }: Props) {
  const provider = useProviderStore((s) => s.provider);
  const updateProvider = useProviderStore((s) => s.updateProvider);
  const goToStep = useProviderStore((s) => s.goToStep);
  const mobile = useAuthStore((s) => s.mobile);

  const [businessName, setBusinessName] = useState(provider.businessName);
  const [ownerName, setOwnerName] = useState(provider.ownerName);
  const [whatsapp, setWhatsapp] = useState(provider.whatsapp || mobile);
  const [email, setEmail] = useState(provider.email ?? '');
  const [tagline, setTagline] = useState(provider.tagline);
  const [description, setDescription] = useState(provider.description);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!businessName.trim() || !ownerName.trim()) {
      setError('Business name and owner name are required');
      return;
    }
    updateProvider({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      mobile: provider.mobile || mobile,
      whatsapp: whatsapp.trim() || mobile,
      email: email.trim() || undefined,
      tagline: tagline.trim(),
      description: description.trim(),
    });
    goToStep(1);
    navigation.navigate('RegCategory');
  };

  return (
    <RegistrationLayout
      stepIndex={0}
      title="Tell us about your business"
      subtitle="This information will appear on your public provider profile."
      onContinue={handleContinue}
    >
      <Input label="Business / Brand Name" icon="business-outline" value={businessName} onChangeText={setBusinessName} placeholder="e.g. Sree Annapoorna Catering" error={error && !businessName.trim() ? error : undefined} />
      <Input label="Owner Full Name" icon="person-outline" value={ownerName} onChangeText={setOwnerName} placeholder="e.g. Karthik Subramaniam" error={error && !ownerName.trim() ? error : undefined} />
      <Input label="Mobile Number" icon="call-outline" value={provider.mobile || mobile} editable={false} prefix="+91" />
      <Input label="WhatsApp Number" icon="logo-whatsapp" keyboardType="number-pad" maxLength={10} value={whatsapp} onChangeText={(v) => setWhatsapp(v.replace(/\D/g, ''))} prefix="+91" />
      <Input label="Email (optional)" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} placeholder="you@business.com" />
      <Input label="Tagline" icon="pricetag-outline" value={tagline} onChangeText={setTagline} placeholder="e.g. Authentic Tamil wedding catering since 2014" maxLength={70} />
      <Input
        label="About your business"
        icon="document-text-outline"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your experience, specialties and what makes you stand out..."
        multiline
        numberOfLines={4}
        style={{ minHeight: 90, textAlignVertical: 'top' }}
      />
    </RegistrationLayout>
  );
}
