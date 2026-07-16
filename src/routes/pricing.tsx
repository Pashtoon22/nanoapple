import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
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

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for experimenting and personal projects.",
    features: [
      "20 generations per month",
      "Standard quality",
      "1:1 and 16:9 ratios",
      "Community support",
    ],
    cta: "Get Started",
    href: "/generate",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For creators who need more power and flexibility.",
    features: [
      "500 generations per month",
      "HD & Ultra HD quality",
      "All aspect ratios",
      "Batch generation up to 4 images",
      "Priority speed",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    href: "/generate",
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "Collaborate with your team at scale.",
    features: [
      "Unlimited generations",
      "Ultra HD quality",
      "All aspect ratios",
      "Shared workspace",
      "API access",
      "Priority support",
    ],
    cta: "Contact Sales",
    href: "/contact",
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
