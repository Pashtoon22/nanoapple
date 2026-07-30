import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, EditorCard } from "./parts";
import { uid, type SkillBar, type LanguageItem } from "@/lib/resume/types";

function BarList({
  title,
  subtitle,
  items,
  onChange,
}: {
  title: string;
  subtitle: string;
  items: SkillBar[];
  onChange: (v: SkillBar[]) => void;
}) {
  const update = (id: string, patch: Partial<SkillBar>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
  };

  return (
    <EditorCard title={title} subtitle={subtitle}>
      <div className="space-y-3">
        {items.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <Input
              value={s.name}
              onChange={(e) => update(s.id, { name: e.target.value })}
              className="h-9 w-44 bg-background"
              placeholder="Skill name"
            />
            <Slider
              value={[s.level]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => update(s.id, { level: v })}
              className="flex-1"
            />
            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{s.level}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, -1)}>
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => move(idx, 1)}>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(items.filter((i) => i.id !== s.id))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onChange([...items, { id: uid(), name: "", level: 70 }])}
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </EditorCard>
  );
}

export function SkillsEditor({
  skills,
  software,
  languages,
  onSkills,
  onSoftware,
  onLanguages,
}: {
  skills: SkillBar[];
  software: SkillBar[];
  languages: LanguageItem[];
  onSkills: (v: SkillBar[]) => void;
  onSoftware: (v: SkillBar[]) => void;
  onLanguages: (v: LanguageItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <BarList
        title="Technical skills"
        subtitle="Design, documentation, coordination — rated 0-100"
        items={skills}
        onChange={onSkills}
      />
      <BarList
        title="Software proficiency"
        subtitle="AutoCAD, Revit, SketchUp, Lumion, Adobe Suite…"
        items={software}
        onChange={onSoftware}
      />
      <EditorCard title="Languages" subtitle="Language and proficiency level">
        <div className="space-y-2">
          {languages.map((l) => (
            <div key={l.id} className="flex items-end gap-2">
              <Field
                label="Language"
                value={l.name}
                className="flex-1"
                onChange={(v) => onLanguages(languages.map((x) => (x.id === l.id ? { ...x, name: v } : x)))}
              />
              <div className="flex-1 space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Proficiency
                </Label>
                <Input
                  value={l.proficiency}
                  placeholder="Native / Fluent / Intermediate"
                  className="h-9 bg-background"
                  onChange={(e) =>
                    onLanguages(
                      languages.map((x) => (x.id === l.id ? { ...x, proficiency: e.target.value } : x)),
                    )
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive"
                onClick={() => onLanguages(languages.filter((x) => x.id !== l.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onLanguages([...languages, { id: uid(), name: "", proficiency: "" }])}
          >
            <Plus className="h-4 w-4" /> Add language
          </Button>
        </div>
      </EditorCard>
    </div>
  );
}
