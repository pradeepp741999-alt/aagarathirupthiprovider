// Shared photography for the auth/registration flow — a single consistent
// image gives the provider onboarding journey a coherent identity, distinct
// from the customer app's photo but from the same warm-event visual world.
const AUTH_PHOTO_ID = 'photo-1533174072545-7a4b6ad7a6c3';

export function authPhoto(width: number, height: number) {
  return `https://images.unsplash.com/${AUTH_PHOTO_ID}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function avatarPlaceholder(seed: string) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
}
