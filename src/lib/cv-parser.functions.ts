import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  fileData: z.string().min(20).max(14_000_000), // data URL
  mimeType: z.string().min(3).max(120),
  filename: z.string().max(300).default("cv"),
});

const SCHEMA_HINT = `{
  "personal": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "portfolio": "", "nationality": "", "summary": "" },
  "skills": [{ "name": "", "level": 90 }],
  "software": [{ "name": "", "level": 90 }],
  "languages": [{ "name": "", "proficiency": "" }],
  "experience": [{ "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": false, "responsibilities": [""], "achievements": [""], "projects": "" }],
  "education": [{ "degree": "", "institution": "", "location": "", "year": "", "details": "" }],
  "projects": [{ "name": "", "category": "", "location": "", "year": "", "area": "", "client": "", "role": "", "responsibilities": "", "software": [""] }],
  "awards": [{ "title": "", "subtitle": "", "year": "" }],
  "certifications": [{ "title": "", "subtitle": "", "year": "" }],
  "memberships": [{ "title": "", "subtitle": "", "year": "" }],
  "publications": [{ "title": "", "subtitle": "", "year": "" }],
  "workshops": [{ "title": "", "subtitle": "", "year": "" }],
  "references": [{ "name": "", "title": "", "phone": "", "email": "" }]
}`;

function gatewayError(status: number) {
  if (status === 429)
    return { ok: false as const, error: "Rate limit reached. Please try again in a moment." };
  if (status === 402)
    return {
      ok: false as const,
      error: "AI credits are exhausted. Add credits in Settings → Plans & credits.",
    };
  return null;
}

export const parseCv = createServerFn({ method: "POST" })
  .inputValidator((d) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not configured." };

    const isImage = data.mimeType.startsWith("image/");
    const content = isImage
      ? [
          { type: "text", text: "Extract the CV data from this image." },
          { type: "image_url", image_url: { url: data.fileData } },
        ]
      : [
          { type: "text", text: "Extract the CV data from this document." },
          {
            type: "file",
            file: { filename: data.filename || "cv.pdf", file_data: data.fileData },
          },
        ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert ATS resume parser for architecture and engineering professionals.
Read the supplied CV and return ONLY valid JSON matching this shape:
${SCHEMA_HINT}
Rules:
- Never invent facts. Omit array entries you cannot support from the document.
- Rewrite responsibilities as concise, professional, action-verb bullets (max 25 words each).
- Derive 3-8 "achievements" bullets only where the document supports them.
- "skills" are professional competencies, "software" are named applications. Estimate level 60-98 from seniority and usage.
- summary: 3-5 sentence professional summary written in third person without pronouns.
- Dates as short forms like "Jan 2019" / "Present".`,
          },
          { role: "user", content },
        ],
      }),
    });

    if (!res.ok) {
      const known = gatewayError(res.status);
      if (known) return known;
      return { ok: false as const, error: `Parsing failed (${res.status}).` };
    }

    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? "";
    try {
      const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      return { ok: true as const, parsed: JSON.parse(cleaned) };
    } catch {
      return { ok: false as const, error: "Could not read the CV structure. Try a clearer file." };
    }
  });
