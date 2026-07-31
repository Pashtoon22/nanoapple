import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, FileType2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExecutiveCV } from "@/components/resume/ExecutiveCV";
import { ExecutiveCoverLetter } from "@/components/resume/ExecutiveCoverLetter";
import {
  buildCvDocx,
  buildCoverLetterDocx,
  downloadBlob,
} from "@/lib/resume/executive-docx";

export const Route = createFileRoute("/executive")({
  component: ExecutivePage,
  head: () => ({
    meta: [
      { title: "Executive CV & Cover Letter | Abdul Qader Wadan" },
      {
        name: "description",
        content:
          "Premium black, white and gold executive CV and matching cover letter for a Senior Architect and Engineering Coordinator, with Word and PDF export.",
      },
      { property: "og:title", content: "Executive CV & Cover Letter" },
      {
        property: "og:description",
        content:
          "Luxury ATS-friendly executive CV and cover letter with Word and PDF download.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type PrintMode = "cv" | "letter";

function ExecutivePage() {
  const [tab, setTab] = useState<PrintMode>("cv");
  const [busy, setBusy] = useState<string | null>(null);

  function printDoc(mode: PrintMode) {
    document.body.classList.add(mode === "cv" ? "print-cv" : "print-letter");
    const cleanup = () => {
      document.body.classList.remove("print-cv", "print-letter");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => window.print(), 60);
  }

  async function exportDocx(kind: PrintMode) {
    try {
      setBusy(kind);
      const blob =
        kind === "cv" ? await buildCvDocx() : await buildCoverLetterDocx();
      downloadBlob(
        blob,
        kind === "cv"
          ? "Abdul-Qader-Wadan-Executive-CV.docx"
          : "Abdul-Qader-Wadan-Cover-Letter.docx",
      );
      toast.success("Word document downloaded");
    } catch (e) {
      toast.error("Export failed. Please try again.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0F11]">
      <header className="no-print sticky top-0 z-20 border-b border-white/10 bg-[#0E0F11]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Builder
          </Link>
          <div className="mx-2 hidden h-6 w-px bg-white/15 sm:block" />
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">
              Executive CV & Cover Letter
            </h1>
            <p className="text-xs text-[#C9A227]">Black · White · Gold edition</p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="mr-2 flex rounded-md border border-white/15 p-0.5">
              {(["cv", "letter"] as PrintMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setTab(m)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                    tab === m
                      ? "bg-[#C9A227] text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {m === "cv" ? "CV" : "Cover Letter"}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              className="border-[#C9A227]/50 bg-transparent text-white hover:bg-[#C9A227] hover:text-black"
              disabled={busy === "cv"}
              onClick={() => exportDocx("cv")}
            >
              <FileType2 className="mr-1.5 h-4 w-4" /> CV (Word)
            </Button>
            <Button
              size="sm"
              className="bg-[#C9A227] text-black hover:bg-[#dbb43a]"
              onClick={() => printDoc("cv")}
            >
              <FileText className="mr-1.5 h-4 w-4" /> CV (PDF)
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-[#C9A227]/50 bg-transparent text-white hover:bg-[#C9A227] hover:text-black"
              disabled={busy === "letter"}
              onClick={() => exportDocx("letter")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Letter (Word)
            </Button>
            <Button
              size="sm"
              className="bg-[#C9A227] text-black hover:bg-[#dbb43a]"
              onClick={() => printDoc("letter")}
            >
              <FileText className="mr-1.5 h-4 w-4" /> Letter (PDF)
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[240mm] px-4 py-8">
        <div id="exec-cv-wrap" className={tab === "cv" ? "" : "hidden print:block"}>
          <ExecutiveCV />
        </div>
        <div
          id="exec-letter-wrap"
          className={tab === "letter" ? "" : "hidden print:block"}
        >
          <ExecutiveCoverLetter />
        </div>
      </main>
    </div>
  );
}
