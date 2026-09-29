"use client";

export type UserRole = "advertiser" | "admin";
export type ListingStatus = "pending" | "active" | "rejected" | "suspended";
export type SubscriptionTier = "free" | "premium";

export interface Profile {
  id: string;
  full_name: string | null;
  whatsapp_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  listings_count?: number | null;
  created_at?: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  phone_primary: string | null;
  phone_whatsapp: string | null;
  email: string | null;
  website: string | null;
  address_full: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  cover_image_url: string | null;
  business_card_image_url: string | null;
  business_card_url: string | null;
  gallery_urls: string[] | null;
  business_hours: BusinessHours | null;
  status: ListingStatus;
  plan_tier: SubscriptionTier;
  views_count: number | null;
  clicks_whatsapp_count: number | null;
  clicks_phone_count: number | null;
  seo_title: string | null;
  seo_description: string | null;
  approved_at: string | null;
  featured_until: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  owner?: Profile | null;
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

export interface Review {
  id: string;
  listing_id: string;
  user_id: string | null;
  author_name: string | null;
  rating: number;
  comment: string | null;
  is_verified: boolean | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user?: Profile | null;
}

export interface AnalyticsEvent {
  id: string;
  listing_id: string;
  event_type: "view" | "whatsapp_click" | "phone_click" | "website_click";
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface ListingWithDetails extends Listing {
  category?: Category | null;
  reviews?: Review[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  state?: string;
}
