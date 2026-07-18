import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertOwner(context: any) {
  const { data, error } = await context.supabase
    .rpc("is_owner", { _user_id: context.userId });
  if (error || !data) throw new Error("Forbidden");
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [users, images, videos, subs, pays] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("generations").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("videos").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("subscriptions").select("tier"),
      supabaseAdmin.from("payments").select("amount_cents,status"),
    ]);
    const tierCounts = { free: 0, pro: 0, enterprise: 0 } as Record<string, number>;
    (subs.data ?? []).forEach((s: any) => { tierCounts[s.tier] = (tierCounts[s.tier] ?? 0) + 1; });
    const revenueCents = (pays.data ?? [])
      .filter((p: any) => p.status === "succeeded")
      .reduce((a: number, p: any) => a + (p.amount_cents ?? 0), 0);
    return {
      totalUsers: users.count ?? 0,
      totalImages: images.count ?? 0,
      totalVideos: videos.count ?? 0,
      tierCounts,
      revenueCents,
      monthlyPaidSubs: tierCounts.pro + tierCounts.enterprise,
    };
  });

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id, email, display_name, banned, created_at, subscriptions(tier,status), user_roles(role)")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const listRecentPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("payments")
      .select("id, user_id, amount_cents, currency, status, description, created_at")
      .order("created_at", { ascending: false })
      .limit(25);
    return data ?? [];
  });

export const setUserBanned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), banned: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ banned: data.banned }).eq("id", data.userId);
    await supabaseAdmin.from("admin_logs").insert({
      actor_id: context.userId,
      action: data.banned ? "ban_user" : "unban_user",
      target_type: "user",
      target_id: data.userId,
    });
    return { ok: true };
  });

export const setUserTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    userId: z.string().uuid(),
    tier: z.enum(["free", "pro", "enterprise"]),
  }).parse(d))
  .handler(async ({ context, data }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("subscriptions").update({ tier: data.tier, status: "active" }).eq("user_id", data.userId);
    await supabaseAdmin.from("admin_logs").insert({
      actor_id: context.userId,
      action: "set_tier",
      target_type: "user",
      target_id: data.userId,
      meta: { tier: data.tier },
    });
    return { ok: true };
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("settings").select("*");
    return data ?? [];
  });

export const updateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ key: z.string(), value: z.any() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertOwner(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("settings").upsert({ key: data.key, value: data.value });
    return { ok: true };
  });
