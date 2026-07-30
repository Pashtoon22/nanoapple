import { Plus, Trash2, ChevronUp, ChevronDown, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, AreaField, EditorCard } from "./parts";
import { uid, type ProjectItem, type EducationItem } from "@/lib/resume/types";

export function ProjectsEditor({
  items,
  onChange,
}: {
  items: ProjectItem[];
  onChange: (v: ProjectItem[]) => void;
}) {
  const update = (id: string, patch: Partial<ProjectItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
  };
  const onImage = (id: string, file?: File) => {
    if (!file) return;
    if (file.size > 3_000_000) return void toast.error("Please use an image under 3 MB.");
    const reader = new FileReader();
    reader.onload = () => update(id, { image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {items.map((p, idx) => (
        <EditorCard
          key={p.id}
          title={p.name || "New project"}
          subtitle={[p.category, p.year].filter(Boolean).join(" · ")}
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
                onClick={() => onChange(items.filter((i) => i.id !== p.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name" value={p.name} onChange={(v) => update(p.id, { name: v })} />
            <Field
              label="Type"
              value={p.category}
              placeholder="Residential / Commercial / Institutional"
              onChange={(v) => update(p.id, { category: v })}
            />
            <Field label="Location" value={p.location} onChange={(v) => update(p.id, { location: v })} />
            <Field label="Year" value={p.year} onChange={(v) => update(p.id, { year: v })} />
            <Field label="Area / size" value={p.area} onChange={(v) => update(p.id, { area: v })} />
            <Field label="Client" value={p.client} onChange={(v) => update(p.id, { client: v })} />
            <Field label="Your role" value={p.role} onChange={(v) => update(p.id, { role: v })} />
            <Field
              label="Software used (comma separated)"
              value={p.software.join(", ")}
              onChange={(v) =>
                update(p.id, { software: v.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <div className="mt-3">
            <AreaField
              label="Responsibilities"
              rows={3}
              value={p.responsibilities}
              onChange={(v) => update(p.id, { responsibilities: v })}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-14 w-20 place-items-center overflow-hidden rounded-md border border-border bg-muted">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onImage(p.id, e.target.files?.[0])}
                />
              </label>
            </Button>
            {p.image && (
              <Button variant="ghost" size="sm" onClick={() => update(p.id, { image: "" })}>
                <X className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </EditorCard>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          onChange([
            ...items,
            {
              id: uid(),
              name: "",
              category: "",
              location: "",
              year: "",
              area: "",
              client: "",
              role: "",
              responsibilities: "",
              software: [],
              image: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add project
      </Button>
    </div>
  );
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: EducationItem[];
  onChange: (v: EducationItem[]) => void;
}) {
  const update = (id: string, patch: Partial<EducationItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <div className="space-y-4">
      {items.map((e) => (
        <EditorCard
          key={e.id}
          title={e.degree || "New qualification"}
          subtitle={e.institution}
          actions={
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(items.filter((i) => i.id !== e.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Degree" value={e.degree} onChange={(v) => update(e.id, { degree: v })} />
            <Field
              label="Institution"
              value={e.institution}
              onChange={(v) => update(e.id, { institution: v })}
            />
            <Field label="Location" value={e.location} onChange={(v) => update(e.id, { location: v })} />
            <Field label="Year" value={e.year} onChange={(v) => update(e.id, { year: v })} />
          </div>
          <div className="mt-3">
            <AreaField
              label="Details"
              rows={2}
              value={e.details}
              onChange={(v) => update(e.id, { details: v })}
            />
          </div>
        </EditorCard>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          onChange([
            ...items,
            { id: uid(), degree: "", institution: "", location: "", year: "", details: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add education
      </Button>
    </div>
  );
}
