-- Align current database with the runtime field names used by EncontreUm.online.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'listings'
      AND column_name = 'whatsapp_business'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'listings'
      AND column_name = 'phone_whatsapp'
  ) THEN
    ALTER TABLE public.listings
      RENAME COLUMN whatsapp_business TO phone_whatsapp;
  END IF;
END $$;
