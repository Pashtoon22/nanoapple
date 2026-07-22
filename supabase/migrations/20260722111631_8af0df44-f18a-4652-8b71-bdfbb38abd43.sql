
-- 1) Harden consume_image_credit against cross-user abuse
CREATE OR REPLACE FUNCTION public.consume_image_credit(_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tier public.subscription_tier;
  v_limit INT;
  v_used INT;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Only allow callers to consume their own credits (owners may act on any user).
  IF auth.uid() IS NULL OR (_user_id <> auth.uid() AND NOT public.is_owner(auth.uid())) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF public.is_owner(_user_id) THEN RETURN jsonb_build_object('ok', true, 'unlimited', true); END IF;
  SELECT tier INTO v_tier FROM public.subscriptions WHERE user_id = _user_id;

  UPDATE public.credits SET daily_images_used = 0, daily_videos_used = 0, day_reset_at = v_today
    WHERE user_id = _user_id AND day_reset_at < v_today;

  IF v_tier = 'free' THEN
    v_limit := 20;
    SELECT daily_images_used INTO v_used FROM public.credits WHERE user_id = _user_id;
    IF v_used >= v_limit THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'daily_limit', 'limit', v_limit, 'used', v_used);
    END IF;
    UPDATE public.credits SET daily_images_used = daily_images_used + 1, updated_at = now()
      WHERE user_id = _user_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'tier', v_tier);
END; $function$;

-- 2) Lock down EXECUTE on SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.consume_image_credit(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_image_credit(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.is_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3) Explicit owner-only write policies (service_role still bypasses RLS)
CREATE POLICY "admin_logs owner insert" ON public.admin_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "admin_logs owner update" ON public.admin_logs
  FOR UPDATE TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "admin_logs owner delete" ON public.admin_logs
  FOR DELETE TO authenticated USING (public.is_owner(auth.uid()));

CREATE POLICY "credits owner insert" ON public.credits
  FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "credits owner update" ON public.credits
  FOR UPDATE TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "credits owner delete" ON public.credits
  FOR DELETE TO authenticated USING (public.is_owner(auth.uid()));

CREATE POLICY "payments owner insert" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "payments owner update" ON public.payments
  FOR UPDATE TO authenticated USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));
CREATE POLICY "payments owner delete" ON public.payments
  FOR DELETE TO authenticated USING (public.is_owner(auth.uid()));
