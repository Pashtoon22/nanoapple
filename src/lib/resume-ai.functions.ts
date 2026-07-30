import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.6-flash";

async function chat(system: string, user: string, jsonMode = false) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return { ok: false as const, error: "AI is not configured." };
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Lovable-API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    if (res.status === 429)
      return { ok: false as const, error: "Rate limit reached. Try again shortly." };
    if (res.status === 402)
      return {
        ok: false as const,
        error: "AI credits are exhausted. Add credits in Settings → Plans & credits.",
      };
    return { ok: false as const, error: `AI request failed (${res.status}).` };
  }
  const json = await res.json();
  const text: string = json?.choices?.[0]?.message?.content ?? "";
  return { ok: true as const, text: text.trim() };
}

export const improveSummary = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ summary: z.string().max(4000), jobTitle: z.string().max(200) }).parse(d))
  .handler(async ({ data }) =>
    chat(
      "You are a senior architecture recruitment copywriter. Rewrite professional summaries to be ATS-friendly: 3-5 sentences, third person, no pronouns, concrete scope (building types, disciplines, tools, standards). Return only the rewritten summary text.",
      `Job title: ${data.jobTitle}\n\nCurrent summary:\n${data.summary}`,
    ),
  );

export const rewriteExperience = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        position: z.string().max(200),
        company: z.string().max(300),
        bullets: z.array(z.string().max(600)).max(30),
        mode: z.enum(["professional", "achievements"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const instruction =
      data.mode === "achievements"
        ? "Convert each responsibility into an achievement-oriented bullet that highlights outcome, scale or impact. Do not invent specific numbers that are not implied."
        : "Rewrite each bullet in polished professional resume language starting with a strong action verb, max 24 words.";
    const r = await chat(
      `You are an expert architecture resume writer. ${instruction} Return JSON: {"bullets":["..."]}. Keep the same count or fewer.`,
      `Role: ${data.position} at ${data.company}\n\nBullets:\n${data.bullets.map((b) => `- ${b}`).join("\n")}`,
      true,
    );
    if (!r.ok) return r;
    try {
      const parsed = JSON.parse(r.text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim());
      return { ok: true as const, bullets: (parsed.bullets ?? []) as string[] };
    } catch {
      return { ok: false as const, error: "Could not read the AI response." };
    }
  });

export const atsAnalyze = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ resumeText: z.string().max(30000), targetRole: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const r = await chat(
      `You are an ATS scoring engine for architecture and engineering roles. Score the resume 0-100 and return JSON:
{"score":85,"breakdown":[{"label":"Keyword coverage","score":80}],"strengths":["..."],"improvements":["..."],"keywords":["..."]}
"keywords" = 8-14 missing or under-used architecture job keywords worth adding.`,
      `Target role: ${data.targetRole}\n\nResume:\n${data.resumeText}`,
      true,
    );
    if (!r.ok) return r;
    try {
      const parsed = JSON.parse(r.text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim());
      return { ok: true as const, result: parsed as {
        score: number;
        breakdown: { label: string; score: number }[];
        strengths: string[];
        improvements: string[];
        keywords: string[];
      } };
    } catch {
      return { ok: false as const, error: "Could not read the AI response." };
    }
  });
