-- Capture acquisition attribution with searches and demand leads.

ALTER TABLE public.search_events
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS landing_path TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT;

ALTER TABLE public.demand_requests
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS landing_path TEXT;

ALTER TABLE public.search_events
  DROP CONSTRAINT IF EXISTS search_events_utm_source_length,
  ADD CONSTRAINT search_events_utm_source_length
    CHECK (utm_source IS NULL OR char_length(utm_source) <= 120),
  DROP CONSTRAINT IF EXISTS search_events_utm_medium_length,
  ADD CONSTRAINT search_events_utm_medium_length
    CHECK (utm_medium IS NULL OR char_length(utm_medium) <= 120),
  DROP CONSTRAINT IF EXISTS search_events_utm_campaign_length,
  ADD CONSTRAINT search_events_utm_campaign_length
    CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 160),
  DROP CONSTRAINT IF EXISTS search_events_landing_path_length,
  ADD CONSTRAINT search_events_landing_path_length
    CHECK (landing_path IS NULL OR char_length(landing_path) <= 240),
  DROP CONSTRAINT IF EXISTS search_events_referrer_length,
  ADD CONSTRAINT search_events_referrer_length
    CHECK (referrer IS NULL OR char_length(referrer) <= 500);

ALTER TABLE public.demand_requests
  DROP CONSTRAINT IF EXISTS demand_requests_utm_source_length,
  ADD CONSTRAINT demand_requests_utm_source_length
    CHECK (utm_source IS NULL OR char_length(utm_source) <= 120),
  DROP CONSTRAINT IF EXISTS demand_requests_utm_medium_length,
  ADD CONSTRAINT demand_requests_utm_medium_length
    CHECK (utm_medium IS NULL OR char_length(utm_medium) <= 120),
  DROP CONSTRAINT IF EXISTS demand_requests_utm_campaign_length,
  ADD CONSTRAINT demand_requests_utm_campaign_length
    CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 160),
  DROP CONSTRAINT IF EXISTS demand_requests_landing_path_length,
  ADD CONSTRAINT demand_requests_landing_path_length
    CHECK (landing_path IS NULL OR char_length(landing_path) <= 240);

CREATE INDEX IF NOT EXISTS idx_search_events_utm_source
  ON public.search_events(utm_source)
  WHERE utm_source IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_demand_requests_utm_source
  ON public.demand_requests(utm_source)
  WHERE utm_source IS NOT NULL;
