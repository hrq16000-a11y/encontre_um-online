-- Growth foundation for EncontreUm.online
-- Idempotent and compatible with the existing database.

-- 1) Keep only genuinely missing taxonomy entries.
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Pedreiros', 'pedreiros', '🧱', 'Construção, reforma, alvenaria e pequenos reparos'),
  ('Outros Serviços', 'outros-servicos', '🧰', 'Outros profissionais e serviços locais')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description;

-- 2) Persist WhatsApp from signup metadata into the profile.
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
    COALESCE(new.raw_user_meta_data ->> 'role', 'advertiser')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    whatsapp_number = COALESCE(EXCLUDED.whatsapp_number, public.profiles.whatsapp_number),
    updated_at = NOW();
  RETURN new;
END;
$$;

-- 3) Capture every meaningful search, not only zero-result leads.
CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT,
  city TEXT,
  category_slug TEXT,
  result_count INTEGER NOT NULL DEFAULT 0 CHECK (result_count >= 0),
  source_path TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "search_events_insert_public" ON public.search_events;
CREATE POLICY "search_events_insert_public"
  ON public.search_events
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "search_events_select_admin" ON public.search_events;
CREATE POLICY "search_events_select_admin"
  ON public.search_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_search_events_created_at
  ON public.search_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_events_city
  ON public.search_events(city);

CREATE INDEX IF NOT EXISTS idx_search_events_category_slug
  ON public.search_events(category_slug);
