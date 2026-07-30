import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Printer,
  Save,
  FileJson,
  RotateCcw,
  Gauge,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { PersonalEditor } from "@/components/resume/PersonalEditor";
import { ExperienceEditor } from "@/components/resume/ExperienceEditor";
import { SkillsEditor } from "@/components/resume/SkillsEditor";
import { ProjectsEditor, EducationEditor } from "@/components/resume/ProjectsEditor";
import { ExtrasEditor } from "@/components/resume/ExtrasEditor";
import { ThemeCustomizer } from "@/components/resume/ThemeCustomizer";
import { EditorCard } from "@/components/resume/parts";
import type { ResumeData, SectionKey } from "@/lib/resume/types";
import { loadResume, saveResume, downloadFile } from "@/lib/resume/storage";
import { sampleResume } from "@/lib/resume/sample";
import { mergeParsed, resumeToText, emptyResume } from "@/lib/resume/transform";
import { parseCv } from "@/lib/cv-parser.functions";
import { atsAnalyze } from "@/lib/resume-ai.functions";

export const Route = createFileRoute("/")({
  component: Builder,
  head: () => ({
    meta: [
      { title: "Architect CV Studio — AI Resume Builder for Designers" },
      {
        name: "description",
        content:
          "Build a print-ready architectural CV: AI parsing of your existing resume, live A4 preview, project portfolio, skill bars and ATS scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Architect CV Studio — AI Resume Builder for Designers" },
      {
        property: "og:description",
        content: "Build a print-ready architectural CV: AI parsing of your existing resume, live A4 preview, project portfolio, skill bars and ATS scoring.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap",
      },
    ],
  }),
});

type Ats = {
  score: number;
  breakdown: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  keywords: string[];
};

function Builder() {
  const [data, setData] = useState<ResumeData>(sampleResume);
  const [zoom, setZoom] = useState(0.72);
  const [importing, setImporting] = useState(false);
  const [ats, setAts] = useState<Ats | null>(null);
  const [atsBusy, setAtsBusy] = useState(false);
  const [targetRole, setTargetRole] = useState("Senior Architectural Designer");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => setData(loadResume()), []);
  useEffect(() => {
    const t = setTimeout(() => saveResume(data), 500);
    return () => clearTimeout(t);
  }, [data]);

  const patch = (p: Partial<ResumeData>) => setData((d) => ({ ...d, ...p }));

  const onImport = (file?: File) => {
    if (!file) return;
    if (file.size > 12_000_000) return void toast.error("Please upload a file under 12 MB.");
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await parseCv({
        data: {
          fileData: String(reader.result),
          mimeType: file.type || "application/pdf",
          filename: file.name,
        },
      });
      setImporting(false);
      if (!res.ok) return void toast.error(res.error);
      setData((d) => mergeParsed(res.parsed as Record<string, unknown>, d));
      toast.success("CV imported — review and refine the details.");
    };
    reader.onerror = () => {
      setImporting(false);
      toast.error("Could not read that file.");
    };
    reader.readAsDataURL(file);
  };

  const runAts = async () => {
    setAtsBusy(true);
    const res = await atsAnalyze({ data: { resumeText: resumeToText(data), targetRole } });
    setAtsBusy(false);
    if (!res.ok) return void toast.error(res.error);
    setAts(res.result);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="no-print sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Architect CV Studio</div>
              <div className="text-[11px] text-muted-foreground">AI resume builder for designers</div>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild disabled={importing}>
              <label className="cursor-pointer">
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import CV
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  className="hidden"
                  onChange={(e) => onImport(e.target.files?.[0])}
                />
              </label>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadFile(
                  `${(data.personal.fullName || "resume").replace(/\s+/g, "-")}.json`,
                  JSON.stringify(data, null, 2),
                  "application/json",
                )
              }
            >
              <FileJson className="h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => setData(emptyResume)}>
              <RotateCcw className="h-4 w-4" /> Blank
            </Button>
            <Button variant="outline" size="sm" onClick={() => { saveResume(data); toast.success("Saved"); }}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1700px] gap-6 px-5 py-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
        <div className="no-print">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Profile</TabsTrigger>
              <TabsTrigger value="experience">Work</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            <div className="mt-4 max-h-[calc(100vh-190px)] space-y-4 overflow-y-auto pr-1">
              <TabsContent value="personal" className="m-0 space-y-4">
                <PersonalEditor value={data.personal} onChange={(v) => patch({ personal: v })} />
                <EditorCard title="ATS score" subtitle="Check how well your CV matches a target role">
                  <div className="flex gap-2">
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="h-9 bg-background"
                      placeholder="Target role"
                    />
                    <Button size="sm" onClick={runAts} disabled={atsBusy}>
                      {atsBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />}
                      Analyze
                    </Button>
                  </div>
                  {ats && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">{ats.score}</span>
                        <Progress value={ats.score} className="h-2 flex-1" />
                      </div>
                      {ats.breakdown?.map((b) => (
                        <div key={b.label} className="flex items-center gap-2 text-xs">
                          <span className="w-36 text-muted-foreground">{b.label}</span>
                          <Progress value={b.score} className="h-1.5 flex-1" />
                          <span className="w-8 text-right tabular-nums">{b.score}</span>
                        </div>
                      ))}
                      {ats.improvements?.length > 0 && (
                        <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                          {ats.improvements.map((i, n) => (
                            <li key={n}>{i}</li>
                          ))}
                        </ul>
                      )}
                      {ats.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ats.keywords.map((k) => (
                            <span key={k} className="rounded bg-muted px-2 py-0.5 text-[11px]">
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </EditorCard>
              </TabsContent>

              <TabsContent value="experience" className="m-0">
                <ExperienceEditor items={data.experience} onChange={(v) => patch({ experience: v })} />
              </TabsContent>

              <TabsContent value="skills" className="m-0">
                <SkillsEditor
                  skills={data.skills}
                  software={data.software}
                  languages={data.languages}
                  onSkills={(v) => patch({ skills: v })}
                  onSoftware={(v) => patch({ software: v })}
                  onLanguages={(v) => patch({ languages: v })}
                />
              </TabsContent>

              <TabsContent value="projects" className="m-0 space-y-4">
                <ProjectsEditor items={data.projects} onChange={(v) => patch({ projects: v })} />
                <EducationEditor items={data.education} onChange={(v) => patch({ education: v })} />
              </TabsContent>

              <TabsContent value="extras" className="m-0">
                <ExtrasEditor
                  data={{
                    awards: data.awards,
                    certifications: data.certifications,
                    memberships: data.memberships,
                    publications: data.publications,
                    workshops: data.workshops,
                  }}
                  onSimple={(key, v) => patch({ [key]: v } as Partial<ResumeData>)}
                  references={data.references}
                  onReferences={(v) => patch({ references: v })}
                />
              </TabsContent>

              <TabsContent value="design" className="m-0">
                <ThemeCustomizer
                  theme={data.theme}
                  onTheme={(t) => patch({ theme: t })}
                  sectionOrder={data.sectionOrder}
                  hiddenSections={data.hiddenSections}
                  onSections={(order: SectionKey[], hidden: SectionKey[]) =>
                    patch({ sectionOrder: order, hiddenSections: hidden })
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div>
          <div className="no-print mb-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Zoom</span>
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.02}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-40"
            />
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="print-area overflow-auto rounded-xl border border-border bg-neutral-200/60 p-6">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
              className="mx-auto w-fit shadow-2xl"
            >
              <ResumePreview ref={printRef} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
