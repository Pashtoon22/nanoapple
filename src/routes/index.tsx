import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Download, Loader2, Wand2, ImageIcon } from "lucide-react";
import { generateImage } from "@/lib/generate-image.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Home,
});

type Aspect = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const ASPECTS: { value: Aspect; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "16:9", label: "Landscape" },
  { value: "9:16", label: "Portrait" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

const SUGGESTIONS = [
  "A neon-lit cyberpunk street market at night, rain reflections, cinematic",
  "An astronaut relaxing on a tropical beach, hyperrealistic, golden hour",
  "Studio portrait of a fluffy corgi wearing tiny sunglasses",
  "Isometric tiny floating island with waterfalls, pastel colors",
];

function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("1:1");
  const [images, setImages] = useState<{ url: string; prompt: string }[]>([]);
  const generateFn = useServerFn(generateImage);

  const mutation = useMutation({
    mutationFn: (vars: { prompt: string; aspectRatio: Aspect }) =>
      generateFn({ data: vars }),
    onSuccess: (res, vars) => {
      setImages((prev) => [{ url: res.imageUrl, prompt: vars.prompt }, ...prev]);
      toast.success("Image generated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    mutation.mutate({ prompt: prompt.trim(), aspectRatio: aspect });
  };

  const download = (url: string, idx: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumen-${Date.now()}-${idx}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100">
      <Toaster theme="dark" />
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-8">
        {/* header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Future Bright</h1>
              <p className="text-xs text-neutral-400">Free AI image generator</p>
            </div>
          </div>
          <a
            href="https://docs.lovable.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-neutral-400 hover:text-neutral-200 md:block"
          >
            Docs
          </a>
        </header>

        {/* hero prompt */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur md:p-6">
            <Label htmlFor="prompt" className="mb-2 block text-sm text-neutral-300">
              Describe an image
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at sunset, painted in watercolor..."
              className="min-h-[110px] resize-none border-white/10 bg-black/30 text-base text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-fuchsia-500"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onGenerate();
              }}
            />

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {ASPECTS.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAspect(a.value)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      aspect === a.value
                        ? "border-fuchsia-500/60 bg-fuchsia-500/20 text-white"
                        : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    {a.value} · {a.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={onGenerate}
                disabled={mutation.isPending}
                className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:opacity-90"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200"
                >
                  {s.length > 60 ? s.slice(0, 57) + "..." : s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* gallery */}
        <section className="flex-1">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-400">
            Your generations
          </h2>

          {images.length === 0 && !mutation.isPending ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
              <ImageIcon className="mb-3 h-10 w-10 text-neutral-600" />
              <p className="text-sm text-neutral-400">
                Your generated images will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mutation.isPending && (
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400" />
                </div>
              )}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black"
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="mb-2 line-clamp-2 text-xs text-neutral-200">
                      {img.prompt}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => download(img.url, idx)}
                      className="h-8 bg-white/10 text-white hover:bg-white/20"
                    >
                      <Download className="mr-1 h-3 w-3" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-neutral-500">
          Built with Lovable · Powered by Gemini image generation
        </footer>
      </div>
    </div>
  );
}
