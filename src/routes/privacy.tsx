import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Lumen" },
      {
        name: "description",
        content: "Read Lumen's privacy policy and data practices.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-muted-foreground">
            Lumen respects your privacy. This policy explains what information
            we collect, how we use it, and how we keep it safe.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-foreground">
            Information we collect
          </h2>
          <p className="mt-2 text-muted-foreground">
            We collect the information you provide when you create an account,
            contact us, or use our services. This may include your email address,
            prompts, and generated images.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            How we use information
          </h2>
          <p className="mt-2 text-muted-foreground">
            We use your information to operate and improve Lumen, provide
            customer support, and communicate with you about updates and offers.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            Data security
          </h2>
          <p className="mt-2 text-muted-foreground">
            We implement reasonable security measures to protect your data.
            However, no system is completely secure, and we cannot guarantee
            absolute security.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            Changes to this policy
          </h2>
          <p className="mt-2 text-muted-foreground">
            We may update this privacy policy from time to time. We will notify
            you of significant changes by posting the new policy on our site.
          </p>

          <p className="mt-10 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
