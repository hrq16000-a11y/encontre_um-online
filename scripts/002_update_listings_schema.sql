-- Migration: Update listings table to match architecture document
-- This migration renames columns to match the required schema

-- First, let's check if the table needs updating and make necessary changes

-- Rename 'name' to 'title' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'name') THEN
    ALTER TABLE listings RENAME COLUMN name TO title;
  END IF;
END $$;

-- Rename 'phone' to 'phone_primary' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'phone') THEN
    ALTER TABLE listings RENAME COLUMN phone TO phone_primary;
  END IF;
END $$;

-- Rename 'whatsapp' to 'phone_whatsapp' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'whatsapp') THEN
    ALTER TABLE listings RENAME COLUMN whatsapp TO phone_whatsapp;
  END IF;
END $$;

-- Rename 'address' to 'address_full' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'address') THEN
    ALTER TABLE listings RENAME COLUMN address TO address_full;
  END IF;
END $$;

-- Rename 'zip_code' to 'postal_code' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'zip_code') THEN
    ALTER TABLE listings RENAME COLUMN zip_code TO postal_code;
  END IF;
END $$;

-- Rename 'subscription_tier' to 'plan_tier' if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'subscription_tier') THEN
    ALTER TABLE listings RENAME COLUMN subscription_tier TO plan_tier;
  END IF;
END $$;

-- Add SEO fields if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'listings' AND column_name = 'seo_title') THEN
    ALTER TABLE listings ADD COLUMN seo_title text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'listings' AND column_name = 'seo_description') THEN
    ALTER TABLE listings ADD COLUMN seo_description text;
  END IF;
END $$;

-- Add business_card_url if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'listings' AND column_name = 'business_card_url') THEN
    ALTER TABLE listings ADD COLUMN business_card_url text;
  END IF;
END $$;

-- Add cover_image_url if it doesn't exist (rename from cover_photo_url if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'listings' AND column_name = 'cover_photo_url') THEN
    ALTER TABLE listings RENAME COLUMN cover_photo_url TO cover_image_url;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'listings' AND column_name = 'cover_image_url') THEN
    ALTER TABLE listings ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Create index on city/state for location searches
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(city, state);

-- Create composite index for common search patterns
CREATE INDEX IF NOT EXISTS idx_listings_search ON listings(status, city, category_id);

-- Update the RLS policies to handle new column names
-- (Policies don't need changes as they reference columns dynamically)

COMMIT;
