import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "owner" | "user";
type Tier = "free" | "pro" | "enterprise";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  role: Role | null;
  tier: Tier | null;
  loading: boolean;
  isOwner: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMeta(uid: string) {
    const [{ data: r }, { data: s }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid).maybeSingle(),
      supabase.from("subscriptions").select("tier").eq("user_id", uid).maybeSingle(),
    ]);
    setRole((r?.role as Role) ?? "user");
    setTier((s?.tier as Tier) ?? "free");
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      if (sess?.user) {
        setTimeout(() => loadMeta(sess.user.id), 0);
      } else {
        setRole(null);
        setTier(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadMeta(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    role,
    tier,
    loading,
    isOwner: role === "owner",
    signOut: async () => {
      await supabase.auth.signOut();
    },
    refresh: async () => {
      if (session?.user) await loadMeta(session.user.id);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
