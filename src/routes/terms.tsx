import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — Lumen" },
      {
        name: "description",
        content: "Read Lumen's terms of service and usage policies.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-muted-foreground">
            By using Lumen, you agree to these terms. Please read them
            carefully.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-foreground">
            Acceptable use
          </h2>
          <p className="mt-2 text-muted-foreground">
            You may not use Lumen to generate illegal, harmful, or abusive
            content. We reserve the right to suspend accounts that violate
            these rules.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            Intellectual property
          </h2>
          <p className="mt-2 text-muted-foreground">
            You retain rights to the content you create using Lumen, subject to
            our license to host, display, and improve our services.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            Limitation of liability
          </h2>
          <p className="mt-2 text-muted-foreground">
            Lumen is provided "as is" without warranties of any kind. We are
            not liable for damages arising from your use of the service.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">
            Changes to these terms
          </h2>
          <p className="mt-2 text-muted-foreground">
            We may update these terms at any time. Continued use of Lumen after
            changes means you accept the new terms.
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
