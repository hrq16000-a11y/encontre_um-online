-- Explicitly block direct RPC execution of trigger-only SECURITY DEFINER functions.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_listing_counters() FROM PUBLIC, anon, authenticated;
