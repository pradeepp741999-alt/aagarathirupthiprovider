// Core domain types for the Provider Portal — mirrors the conceptual data
// model in the product doc (Provider, Service Category, Service, Menu, Dish,
// Package, Availability, Enquiry, Booking, Rating/Review, Notification) from
// the provider's point of view, plus the CRM/reporting layer providers need
// to run their business inside one app.

export type ServiceCategoryId = 'catering' | 'decoration' | 'audio' | 'makeup';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  tagline: string;
  icon: string; // Ionicons name
  color: string;
  comingSoon?: boolean;
}

export interface District {
  id: string;
  name: string;
  state: string;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'partial' | 'enquire';

export type PricingModel = 'per_dish' | 'per_person' | 'package' | 'custom';

export interface Dish {
  id: string;
  name: string;
  category: string; // e.g. Rice, Curries, Sweets, Non-Veg, Drinks
  price: number;
  veg: boolean;
  popular?: boolean;
  active: boolean;
  photo?: string;
}

export interface SpecialCombo {
  id: string;
  name: string;
  description?: string;
  includedItems: string[];
  price: number;
  originalPrice?: number;
  image?: string;
  validUntil: string;
  active: boolean;
}

export interface MenuPackage {
  id: string;
  name: string;
  pricePerPerson: number;
  minGuests: number;
  includes: string[];
  veg: boolean;
  active: boolean;
}

export interface ReviewBreakdown {
  quality: number;
  communication: number;
  value: number;
  timeliness: number;
}

export interface Review {
  id: string;
  customerName: string;
  avatarColor: string;
  rating: number; // 1-5
  date: string;
  eventType: string;
  comment: string;
  breakdown?: ReviewBreakdown;
  providerReply?: { message: string; date: string };
}

export type ProviderStatus = 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';

export interface DocumentItem {
  id: string;
  label: string;
  required: boolean;
  status: 'missing' | 'uploaded' | 'verified' | 'rejected';
  fileName?: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upiId?: string;
}

export interface ServiceArea {
  district: string;
  areas: string[];
  travelDistanceKm: number;
}

export interface ProviderProfile {
  id: string;
  businessName: string;
  ownerName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  category: ServiceCategoryId;
  secondaryCategories: ServiceCategoryId[];
  tagline: string;
  description: string;
  coverImage: string;
  logoColor: string;
  district: string;
  areas: string[];
  serviceAreas: ServiceArea[];
  minCapacity: number;
  maxCapacity: number;
  pricingModel: PricingModel;
  startingPrice: number;
  veg: 'veg' | 'non_veg' | 'both';
  yearsActive: number;
  status: ProviderStatus;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseTime: string;
  documents: DocumentItem[];
  bankDetails?: BankDetails;
  registrationStep: number; // 0-7, drives resume-where-you-left-off
  portfolio: string[];
}

export type AvailabilityDayStatus = 'available' | 'unavailable' | 'partial' | 'booked';

export interface AvailabilityDay {
  date: string; // ISO date
  status: AvailabilityDayStatus;
  note?: string;
}

export interface EventRequirement {
  eventType: string;
  eventDate: string;
  district: string;
  location: string;
  guestCount: number;
  category: ServiceCategoryId;
  budgetMin: number;
  budgetMax: number;
  notes?: string;
}

export interface EnquiryItem {
  dishId?: string;
  packageId?: string;
  name: string;
  price: number;
  qty: number;
}

export type EnquiryStatus =
  | 'new'
  | 'reviewing'
  | 'responded'
  | 'confirmation_pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface CommunicationEntry {
  id: string;
  author: 'provider' | 'customer' | 'system';
  message: string;
  at: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  customerMobile: string;
  customerWhatsapp: string;
  avatarColor: string;
  category: ServiceCategoryId;
  createdAt: string;
  eventType: string;
  eventDate: string;
  location: string;
  district: string;
  guestCount: number;
  items: EnquiryItem[];
  estimatedTotal: number;
  notes?: string;
  status: EnquiryStatus;
  quote?: number;
  quoteMessage?: string;
  timeline: CommunicationEntry[];
  hasReview?: boolean;
  isNewLead?: boolean;
}

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  enquiryId: string;
  customerName: string;
  customerMobile: string;
  category: ServiceCategoryId;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: number;
  amount: number;
  status: BookingStatus;
  createdAt: string;
}

// CRM: every customer who has ever enquired/booked becomes a "lead" the
// provider can track through a simple pipeline, independent of individual
// enquiry status — this is what lets a provider run relationship follow-ups
// rather than one-off transactional replies.
export type CrmStage = 'new_lead' | 'contacted' | 'quoted' | 'booked' | 'completed' | 'lost';

export interface CrmNote {
  id: string;
  message: string;
  at: string;
}

export interface CrmCustomer {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  avatarColor: string;
  stage: CrmStage;
  totalEnquiries: number;
  totalBookings: number;
  lifetimeValue: number;
  lastContactAt: string;
  tags: string[];
  notes: CrmNote[];
  enquiryIds: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'enquiry' | 'booking' | 'review' | 'system' | 'approval';
}

export interface ReportPoint {
  label: string;
  value: number;
}
