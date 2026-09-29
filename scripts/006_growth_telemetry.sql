-- Growth telemetry and safe initial taxonomy for EncontreUm.online.

UPDATE public.categories SET icon = '🦷' WHERE slug = 'dentistas';
UPDATE public.categories SET icon = '🚗' WHERE slug = 'mecanicos';
UPDATE public.categories SET icon = '🍽️' WHERE slug = 'restaurantes';
UPDATE public.categories SET icon = '⚖️' WHERE slug = 'advogados';
UPDATE public.categories SET icon = '🩺' WHERE slug = 'medicos';
UPDATE public.categories SET icon = '⚡' WHERE slug = 'eletricistas';
UPDATE public.categories SET icon = '🔧' WHERE slug = 'encanadores';
UPDATE public.categories SET icon = '✂️' WHERE slug = 'saloes-beleza';
UPDATE public.categories SET icon = '🏋️' WHERE slug = 'academias';
UPDATE public.categories SET icon = '🧮' WHERE slug = 'contadores';
UPDATE public.categories SET icon = '🐾' WHERE slug = 'pet-shops';
UPDATE public.categories SET icon = '🏠' WHERE slug = 'imobiliarias';

INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Assistência Técnica', 'assistencia-tecnica', '🛠️', 'Assistência técnica e reparos'),
  ('Informática', 'informatica', '💻', 'Suporte, manutenção e serviços de informática'),
  ('Ar Condicionado', 'ar-condicionado', '❄️', 'Instalação, manutenção e limpeza de ar-condicionado'),
  ('Montadores de Móveis', 'montadores-de-moveis', '🪑', 'Montagem, desmontagem e ajustes de móveis'),
  ('Limpeza', 'limpeza', '🧹', 'Serviços de limpeza residencial e comercial'),
  ('Pintores', 'pintores', '🎨', 'Pintura residencial e comercial'),
  ('Construção e Reformas', 'construcao-reformas', '🏗️', 'Construção, reformas e manutenção predial'),
  ('Barbearias', 'barbearias', '💈', 'Barbearias e cuidados masculinos'),
  ('Lojas e Comércio Local', 'lojas-comercio-local', '🏪', 'Lojas, varejo e comércio de bairro')
ON CONFLICT DO NOTHING;

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
      SELECT 1 FROM public.profiles
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
CREATE INDEX IF NOT EXISTS idx_search_events_query
  ON public.search_events(query);

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
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
