import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-foreground"
            >
              <Sparkles className="h-5 w-5" /> Lumen
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered image generation for creators, marketers, and dreamers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/features" className="transition-colors hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/generate" className="transition-colors hover:text-foreground">
                  Generate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lumen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
