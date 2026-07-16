import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Target, Users, Rocket } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Lumen" },
      {
        name: "description",
        content:
          "Learn about Lumen's mission to make AI image generation fast, safe, and accessible for everyone.",
      },
    ],
  }),
});

const values = [
  {
    icon: Sparkles,
    title: "Creativity First",
    description:
      "We believe everyone has ideas worth visualizing. Our tools remove friction so creativity can flow.",
  },
  {
    icon: Target,
    title: "Precision",
    description:
      "Every feature is tuned to give you control over style, quality, and format.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description:
      "No design skills or expensive software required. If you can describe it, you can create it.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description:
      "We continuously improve our models and pipeline to deliver the best results possible.",
  },
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                About Lumen
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We're building the fastest, safest way to turn imagination into
                imagery.
              </p>
            </div>

            <div className="space-y-6 text-foreground/80">
              <p>
                Lumen started with a simple idea: what if creating beautiful
                images was as easy as describing them? Today, we help creators,
                marketers, and developers generate stunning visuals for social
                media, presentations, products, and art projects — all from a
                simple text prompt.
              </p>
              <p>
                Our platform combines state-of-the-art generative models with a
                clean, intuitive interface. We prioritize speed, quality, and
                safety so you can focus on your ideas instead of wrestling with
                complex tools.
              </p>
              <p>
                Whether you're a professional designer looking for inspiration or
                someone exploring AI for the first time, Lumen is designed for
                you.
              </p>
            </div>

            <div className="mt-16">
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
                Our values
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {values.map((value, i) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <value.icon className="h-5 w-5" />
                        </div>
                        <CardTitle>{value.title}</CardTitle>
                        <CardDescription>{value.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
