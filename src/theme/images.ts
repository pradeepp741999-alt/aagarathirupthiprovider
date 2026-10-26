// Shared photography for the auth/registration flow.
// Updated from dark confetti to warm event & stage decor photography (P9).
// When client provides the finalized custom image asset, update customOnboardingImage below.
export const customOnboardingImage: string | null = null;
const AUTH_PHOTO_ID = 'photo-1519741497674-611481863552';

export function authPhoto(width: number, height: number) {
  if (customOnboardingImage) return customOnboardingImage;
  return `https://images.unsplash.com/${AUTH_PHOTO_ID}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function avatarPlaceholder(seed: string) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
}
