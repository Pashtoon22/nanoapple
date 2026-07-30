import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, AreaField, EditorCard } from "./parts";
import { uid, type ExperienceItem } from "@/lib/resume/types";
import { rewriteExperience } from "@/lib/resume-ai.functions";

const empty = (): ExperienceItem => ({
  id: uid(),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  responsibilities: [],
  achievements: [],
  projects: "",
});

export function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceItem[];
  onChange: (v: ExperienceItem[]) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const update = (id: string, patch: Partial<ExperienceItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
  };

  const ai = async (item: ExperienceItem, mode: "professional" | "achievements") => {
    if (item.responsibilities.length === 0) {
      toast.error("Add a few bullet points first.");
      return;
    }
    setBusy(item.id + mode);
    const res = await rewriteExperience({
      data: {
        position: item.position,
        company: item.company,
        bullets: item.responsibilities,
        mode,
      },
    });
    setBusy(null);
    if (!res.ok) return void toast.error(res.error);
    update(
      item.id,
      mode === "achievements" ? { achievements: res.bullets } : { responsibilities: res.bullets },
    );
    toast.success(mode === "achievements" ? "Achievements generated" : "Bullets rewritten");
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <EditorCard
          key={item.id}
          title={item.position || "New position"}
          subtitle={item.company}
          actions={
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, -1)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, 1)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Position" value={item.position} onChange={(v) => update(item.id, { position: v })} />
            <Field label="Company" value={item.company} onChange={(v) => update(item.id, { company: v })} />
            <Field label="Location" value={item.location} onChange={(v) => update(item.id, { location: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" value={item.startDate} onChange={(v) => update(item.id, { startDate: v })} />
              <Field
                label="End"
                value={item.current ? "Present" : item.endDate}
                onChange={(v) => update(item.id, { endDate: v })}
              />
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={item.current}
              onCheckedChange={(c) => update(item.id, { current: Boolean(c) })}
            />
            I currently work here
          </label>

          <div className="mt-3 space-y-3">
            <AreaField
              label="Responsibilities (one per line)"
              rows={5}
              value={item.responsibilities.join("\n")}
              onChange={(v) => update(item.id, { responsibilities: v.split("\n").filter(Boolean) })}
              action={
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy === item.id + "professional"}
                    onClick={() => ai(item, "professional")}
                  >
                    {busy === item.id + "professional" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Rewrite
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy === item.id + "achievements"}
                    onClick={() => ai(item, "achievements")}
                  >
                    {busy === item.id + "achievements" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Achievements
                  </Button>
                </div>
              }
            />
            <AreaField
              label="Key achievements (one per line)"
              rows={3}
              value={item.achievements.join("\n")}
              onChange={(v) => update(item.id, { achievements: v.split("\n").filter(Boolean) })}
            />
            <AreaField
              label="Notable projects"
              rows={2}
              value={item.projects}
              onChange={(v) => update(item.id, { projects: v })}
            />
          </div>
        </EditorCard>
      ))}

      <Button variant="outline" className="w-full" onClick={() => onChange([...items, empty()])}>
        <Plus className="h-4 w-4" /> Add experience
      </Button>
    </div>
  );
}
