-- Encontre Um Database Schema
-- This script creates all tables with RLS policies

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  whatsapp_number TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'advertiser' CHECK (role IN ('admin', 'advertiser')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_public" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  listings_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_public" ON public.categories 
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_all" ON public.categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================
-- LISTINGS TABLE (core business entity)
-- =============================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  
  -- Contact Information
  phone_primary TEXT,
  phone_whatsapp TEXT,
  email TEXT,
  website TEXT,
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Hours (JSON format)
  business_hours JSONB DEFAULT '{}',
  
  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  business_card_image_url TEXT,
  gallery_urls JSONB DEFAULT '[]',
  
  -- Status & Plan
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'premium')),
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  clicks_whatsapp_count INTEGER DEFAULT 0,
  clicks_phone_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  featured_until TIMESTAMPTZ
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "listings_select_active" ON public.listings 
  FOR SELECT USING (status = 'active' OR owner_id = auth.uid());

CREATE POLICY "listings_insert_own" ON public.listings 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "listings_update_own" ON public.listings 
  FOR UPDATE USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "listings_delete_own" ON public.listings 
  FOR DELETE USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_approved" ON public.reviews 
  FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "reviews_insert_auth" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "reviews_update_own" ON public.reviews 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "reviews_admin_all" ON public.reviews 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================
-- ANALYTICS EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'whatsapp_click', 'phone_click', 'website_click')),
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_insert_public" ON public.analytics_events 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_select_owner" ON public.analytics_events 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE listings.id = listing_id AND listings.owner_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_listing ON public.analytics_events(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at);

-- =============================================
-- TRIGGER: Auto-update timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'role', 'advertiser')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNCTION: Increment listing views
-- =============================================
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings 
  SET views_count = views_count + 1 
  WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Increment WhatsApp clicks
-- =============================================
CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings 
  SET clicks_whatsapp_count = clicks_whatsapp_count + 1 
  WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEED: Default Categories
-- =============================================
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Dentistas', 'dentistas', 'tooth', 'Clínicas odontológicas e dentistas'),
  ('Mecânicos', 'mecanicos', 'wrench', 'Oficinas mecânicas e auto centers'),
  ('Restaurantes', 'restaurantes', 'utensils', 'Restaurantes, lanchonetes e delivery'),
  ('Advogados', 'advogados', 'scale', 'Escritórios de advocacia'),
  ('Médicos', 'medicos', 'stethoscope', 'Clínicas médicas e consultórios'),
  ('Eletricistas', 'eletricistas', 'zap', 'Serviços elétricos residenciais e comerciais'),
  ('Encanadores', 'encanadores', 'droplet', 'Serviços de encanamento e hidráulica'),
  ('Salões de Beleza', 'saloes-beleza', 'scissors', 'Salões, barbearias e estética'),
  ('Academias', 'academias', 'dumbbell', 'Academias e estúdios fitness'),
  ('Contadores', 'contadores', 'calculator', 'Escritórios de contabilidade'),
  ('Pet Shops', 'pet-shops', 'paw-print', 'Pet shops e clínicas veterinárias'),
  ('Imobiliárias', 'imobiliarias', 'home', 'Imobiliárias e corretores de imóveis')
ON CONFLICT (slug) DO NOTHING;
