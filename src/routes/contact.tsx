import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Lumen" },
      {
        name: "description",
        content:
          "Get in touch with the Lumen team for support, sales, or partnership inquiries.",
      },
    ],
  }),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Contact us
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a question, feedback, or partnership idea? We'd love to hear
                from you.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll respond as soon as
                      possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={onSubmit} className="space-y-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5" /> Name
                          </Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, name: e.target.value }))
                            }
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" /> Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, email: e.target.value }))
                            }
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5" /> Message
                        </Label>
                        <Textarea
                          id="message"
                          value={form.message}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, message: e.target.value }))
                          }
                          placeholder="How can we help?"
                          className="min-h-[140px]"
                        />
                      </div>

                      <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full bg-muted/30">
                  <CardHeader>
                    <CardTitle>Other ways to reach us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <a
                        href="mailto:hello@lumen.app"
                        className="hover:text-foreground hover:underline"
                      >
                        hello@lumen.app
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Support</div>
                      <a
                        href="mailto:support@lumen.app"
                        className="hover:text-foreground hover:underline"
                      >
                        support@lumen.app
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Sales</div>
                      <a
                        href="mailto:sales@lumen.app"
                        className="hover:text-foreground hover:underline"
                      >
                        sales@lumen.app
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Hours</div>
                      Monday – Friday, 9am – 6pm EST
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
