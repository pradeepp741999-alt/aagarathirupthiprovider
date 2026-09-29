import { ServiceCategory } from './types';
import { colors } from '../theme';

// Kept identical to the customer app's category set so a provider's listing
// always matches what customers can search/filter by.
export const categories: ServiceCategory[] = [
  {
    id: 'catering',
    name: 'Catering',
    tagline: 'Menus, dishes & packages for any headcount',
    icon: 'restaurant',
    color: colors.primary,
  },
  {
    id: 'decoration',
    name: 'Decoration',
    tagline: 'Stage, entrance & venue styling',
    icon: 'flower',
    color: colors.secondary,
  },
  {
    id: 'audio',
    name: 'Audio & Sound',
    tagline: 'Speakers, mics & stage audio setup',
    icon: 'mic',
    color: colors.gold,
  },
];

export const futureCategories = [
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'videography', name: 'Videography', icon: 'videocam' },
  { id: 'lighting', name: 'Lighting', icon: 'bulb' },
  { id: 'makeup', name: 'Makeup', icon: 'color-palette' },
  { id: 'planning', name: 'Event Planning', icon: 'calendar' },
  { id: 'transport', name: 'Transportation', icon: 'car' },
  { id: 'music', name: 'Music / DJ', icon: 'musical-notes' },
  { id: 'rentals', name: 'Rentals', icon: 'cube' },
];

export const dishCategories = ['Rice', 'Curries', 'Non-Veg', 'Sweets', 'Drinks', 'Starters', 'Sides'];
