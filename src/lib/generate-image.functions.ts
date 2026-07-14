import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  prompt: z.string().min(1).max(2000),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).default("1:1"),
});

export const generateImage = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {

    const apiKey = process.env.LOVABLE_API_KEY;

    if (!apiKey) {
      throw new Error("Missing LOVABLE_API_KEY");
    }

    const res = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: `${data.prompt}\n\nAspect ratio: ${data.aspectRatio}`,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );


    if (!res.ok) {
      const text = await res.text();

      if (res.status === 429) {
        throw new Error("Rate limit reached. Try again later.");
      }

      if (res.status === 402) {
        throw new Error("AI credits exhausted.");
      }

      throw new Error(`Generation failed: ${text}`);
    }


    const json = await res.json();

    const msg = json?.choices?.[0]?.message;

    const img = msg?.images?.[0];

    const imageUrl =
      (typeof img?.image_url === "string"
        ? img.image_url
        : img?.image_url?.url) ??
      msg?.image_url?.url ??
      (typeof msg?.content === "string" &&
      msg.content.startsWith("data:image")
        ? msg.content
        : undefined);


    if (!imageUrl) {
      throw new Error("No image returned by model");
    }


    // NSFW CHECK API
    const nsfwApi =
      process.env.NSFW_API_URL ||
      "http://YOUR_SERVER_IP:8001";


    const nsfwResponse = await fetch(
      `${nsfwApi}/?url=${encodeURIComponent(imageUrl)}`
    );


    if (!nsfwResponse.ok) {
      throw new Error("NSFW detection API failed");
    }


    const nsfwResult = await nsfwResponse.json();


    if (
      nsfwResult.nsfw === true ||
      nsfwResult.is_nsfw === true ||
      nsfwResult.prediction === "nsfw"
    ) {
      throw new Error(
        "Image rejected: NSFW content detected"
      );
    }


    return {
      imageUrl,
      safe: true,
    };
  });
