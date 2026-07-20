import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  prompt: z.string().min(1).max(2000),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).default("1:1"),
});

export const generateImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Check ban
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("banned")
      .eq("id", context.userId)
      .maybeSingle();
    if (profile?.banned) throw new Error("Your account has been suspended.");

    // Consume credit (owner is unlimited via SQL function)
    const { data: creditRes, error: cErr } = await context.supabase
      .rpc("consume_image_credit", { _user_id: context.userId });
    if (cErr) throw new Error(cErr.message);
    const cr = creditRes as { ok?: boolean; used?: number; limit?: number } | null;
    if (cr && cr.ok === false) {
      throw new Error(
        `Daily image limit reached (${cr.used}/${cr.limit}). Upgrade to Pro for unlimited generations.`
      );
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          { role: "user", content: `${data.prompt}\n\nAspect ratio: ${data.aspectRatio}` },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) {
        return {
          imageUrl: null,
          error: "Rate limit reached. Try again later.",
          code: "rate_limited" as const,
        };
      }
      if (res.status === 402) {
        return {
          imageUrl: null,
          error:
            "AI credits are exhausted. Add credits in Settings → Plans & credits, then try again.",
          code: "credits_exhausted" as const,
        };
      }
      throw new Error(`Generation failed: ${text}`);
    }

    const json = await res.json();
    const msg = json?.choices?.[0]?.message;
    const img = msg?.images?.[0];
    const imageUrl =
      (typeof img?.image_url === "string" ? img.image_url : img?.image_url?.url) ??
      msg?.image_url?.url ??
      (typeof msg?.content === "string" && msg.content.startsWith("data:image") ? msg.content : undefined);

    if (!imageUrl) throw new Error("No image returned by model");

    // Record generation
    await context.supabase.from("generations").insert({
      user_id: context.userId,
      prompt: data.prompt,
      image_url: imageUrl,
      model: "google/gemini-2.5-flash-image",
      aspect_ratio: data.aspectRatio,
    });

    return { imageUrl, error: null, code: null };
  });
