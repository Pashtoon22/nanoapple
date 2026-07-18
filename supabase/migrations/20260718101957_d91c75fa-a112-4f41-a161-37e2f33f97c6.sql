
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('owner', 'user');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE public.payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'owner');
$$;

-- profiles policies
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "profiles owner delete" ON public.profiles FOR DELETE TO authenticated
  USING (public.is_owner(auth.uid()));

-- user_roles policies
CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "roles owner manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

-- ============ SUBSCRIPTIONS ============
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier public.subscription_tier NOT NULL DEFAULT 'free',
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "subs self read" ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "subs owner write" ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

-- ============ CREDITS ============
CREATE TABLE public.credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_images_used INT NOT NULL DEFAULT 0,
  daily_videos_used INT NOT NULL DEFAULT 0,
  monthly_videos_used INT NOT NULL DEFAULT 0,
  day_reset_at DATE NOT NULL DEFAULT CURRENT_DATE,
  month_reset_at DATE NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credits TO authenticated;
GRANT ALL ON public.credits TO service_role;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credits self read" ON public.credits FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- ============ GENERATIONS ============
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT,
  model TEXT,
  aspect_ratio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.generations TO authenticated;
GRANT ALL ON public.generations TO service_role;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
CREATE INDEX gen_user_created_idx ON public.generations(user_id, created_at DESC);
CREATE POLICY "gen self read" ON public.generations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "gen self insert" ON public.generations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "gen self delete" ON public.generations FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- ============ VIDEOS ============
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  video_url TEXT,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE INDEX vid_user_created_idx ON public.videos(user_id, created_at DESC);
CREATE POLICY "vid self read" ON public.videos FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "vid self insert" ON public.videos FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "vid self delete" ON public.videos FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- ============ PAYMENTS ============
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status public.payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pay self read" ON public.payments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- ============ API KEYS ============
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "keys self read" ON public.api_keys FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()));
CREATE POLICY "keys self write" ON public.api_keys FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_owner(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- ============ ADMIN LOGS ============
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_logs TO authenticated;
GRANT ALL ON public.admin_logs TO service_role;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs owner read" ON public.admin_logs FOR SELECT TO authenticated
  USING (public.is_owner(auth.uid()));

-- ============ SETTINGS ============
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "settings read" ON public.settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings owner write" ON public.settings FOR ALL TO authenticated
  USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));

INSERT INTO public.settings(key, value) VALUES
  ('site', '{"name":"360 Angle","tagline":"Create Anything with AI"}'::jsonb),
  ('plans', '{"free":{"images_per_day":20,"videos_per_day":3},"pro":{"videos_per_month":200},"enterprise":{"unlimited":true}}'::jsonb);

-- ============ SIGNUP HANDLER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles(id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'owner@360angle.com' THEN
    v_role := 'owner';
  ELSE
    v_role := 'user';
  END IF;

  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, v_role)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.subscriptions(user_id, tier)
  VALUES (NEW.id, CASE WHEN v_role = 'owner' THEN 'enterprise'::public.subscription_tier ELSE 'free'::public.subscription_tier END)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.credits(user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ CREDIT CONSUMPTION (SECURITY DEFINER) ============
CREATE OR REPLACE FUNCTION public.consume_image_credit(_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tier public.subscription_tier;
  v_limit INT;
  v_used INT;
  v_today DATE := CURRENT_DATE;
BEGIN
  IF public.is_owner(_user_id) THEN RETURN jsonb_build_object('ok', true, 'unlimited', true); END IF;
  SELECT tier INTO v_tier FROM public.subscriptions WHERE user_id = _user_id;

  -- reset counters
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
END; $$;
GRANT EXECUTE ON FUNCTION public.consume_image_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO authenticated;
