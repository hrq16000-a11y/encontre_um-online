-- EncontreUm.online demand capture
-- Captures unmet visitor intent so zero-result searches become commercial opportunities.

CREATE TABLE IF NOT EXISTS public.demand_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  city TEXT,
  requester_name TEXT,
  whatsapp TEXT NOT NULL,
  source_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'matched', 'contacted', 'closed', 'spam')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.demand_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demand_requests_insert_public" ON public.demand_requests;
CREATE POLICY "demand_requests_insert_public"
  ON public.demand_requests
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "demand_requests_select_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_select_admin"
  ON public.demand_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "demand_requests_update_admin" ON public.demand_requests;
CREATE POLICY "demand_requests_update_admin"
  ON public.demand_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_demand_requests_created_at
  ON public.demand_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_demand_requests_status
  ON public.demand_requests(status);

CREATE INDEX IF NOT EXISTS idx_demand_requests_city
  ON public.demand_requests(city);

DROP TRIGGER IF EXISTS trigger_demand_requests_updated_at ON public.demand_requests;
CREATE TRIGGER trigger_demand_requests_updated_at
  BEFORE UPDATE ON public.demand_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
