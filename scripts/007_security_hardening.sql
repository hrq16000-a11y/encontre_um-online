-- EncontreUm.online security hardening.
-- Keep authorization in the database, not only in the UI.

-- Admin helper that safely bypasses profiles RLS for role checks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Signup must never trust client-provided role metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(
      new.raw_user_meta_data ->> 'whatsapp_number',
      new.raw_user_meta_data ->> 'phone'
    ),
    'advertiser'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    whatsapp_number = COALESCE(EXCLUDED.whatsapp_number, public.profiles.whatsapp_number),
    updated_at = NOW();
  RETURN new;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Prevent self-promotion through profile updates.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'role changes require admin privileges';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;
CREATE TRIGGER trigger_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

REVOKE EXECUTE ON FUNCTION public.protect_profile_role() FROM PUBLIC, anon, authenticated;

-- Protect listing approval, monetization and counters from advertiser changes.
CREATE OR REPLACE FUNCTION public.protect_listing_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() AND (
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

DROP TRIGGER IF EXISTS trigger_protect_listing_privileged_fields ON public.listings;
CREATE TRIGGER trigger_protect_listing_privileged_fields
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.protect_listing_privileged_fields();

REVOKE EXECUTE ON FUNCTION public.protect_listing_privileged_fields() FROM PUBLIC, anon, authenticated;

-- Reviews cannot self-approve or self-verify.
CREATE OR REPLACE FUNCTION public.protect_review_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() AND (
    NEW.status IS DISTINCT FROM OLD.status
    OR NEW.is_verified IS DISTINCT FROM OLD.is_verified
  ) THEN
    RAISE EXCEPTION 'review moderation fields require admin privileges';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_protect_review_privileged_fields ON public.reviews;
CREATE TRIGGER trigger_protect_review_privileged_fields
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.protect_review_privileged_fields();

REVOKE EXECUTE ON FUNCTION public.protect_review_privileged_fields() FROM PUBLIC, anon, authenticated;

-- Keep counters derived from events, avoiding client-controlled counters.
CREATE OR REPLACE FUNCTION public.sync_listing_counters()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.event_type = 'view' THEN
    UPDATE public.listings
      SET views_count = COALESCE(views_count, 0) + 1
      WHERE id = NEW.listing_id;
  ELSIF NEW.event_type = 'whatsapp_click' THEN
    UPDATE public.listings
      SET clicks_whatsapp_count = COALESCE(clicks_whatsapp_count, 0) + 1
      WHERE id = NEW.listing_id;
  ELSIF NEW.event_type = 'phone_click' THEN
    UPDATE public.listings
      SET clicks_phone_count = COALESCE(clicks_phone_count, 0) + 1
      WHERE id = NEW.listing_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_listing_counters ON public.analytics_events;
CREATE TRIGGER trigger_sync_listing_counters
  AFTER INSERT ON public.analytics_events
  FOR EACH ROW EXECUTE FUNCTION public.sync_listing_counters();

REVOKE EXECUTE ON FUNCTION public.sync_listing_counters() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.increment_listing_views(UUID);
DROP FUNCTION IF EXISTS public.increment_whatsapp_clicks(UUID);

-- Profiles: private by default, own record or admin only.
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'advertiser');

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE TO authenticated
  USING (id = auth.uid());

-- Listings: public active listings; owner/admin private access.
DROP POLICY IF EXISTS "listings_select_active" ON public.listings;
CREATE POLICY "listings_select_active"
  ON public.listings FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "listings_insert_own" ON public.listings;
CREATE POLICY "listings_insert_own"
  ON public.listings FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND status = 'pending'
    AND plan_tier = 'free'
    AND COALESCE(views_count, 0) = 0
    AND COALESCE(clicks_whatsapp_count, 0) = 0
    AND COALESCE(clicks_phone_count, 0) = 0
    AND approved_at IS NULL
    AND featured_until IS NULL
  );

DROP POLICY IF EXISTS "listings_update_own" ON public.listings;
CREATE POLICY "listings_update_own"
  ON public.listings FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin())
  WITH CHECK (owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "listings_delete_own" ON public.listings;
CREATE POLICY "listings_delete_own"
  ON public.listings FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin());

-- Reviews: public only when approved; author/admin can see theirs.
DROP POLICY IF EXISTS "reviews_select_approved" ON public.reviews;
CREATE POLICY "reviews_select_approved"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "reviews_insert_auth" ON public.reviews;
CREATE POLICY "reviews_insert_auth"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (user_id IS NULL OR user_id = auth.uid())
    AND status = 'pending'
    AND COALESCE(is_verified, false) = false
  );

DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "reviews_admin_all" ON public.reviews;

-- Admin-only operational data.
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write"
  ON public.categories FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "analytics_select_owner" ON public.analytics_events;
CREATE POLICY "analytics_select_owner"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = analytics_events.listing_id
        AND listings.owner_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "demand_requests_select_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_select_admin"
  ON public.demand_requests FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "demand_requests_update_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_update_admin"
  ON public.demand_requests FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "search_events_select_admin" ON public.search_events;
CREATE POLICY "search_events_select_admin"
  ON public.search_events FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
