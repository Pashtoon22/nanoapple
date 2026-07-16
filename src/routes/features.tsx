import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Wand2,
  Palette,
  Zap,
  Shield,
  Image,
  Layers,
  Download,
  Sparkles,
  ArrowRight,
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

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Features — Lumen" },
      {
        name: "description",
        content:
          "Discover everything Lumen can do: text-to-image, styles, batch generation, safe content checks, and more.",
      },
    ],
  }),
});

const features = [
  {
    icon: Wand2,
    title: "Text to Image",
    description:
      "Describe any scene, object, or concept and Lumen will generate a matching image in seconds.",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description:
      "Cinematic, photorealistic, anime, 3D render, oil painting, watercolor — pick the perfect look.",
  },
  {
    icon: Zap,
    title: "Fast Generation",
    description:
      "Our optimized pipeline returns results quickly so you can iterate without waiting.",
  },
  {
    icon: Shield,
    title: "Content Safety",
    description:
      "Automatic checks help ensure generated images are appropriate for every audience.",
  },
  {
    icon: Image,
    title: "Flexible Aspect Ratios",
    description:
      "Generate images in square, widescreen, portrait, classic, or tall formats.",
  },
  {
    icon: Layers,
    title: "Batch Generation",
    description:
      "Create up to 4 images at once to explore variations and choose the best result.",
  },
  {
    icon: Download,
    title: "One-Click Download",
    description:
      "Save every image instantly with a single click, ready to use anywhere.",
  },
  {
    icon: Sparkles,
    title: "Cinematic Mode",
    description:
      "Enhance prompts automatically with dramatic lighting, depth, and atmosphere.",
  },
];

function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Features built for creators
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to generate, iterate, and publish visuals
                faster.
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

            <div className="mt-16 text-center">
              <Button size="lg" asChild>
                <Link to="/generate">
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
