import { Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditorCard } from "./parts";
import {
  SECTION_LABELS,
  type ResumeTheme,
  type SectionKey,
} from "@/lib/resume/types";

const PALETTES: { label: string; navy: string; accent: string; charcoal: string }[] = [
  { label: "Blueprint Navy", navy: "#0f2740", accent: "#c9a227", charcoal: "#2b2f36" },
  { label: "Studio Beige", navy: "#1c2b33", accent: "#b08968", charcoal: "#33383f" },
  { label: "Graphite Teal", navy: "#12232e", accent: "#3aa6a0", charcoal: "#2f343a" },
  { label: "Ink & Clay", navy: "#141b26", accent: "#d16b4e", charcoal: "#2c3138" },
];

const FONTS: ResumeTheme["fontFamily"][] = ["Inter", "Manrope", "Poppins"];
const DENSITIES: ResumeTheme["density"][] = ["compact", "normal", "relaxed"];

export function ThemeCustomizer({
  theme,
  onTheme,
  sectionOrder,
  hiddenSections,
  onSections,
}: {
  theme: ResumeTheme;
  onTheme: (t: ResumeTheme) => void;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  onSections: (order: SectionKey[], hidden: SectionKey[]) => void;
}) {
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sectionOrder];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    onSections(next, hiddenSections);
  };
  const toggle = (key: SectionKey) =>
    onSections(
      sectionOrder,
      hiddenSections.includes(key)
        ? hiddenSections.filter((k) => k !== key)
        : [...hiddenSections, key],
    );

  return (
    <div className="space-y-4">
      <EditorCard title="Color palette" subtitle="Architectural, print-safe combinations">
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((p) => {
            const active = theme.navy === p.navy && theme.accent === p.accent;
            return (
              <button
                key={p.label}
                onClick={() =>
                  onTheme({ ...theme, navy: p.navy, accent: p.accent, charcoal: p.charcoal })
                }
                className={`flex items-center gap-2 rounded-lg border p-2 text-left transition ${
                  active ? "border-primary ring-1 ring-primary" : "border-border hover:bg-muted"
                }`}
              >
                <span className="flex">
                  <span className="h-6 w-3 rounded-l" style={{ background: p.navy }} />
                  <span className="h-6 w-3" style={{ background: p.accent }} />
                  <span className="h-6 w-3 rounded-r" style={{ background: p.charcoal }} />
                </span>
                <span className="text-xs font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["navy", "accent", "charcoal"] as const).map((k) => (
            <div key={k} className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</Label>
              <input
                type="color"
                value={theme[k]}
                onChange={(e) => onTheme({ ...theme, [k]: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-md border border-border bg-background"
              />
            </div>
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Typography & layout">
        <div className="space-y-3">
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Font</Label>
            <div className="mt-1.5 flex gap-2">
              {FONTS.map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={theme.fontFamily === f ? "default" : "outline"}
                  onClick={() => onTheme({ ...theme, fontFamily: f })}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Density</Label>
            <div className="mt-1.5 flex gap-2">
              {DENSITIES.map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={theme.density === d ? "default" : "outline"}
                  onClick={() => onTheme({ ...theme, density: d })}
                  className="capitalize"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Sidebar position
            </Label>
            <div className="mt-1.5 flex gap-2">
              <Button
                size="sm"
                variant={theme.layout === "sidebar-left" ? "default" : "outline"}
                onClick={() => onTheme({ ...theme, layout: "sidebar-left" })}
              >
                Left
              </Button>
              <Button
                size="sm"
                variant={theme.layout === "sidebar-right" ? "default" : "outline"}
                onClick={() => onTheme({ ...theme, layout: "sidebar-right" })}
              >
                Right
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Blueprint grid</div>
              <div className="text-xs text-muted-foreground">Subtle drafting grid in the sidebar</div>
            </div>
            <Switch
              checked={theme.showBlueprint}
              onCheckedChange={(v) => onTheme({ ...theme, showBlueprint: v })}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Sections" subtitle="Reorder and show/hide sections">
        <div className="space-y-1.5">
          {sectionOrder.map((key, idx) => {
            const hidden = hiddenSections.includes(key);
            return (
              <div
                key={key}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5"
              >
                <span className={`flex-1 text-sm ${hidden ? "text-muted-foreground line-through" : ""}`}>
                  {SECTION_LABELS[key]}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggle(key)}>
                  {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, 1)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </EditorCard>
    </div>
  );
}
