import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, EditorCard } from "./parts";
import { uid, SECTION_LABELS, type SimpleItem, type ReferenceItem, type SectionKey } from "@/lib/resume/types";

const SIMPLE_KEYS = ["awards", "certifications", "memberships", "publications", "workshops"] as const;
type SimpleKey = (typeof SIMPLE_KEYS)[number];

export function ExtrasEditor({
  data,
  onSimple,
  references,
  onReferences,
}: {
  data: Record<SimpleKey, SimpleItem[]>;
  onSimple: (key: SimpleKey, v: SimpleItem[]) => void;
  references: ReferenceItem[];
  onReferences: (v: ReferenceItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      {SIMPLE_KEYS.map((key) => {
        const items = data[key];
        const update = (id: string, patch: Partial<SimpleItem>) =>
          onSimple(key, items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
        return (
          <EditorCard key={key} title={SECTION_LABELS[key as SectionKey]}>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.id} className="flex items-end gap-2">
                  <Field
                    label="Title"
                    className="flex-1"
                    value={it.title}
                    onChange={(v) => update(it.id, { title: v })}
                  />
                  <Field
                    label="Issuer / detail"
                    className="flex-1"
                    value={it.subtitle}
                    onChange={(v) => update(it.id, { subtitle: v })}
                  />
                  <Field
                    label="Year"
                    className="w-24"
                    value={it.year}
                    onChange={(v) => update(it.id, { year: v })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive"
                    onClick={() => onSimple(key, items.filter((i) => i.id !== it.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onSimple(key, [...items, { id: uid(), title: "", subtitle: "", year: "" }])}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </EditorCard>
        );
      })}

      <EditorCard title="References">
        <div className="space-y-3">
          {references.map((r) => (
            <div key={r.id} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <Field
                label="Name"
                value={r.name}
                onChange={(v) => onReferences(references.map((x) => (x.id === r.id ? { ...x, name: v } : x)))}
              />
              <Field
                label="Title"
                value={r.title}
                onChange={(v) => onReferences(references.map((x) => (x.id === r.id ? { ...x, title: v } : x)))}
              />
              <Field
                label="Phone"
                value={r.phone}
                onChange={(v) => onReferences(references.map((x) => (x.id === r.id ? { ...x, phone: v } : x)))}
              />
              <Field
                label="Email"
                value={r.email}
                onChange={(v) => onReferences(references.map((x) => (x.id === r.id ? { ...x, email: v } : x)))}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive"
                onClick={() => onReferences(references.filter((x) => x.id !== r.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              onReferences([...references, { id: uid(), name: "", title: "", phone: "", email: "" }])
            }
          >
            <Plus className="h-4 w-4" /> Add reference
          </Button>
        </div>
      </EditorCard>
    </div>
  );
}
