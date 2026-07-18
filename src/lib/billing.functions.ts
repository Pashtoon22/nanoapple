import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Stripe-ready checkout stub. Once STRIPE_SECRET_KEY is configured, replace
 * the body with a real Stripe Checkout Session creation. The interface stays
 * the same so the UI does not need to change.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ tier: z.enum(["pro", "enterprise"]) }).parse(d))
  .handler(async ({ context, data }) => {
    // Owners never checkout.
    const { data: isOwner } = await context.supabase.rpc("is_owner", { _user_id: context.userId });
    if (isOwner) return { url: null, alreadyEntitled: true };

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Placeholder path — record intent so it is visible in the admin later.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("admin_logs").insert({
        actor_id: context.userId,
        action: "checkout_intent",
        target_type: "subscription",
        meta: { tier: data.tier, stripe_configured: false },
      });
      return { url: null, alreadyEntitled: false, stripeConfigured: false };
    }
    // Real Stripe wiring goes here.
    return { url: null, alreadyEntitled: false, stripeConfigured: true };
  });
