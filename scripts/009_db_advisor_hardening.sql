-- Supabase advisor hardening.
-- Move admin helper out of the exposed public API schema and optimize RLS init plans.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role = 'advertiser'
  );

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_authorized" ON public.profiles;
CREATE POLICY "profiles_update_authorized"
  ON public.profiles FOR UPDATE TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  )
  WITH CHECK (
    id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE TO authenticated
  USING (id = (SELECT auth.uid()));

-- Categories: public read, admin write without a second SELECT policy.
DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_insert" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_update" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_delete" ON public.categories;

CREATE POLICY "categories_admin_insert"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "categories_admin_update"
  ON public.categories FOR UPDATE TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "categories_admin_delete"
  ON public.categories FOR DELETE TO authenticated
  USING ((SELECT private.is_admin()));

-- Listings
DROP POLICY IF EXISTS "listings_select_active" ON public.listings;
CREATE POLICY "listings_select_active"
  ON public.listings FOR SELECT
  USING (
    status = 'active'
    OR owner_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "listings_insert_own" ON public.listings;
CREATE POLICY "listings_insert_own"
  ON public.listings FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = (SELECT auth.uid())
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
  USING (
    owner_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  )
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "listings_delete_own" ON public.listings;
CREATE POLICY "listings_delete_own"
  ON public.listings FOR DELETE TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

-- Reviews
DROP POLICY IF EXISTS "reviews_select_approved" ON public.reviews;
CREATE POLICY "reviews_select_approved"
  ON public.reviews FOR SELECT
  USING (
    status = 'approved'
    OR user_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "reviews_insert_auth" ON public.reviews;
CREATE POLICY "reviews_insert_auth"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    AND status = 'pending'
    AND COALESCE(is_verified, false) = false
  );

DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR (SELECT private.is_admin())
  );

-- Operational tables
DROP POLICY IF EXISTS "analytics_select_owner" ON public.analytics_events;
CREATE POLICY "analytics_select_owner"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.listings
      WHERE listings.id = analytics_events.listing_id
        AND listings.owner_id = (SELECT auth.uid())
    )
    OR (SELECT private.is_admin())
  );

DROP POLICY IF EXISTS "demand_requests_select_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_select_admin"
  ON public.demand_requests FOR SELECT TO authenticated
  USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "demand_requests_update_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_update_admin"
  ON public.demand_requests FOR UPDATE TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "search_events_select_admin" ON public.search_events;
CREATE POLICY "search_events_select_admin"
  ON public.search_events FOR SELECT TO authenticated
  USING ((SELECT private.is_admin()));

-- Remove the old exposed helper after all policies point to private.is_admin().
DROP FUNCTION IF EXISTS public.is_admin();
