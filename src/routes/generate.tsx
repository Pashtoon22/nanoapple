import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  Loader2,
  Apple,
  Film,
  Zap,
  Copy,
  Trash2,
  Check,
  Wand2,
} from "lucide-react";
import { generateImage } from "@/lib/generate-image.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/generate")({
  component: Home,
});

type Aspect = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
type Count = 1 | 2 | 4;

const STYLES = [
  "Cinematic",
  "Photorealistic",
  "Anime",
  "3D Render",
  "Oil Painting",
  "Watercolor",
] as const;

const QUALITIES = ["Standard", "HD", "Ultra HD"] as const;

const ASPECTS: { value: Aspect; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "16:9", label: "Widescreen" },
  { value: "9:16", label: "Portrait" },
  { value: "4:3", label: "Classic" },
  { value: "3:4", label: "Tall" },
];

const STYLE_ENHANCEMENTS: Record<string, string> = {
  Cinematic: "High contrast, dramatic lighting, realistic details, depth, atmosphere",
  Photorealistic: "Ultra-sharp focus, natural lighting, lifelike textures, real-world detail",
  Anime: "Vibrant colors, expressive line art, dynamic composition, studio quality",
  "3D Render": "Physically based shading, soft ambient occlusion, octane quality",
  "Oil Painting": "Rich brush strokes, textured canvas, classical composition",
  Watercolor: "Soft washes, delicate pigments, paper texture, gentle lighting",
};

function Home() {
  const [prompt, setPrompt] = useState(
    "a futuristic city at night with flying cars and neon lights",
  );
  const [style, setStyle] = useState<(typeof STYLES)[number]>("Cinematic");
  const [count, setCount] = useState<Count>(4);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("Ultra HD");
  const [aspect, setAspect] = useState<Aspect>("16:9");
  const [showLatestOnly, setShowLatestOnly] = useState(false);
  const [cinematic, setCinematic] = useState(true);
  const [results, setResults] = useState<
    { urls: string[]; prompt: string; ms: number }[]
  >([]);
  const [copied, setCopied] = useState(false);

  const generateFn = useServerFn(generateImage);

  const mutation = useMutation({
    mutationFn: async () => {
      const started = performance.now();
      const enhanced = `${prompt.trim()}${
        cinematic ? `. Style: ${style}. ${STYLE_ENHANCEMENTS[style]}. Quality: ${quality}.` : ""
      }`;
      const results = await Promise.all(
        Array.from({ length: count }).map(() =>
          generateFn({ data: { prompt: enhanced, aspectRatio: aspect } }),
        ),
      );
      const ms = performance.now() - started;
      return { urls: results.map((r) => r.imageUrl), ms };
    },
    onSuccess: (res) => {
      setResults([{ urls: res.urls, prompt: prompt.trim(), ms: res.ms }]);
      toast.success(`Generated ${res.urls.length} image${res.urls.length > 1 ? "s" : ""}`);
    },

    onError: (err: Error) => toast.error(err.message),
  });

  const onGenerate = () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    if (prompt.length > 500) return toast.error("Prompt must be under 500 characters");
    mutation.mutate();
  };

  const download = (url: string, i: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `nano-apple-${Date.now()}-${i}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const shown = useMemo(
    () => (showLatestOnly ? results.slice(0, 1) : results),
    [showLatestOnly, results],
  );
  const latest = results[0];

  const copyPrompt = async () => {
    if (!latest) return;
    await navigator.clipboard.writeText(latest.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#080B14] font-sans text-white antialiased">
      <Toaster theme="dark" />

      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-600/25 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[480px] w-[480px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-700/15 blur-[140px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-6">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
              <Apple className="h-5 w-5 text-purple-400" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
                Nano Apple
              </h1>
              <p className="text-xs text-neutral-400">AI Image Generator</p>
            </div>
          </div>
          <button
            onClick={() => setCinematic((v) => !v)}
            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
              cinematic
                ? "border-purple-500/60 bg-purple-500/10 text-purple-200 shadow-[0_0_25px_rgba(139,92,246,0.25)]"
                : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-purple-500/40"
            }`}
          >
            <Film className="h-4 w-4" />
            Cinematic Mode
          </button>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid flex-1 gap-6 lg:grid-cols-[340px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="flex flex-col gap-4">
            <GlassCard className="p-5">
              <SectionLabel>Prompt</SectionLabel>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                placeholder="a futuristic city at night with flying cars and neon lights"
                className="min-h-[130px] resize-none rounded-2xl border-white/10 bg-black/40 text-[15px] text-white placeholder:text-neutral-500 focus-visible:border-purple-500/60 focus-visible:ring-1 focus-visible:ring-purple-500/40"
              />
              <div className="mt-2 flex justify-end text-xs text-neutral-500">
                {prompt.length} / 500
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <SectionLabel>Style</SectionLabel>
                  <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
                    <SelectTrigger className="h-11 rounded-2xl border-purple-500/30 bg-black/40 text-white hover:border-purple-500/60 focus:ring-purple-500/40">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4 text-purple-400" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#121827] text-white">
                      {STYLES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhancement card */}
                <div className="relative rounded-2xl p-[1px]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/60 via-fuchsia-500/30 to-purple-700/40" />
                  <div className="relative rounded-2xl bg-[#121827] p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      {style} Enhancement
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-400">
                      {STYLE_ENHANCEMENTS[style]}
                    </p>
                  </div>
                </div>

                <div>
                  <SectionLabel>Image Count</SectionLabel>
                  <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1">
                    {[1, 2, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCount(n as Count)}
                        className={`relative flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
                          count === n
                            ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SectionLabel>Quality</SectionLabel>
                    <Select
                      value={quality}
                      onValueChange={(v) => setQuality(v as typeof quality)}
                    >
                      <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-black/40 text-white hover:border-purple-500/40">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-purple-400">4K</span>
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#121827] text-white">
                        {QUALITIES.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <SectionLabel>Aspect</SectionLabel>
                    <Select value={aspect} onValueChange={(v) => setAspect(v as Aspect)}>
                      <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-black/40 text-white hover:border-purple-500/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#121827] text-white">
                        {ASPECTS.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            {a.value} · {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onGenerate}
                  disabled={mutation.isPending}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_35px_rgba(139,92,246,0.45)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(168,85,247,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-purple-400" /> Fast
                  </span>
                  <span>•</span>
                  <span>High Quality</span>
                  <span>•</span>
                  <span>Cinematic</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm font-medium">Show Only Latest Result</div>
                <div className="text-xs text-neutral-400">Hide previous generations</div>
              </div>
              <Switch
                checked={showLatestOnly}
                onCheckedChange={setShowLatestOnly}
                className="data-[state=checked]:bg-purple-500"
              />
            </GlassCard>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex flex-col gap-4">
            <GlassCard className="p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/15 shadow-[0_0_20px_rgba(34,197,94,0.35)]">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">Latest Result</div>
                    <div className="text-xs text-neutral-400">
                      {latest
                        ? `Generated in ${(latest.ms / 1000).toFixed(1)}s`
                        : "Waiting to generate..."}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!latest}
                    onClick={() => latest?.urls.forEach((u, i) => download(u, i))}
                    className="rounded-xl border-white/10 bg-white/[0.03] text-white hover:border-purple-500/40 hover:bg-purple-500/10"
                  >
                    <Download className="mr-1.5 h-4 w-4" /> Download All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!results.length}
                    onClick={() => setResults([])}
                    className="rounded-xl border-white/10 bg-white/[0.03] text-white hover:border-red-500/40 hover:bg-red-500/10"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" /> Clear
                  </Button>
                </div>
              </div>

              {/* image grid */}
              {shown.length === 0 && !mutation.isPending ? (
                <EmptyState onSuggest={setPrompt} />
              ) : mutation.isPending ? (
                <GridSkeleton count={count} />
              ) : (
                <AnimatePresence>
                  {shown.map((r, ri) => (
                    <motion.div
                      key={ri + r.prompt}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4"
                    >
                      <div
                        className={`grid gap-4 ${
                          r.urls.length === 1
                            ? "grid-cols-1"
                            : r.urls.length === 2
                              ? "grid-cols-1 sm:grid-cols-2"
                              : "grid-cols-1 sm:grid-cols-2"
                        }`}
                      >
                        {r.urls.map((url, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.015 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                          >
                            <img
                              src={url}
                              alt={r.prompt}
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => download(url, i)}
                              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/60 opacity-0 backdrop-blur transition-all duration-300 hover:bg-purple-500/40 group-hover:opacity-100"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </GlassCard>

            {latest && (
              <GlassCard className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Prompt Used
                  </div>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-neutral-300 transition hover:border-purple-500/40 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[15px] leading-relaxed text-neutral-200">
                  {latest.prompt}
                </p>
              </GlassCard>
            )}

            <GlassCard className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 shadow-[0_0_25px_rgba(139,92,246,0.35)]">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Fast Generation
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  Optimized for speed and high quality using advanced AI models.
                </p>
              </div>
            </GlassCard>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#121827]/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
      {children}
    </div>
  );
}

function GridSkeleton({ count }: { count: number }) {
  return (
    <div
      className={`grid gap-4 ${
        count === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10" />
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onSuggest }: { onSuggest: (p: string) => void }) {
  const ideas = [
    "A neon-lit cyberpunk street market at night, rain reflections",
    "An astronaut relaxing on a tropical beach, golden hour",
    "Isometric floating island with waterfalls, pastel colors",
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/40 bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
        <Wand2 className="h-6 w-6 text-purple-400" />
      </div>
      <div className="text-lg font-semibold">Ready when you are</div>
      <p className="mt-1 max-w-sm text-sm text-neutral-400">
        Craft a prompt on the left, or try one of these to start:
      </p>
      <div className="mt-5 flex max-w-lg flex-wrap justify-center gap-2">
        {ideas.map((i) => (
          <button
            key={i}
            onClick={() => onSuggest(i)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-300 transition hover:border-purple-500/40 hover:text-white"
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
