-- Bound public-input tables so direct PostgREST access cannot bypass API validation.

ALTER TABLE public.demand_requests
  DROP CONSTRAINT IF EXISTS demand_requests_query_length,
  ADD CONSTRAINT demand_requests_query_length
    CHECK (char_length(query) BETWEEN 2 AND 160),
  DROP CONSTRAINT IF EXISTS demand_requests_city_length,
  ADD CONSTRAINT demand_requests_city_length
    CHECK (city IS NULL OR char_length(city) <= 120),
  DROP CONSTRAINT IF EXISTS demand_requests_name_length,
  ADD CONSTRAINT demand_requests_name_length
    CHECK (requester_name IS NULL OR char_length(requester_name) <= 100),
  DROP CONSTRAINT IF EXISTS demand_requests_whatsapp_length,
  ADD CONSTRAINT demand_requests_whatsapp_length
    CHECK (
      char_length(whatsapp) <= 40
      AND char_length(regexp_replace(whatsapp, '\D', '', 'g')) BETWEEN 10 AND 15
    ),
  DROP CONSTRAINT IF EXISTS demand_requests_source_path_length,
  ADD CONSTRAINT demand_requests_source_path_length
    CHECK (source_path IS NULL OR char_length(source_path) <= 240),
  DROP CONSTRAINT IF EXISTS demand_requests_referrer_length,
  ADD CONSTRAINT demand_requests_referrer_length
    CHECK (referrer IS NULL OR char_length(referrer) <= 500),
  DROP CONSTRAINT IF EXISTS demand_requests_user_agent_length,
  ADD CONSTRAINT demand_requests_user_agent_length
    CHECK (user_agent IS NULL OR char_length(user_agent) <= 500);

ALTER TABLE public.search_events
  DROP CONSTRAINT IF EXISTS search_events_query_length,
  ADD CONSTRAINT search_events_query_length
    CHECK (query IS NULL OR char_length(query) <= 160),
  DROP CONSTRAINT IF EXISTS search_events_city_length,
  ADD CONSTRAINT search_events_city_length
    CHECK (city IS NULL OR char_length(city) <= 120),
  DROP CONSTRAINT IF EXISTS search_events_category_length,
  ADD CONSTRAINT search_events_category_length
    CHECK (category_slug IS NULL OR char_length(category_slug) <= 120),
  DROP CONSTRAINT IF EXISTS search_events_source_path_length,
  ADD CONSTRAINT search_events_source_path_length
    CHECK (source_path IS NULL OR char_length(source_path) <= 240),
  DROP CONSTRAINT IF EXISTS search_events_user_agent_length,
  ADD CONSTRAINT search_events_user_agent_length
    CHECK (user_agent IS NULL OR char_length(user_agent) <= 500),
  DROP CONSTRAINT IF EXISTS search_events_non_empty_signal,
  ADD CONSTRAINT search_events_non_empty_signal
    CHECK (
      NULLIF(btrim(query), '') IS NOT NULL
      OR NULLIF(btrim(city), '') IS NOT NULL
      OR NULLIF(btrim(category_slug), '') IS NOT NULL
    );

ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_user_agent_length,
  ADD CONSTRAINT analytics_events_user_agent_length
    CHECK (user_agent IS NULL OR char_length(user_agent) <= 500),
  DROP CONSTRAINT IF EXISTS analytics_events_ip_hash_length,
  ADD CONSTRAINT analytics_events_ip_hash_length
    CHECK (ip_hash IS NULL OR char_length(ip_hash) <= 128);
