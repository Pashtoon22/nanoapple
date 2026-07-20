import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Video,
  Scissors,
  Eraser,
  Maximize2,
  ArrowRight,
  Menu,
  X,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "360 Angle — Create Anything with AI" },
      {
        name: "description",
        content:
          "360 Angle is a premium AI creative platform. Generate images, videos, edits, anime art, and more — all in one place.",
      },
      { property: "og:title", content: "360 Angle — Create Anything with AI" },
      {
        property: "og:description",
        content:
          "Premium AI creative platform for images, videos, editing, and more.",
      },
    ],
  }),
});

const NAV = [
  { label: "Home", to: "/" },
  { label: "AI Image", to: "/" },
  { label: "AI Video", to: "/" },
  { label: "AI Editor", to: "/" },
  { label: "Pricing", to: "/pricing" },
];

const FEATURES = [
  {
    icon: Wand2,
    title: "Text to Image",
    desc: "Turn any prompt into a stunning, high-resolution image in seconds.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: ImageIcon,
    title: "Image Editing",
    desc: "Retouch, restyle, and transform any photo with a single prompt.",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: Video,
    title: "AI Video",
    desc: "Generate cinematic, animated, and product videos from text.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Anime Generator",
    desc: "Create expressive anime characters and scenes with a signature style.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Eraser,
    title: "Background Remover",
    desc: "Cut clean subjects out of any image with pixel-perfect edges.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Maximize2,
    title: "Upscaler",
    desc: "Enhance detail and bring your images up to 4K in one click.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const ARTWORK = [
  {
    src: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=600&q=80",
    label: "Cyberpunk city",
  },
  {
    src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80",
    label: "Astronaut portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1635776062043-223faf322554?auto=format&fit=crop&w=600&q=80",
    label: "Fantasy warrior",
  },
];

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  const goGenerate = () => {
    const p = prompt.trim();
    navigate({ to: "/generate", search: p ? { prompt: p } : undefined as never });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060d] font-sans text-white antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-600/25 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* NAV */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(139,92,246,0.5)]">
              <span className="text-sm font-black">360</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              360 Angle
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              className="text-neutral-200 hover:bg-white/5 hover:text-white"
            >
              Login
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:opacity-95">
              Sign Up
            </Button>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mx-6 mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-neutral-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Button variant="outline" className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Login
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white">
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-neutral-300 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              New — 360 Angle Studio v2 is live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Create Anything <br />
              with{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 max-w-xl text-base text-neutral-400 md:text-lg"
            >
              Generate realistic images, anime artwork, product photos,
              cinematic videos, and professional edits — all in one premium
              platform.
            </motion.p>

            {/* Prompt box */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mt-8 rounded-2xl p-[1px]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/70 via-purple-500/70 to-cyan-400/70 opacity-70 blur-[1px]" />
              <div className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b0d18]/80 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 px-2">
                  <Wand2 className="h-5 w-5 shrink-0 text-purple-300" />
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe anything you imagine..."
                    className="w-full bg-transparent py-3 text-[15px] text-white placeholder:text-neutral-500 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === "Enter") goGenerate(); }}
                  />
                </div>
                <Button
                  onClick={goGenerate}
                  className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 font-medium text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:opacity-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 flex flex-wrap gap-2 text-xs text-neutral-400"
            >
              {[
                "Cinematic movie poster",
                "Anime portrait",
                "Cyberpunk city",
                "Luxury product shot",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setPrompt(t)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:border-purple-400/40 hover:text-white"
                >
                  {t}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-6 text-xs text-neutral-500"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {["A", "B", "C"].map((c, i) => (
                    <div
                      key={c}
                      className={`grid h-6 w-6 place-items-center rounded-full border border-[#05060d] text-[10px] font-bold ${
                        i === 0
                          ? "bg-indigo-500"
                          : i === 1
                            ? "bg-purple-500"
                            : "bg-cyan-500"
                      }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <span className="ml-2 text-neutral-300">500K+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1 text-neutral-300">4.9 / 5</span>
              </div>
            </motion.div>
          </div>

          {/* Floating artwork */}
          <div className="relative h-[480px]">
            {ARTWORK.map((art, i) => {
              const positions = [
                "top-0 right-8 rotate-[-6deg]",
                "top-24 left-0 rotate-[4deg]",
                "bottom-0 right-0 rotate-[-2deg]",
              ];
              return (
                <motion.div
                  key={art.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 * i }}
                  className={`absolute w-56 md:w-64 ${positions[i]}`}
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 6 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.55)] backdrop-blur-xl"
                  >
                    <img
                      src={art.src}
                      alt={art.label}
                      className="h-72 w-full rounded-xl object-cover"
                    />
                    <div className="pointer-events-none absolute inset-1.5 rounded-xl bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-xs font-medium text-white/90">
                      {art.label}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Floating geometric shapes */}
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, 90, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-24 h-10 w-10 rounded-lg border border-cyan-400/40 bg-cyan-400/10 backdrop-blur"
            />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-16 h-14 w-14 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 backdrop-blur"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-purple-300">
              Creative suite
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              A studio for every idea
            </h2>
            <p className="mt-3 max-w-xl text-neutral-400">
              Six powerful tools that work together — from first spark to
              polished final asset.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
          >
            Explore all tools <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div
                className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${f.gradient} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`}
              />
              <div
                className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}
              >
                <f.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm text-purple-300 opacity-0 transition-opacity group-hover:opacity-100">
                Try it <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-500/20 p-10 backdrop-blur-xl md:p-16">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                Start creating with 360 Angle today
              </h3>
              <p className="mt-3 max-w-lg text-neutral-300">
                Join hundreds of thousands of creators using AI to bring their
                boldest ideas to life.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                See Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-10 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} 360 Angle. All rights reserved.
      </footer>
    </div>
  );
}
