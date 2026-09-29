-- Keep trigger-level authorization aligned with private.is_admin().

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'role changes require admin privileges';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_listing_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF NOT private.is_admin() AND (
    NEW.status IS DISTINCT FROM OLD.status
    OR NEW.plan_tier IS DISTINCT FROM OLD.plan_tier
    OR NEW.views_count IS DISTINCT FROM OLD.views_count
    OR NEW.clicks_whatsapp_count IS DISTINCT FROM OLD.clicks_whatsapp_count
    OR NEW.clicks_phone_count IS DISTINCT FROM OLD.clicks_phone_count
    OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
    OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
  ) THEN
    RAISE EXCEPTION 'privileged listing fields require admin privileges';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_review_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF NOT private.is_admin() AND (
    NEW.status IS DISTINCT FROM OLD.status
    OR NEW.is_verified IS DISTINCT FROM OLD.is_verified
  ) THEN
    RAISE EXCEPTION 'review moderation fields require admin privileges';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_profile_role()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_listing_privileged_fields()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_review_privileged_fields()
  FROM PUBLIC, anon, authenticated;
