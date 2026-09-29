-- Maintain category supply counts from real active listings.

CREATE OR REPLACE FUNCTION public.refresh_category_listing_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.category_id IS NOT NULL THEN
    UPDATE public.categories c
    SET listings_count = (
      SELECT COUNT(*)::integer
      FROM public.listings l
      WHERE l.category_id = OLD.category_id
        AND l.status = 'active'
    )
    WHERE c.id = OLD.category_id;
  END IF;

  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.category_id IS NOT NULL THEN
    UPDATE public.categories c
    SET listings_count = (
      SELECT COUNT(*)::integer
      FROM public.listings l
      WHERE l.category_id = NEW.category_id
        AND l.status = 'active'
    )
    WHERE c.id = NEW.category_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_refresh_category_listing_counts ON public.listings;
CREATE TRIGGER trigger_refresh_category_listing_counts
  AFTER INSERT OR UPDATE OF category_id, status OR DELETE
  ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.refresh_category_listing_counts();

REVOKE EXECUTE ON FUNCTION public.refresh_category_listing_counts()
  FROM PUBLIC, anon, authenticated;

UPDATE public.categories c
SET listings_count = (
  SELECT COUNT(*)::integer
  FROM public.listings l
  WHERE l.category_id = c.id
    AND l.status = 'active'
);
