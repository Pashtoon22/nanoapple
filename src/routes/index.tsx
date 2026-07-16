import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Wand2,
  Palette,
  Shield,
  ArrowRight,
  Image,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Lumen — AI Image Generation Platform" },
      {
        name: "description",
        content:
          "Generate stunning AI images in seconds. Lumen is the fastest way to turn ideas into visuals.",
      },
      {
        property: "og:title",
        content: "Lumen — AI Image Generation Platform",
      },
      {
        property: "og:description",
        content:
          "Generate stunning AI images in seconds. Lumen is the fastest way to turn ideas into visuals.",
      },
    ],
  }),
});

const features = [
  {
    icon: Wand2,
    title: "Text to Image",
    description:
      "Type any idea and watch it become a high-quality image in seconds.",
  },
  {
    icon: Palette,
    title: "Artistic Styles",
    description:
      "Choose from cinematic, photorealistic, anime, oil painting, and more.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized generation pipeline delivers results faster than ever.",
  },
  {
    icon: Shield,
    title: "Safe by Default",
    description:
      "Built-in content checks help keep your creations appropriate.",
  },
  {
    icon: Image,
    title: "Any Aspect Ratio",
    description: "Square, widescreen, portrait, classic — you choose.",
  },
  {
    icon: Layers,
    title: "Batch Generation",
    description: "Generate up to 4 images at once to find the perfect shot.",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe your vision",
    description: "Enter a prompt. Be as detailed or as simple as you like.",
  },
  {
    step: "02",
    title: "Pick a style",
    description: "Select a look, quality level, and aspect ratio.",
  },
  {
    step: "03",
    title: "Generate & download",
    description: "Get your images instantly and save them in one click.",
  },
];

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-3xl" />
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Free AI image generation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              Turn words into{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                stunning visuals
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              Lumen helps creators, marketers, and designers generate beautiful,
              royalty-free images from simple text prompts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Button size="lg" asChild>
                <Link to="/generate">
                  Start Generating <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/features">Explore Features</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" /> Fast
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" /> Safe
              </span>
              <span className="flex items-center gap-1.5">
                <Image className="h-4 w-4 text-primary" /> High Quality
              </span>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/20 px-4 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Images generated", value: "1M+" },
              { label: "Active creators", value: "50K+" },
              { label: "Styles", value: "6+" },
              { label: "Avg. generation time", value: "< 5s" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Everything you need to create
              </h2>
              <p className="mt-4 text-muted-foreground">
                Powerful tools designed for speed, quality, and creative
                freedom.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/20 px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-muted-foreground">
                From idea to image in three simple steps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold text-primary/30">
                        {step.step}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
              <div className="relative px-6 py-16 text-center md:px-12">
                <div className="absolute inset-0 -z-10 opacity-20">
                  <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Ready to create something amazing?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                  Join thousands of creators using Lumen to bring their ideas
                  to life.
                </p>
                <div className="mt-8">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/generate">
                      Generate your first image <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
