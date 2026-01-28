"use client";

export type UserRole = "user" | "advertiser" | "admin";
export type ListingStatus = "pending" | "active" | "rejected" | "suspended";
export type SubscriptionTier = "free" | "basic" | "premium";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  listing_count: number;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  cover_url: string | null;
  gallery: string[];
  business_hours: BusinessHours | null;
  social_links: SocialLinks | null;
  status: ListingStatus;
  subscription_tier: SubscriptionTier;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  view_count: number;
  contact_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
  owner?: Profile;
}

export interface BusinessHours {
  monday?: { open: string; close: string } | null;
  tuesday?: { open: string; close: string } | null;
  wednesday?: { open: string; close: string } | null;
  thursday?: { open: string; close: string } | null;
  friday?: { open: string; close: string } | null;
  saturday?: { open: string; close: string } | null;
  sunday?: { open: string; close: string } | null;
}

export interface SocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
}

export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: Profile;
}

export interface AnalyticsEvent {
  id: string;
  listing_id: string;
  event_type: "view" | "whatsapp_click" | "phone_click" | "website_click" | "search_impression";
  user_agent: string | null;
  ip_hash: string | null;
  referrer: string | null;
  created_at: string;
}

export interface ListingWithDetails extends Listing {
  category: Category;
  reviews?: Review[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  state?: string;
  rating?: number;
  verified?: boolean;
}
