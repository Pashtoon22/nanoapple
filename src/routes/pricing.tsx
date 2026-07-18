import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
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
import { useAuth } from "@/hooks/useAuth";
import { createCheckoutSession } from "@/lib/billing.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Lumen" },
      {
        name: "description",
        content:
          "Choose the Lumen plan that fits your creative workflow. Start free, upgrade when you need more.",
      },
    ],
  }),
});

type PlanKey = "free" | "pro" | "enterprise";
const plans: Array<{
  name: string; key: PlanKey; price: string; period?: string;
  description: string; features: string[]; featured: boolean;
}> = [
  {
    name: "Free", key: "free", price: "$0",
    description: "Perfect for experimenting and personal projects.",
    features: [
      "20 image generations per day",
      "3 AI videos per day",
      "Standard quality",
      "Watermarked downloads",
    ],
    featured: false,
  },
  {
    name: "Pro", key: "pro", price: "$12", period: "/month",
    description: "For creators who need more power.",
    features: [
      "Unlimited image generation",
      "Up to 200 AI videos per month",
      "HD downloads, no watermark",
      "Faster generation & priority queue",
      "Premium AI models",
    ],
    featured: true,
  },
  {
    name: "Enterprise", key: "enterprise", price: "$49", period: "/month",
    description: "For teams and commercial workflows.",
    features: [
      "Unlimited everything",
      "API access",
      "Team workspace",
      "Commercial usage",
      "Dedicated support & analytics",
    ],
    featured: false,
  },
];

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free. Upgrade only when you need more.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card
                    className={`h-full flex flex-col ${
                      plan.featured
                        ? "border-primary ring-1 ring-primary"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="ml-1 text-muted-foreground">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button
                        className="w-full"
                        variant={plan.featured ? "default" : "outline"}
                        asChild
                      >
                        <Link to={plan.href}>{plan.cta}</Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
