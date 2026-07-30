import { Sparkles, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, AreaField, EditorCard } from "./parts";
import type { PersonalInfo } from "@/lib/resume/types";
import { improveSummary } from "@/lib/resume-ai.functions";

export function PersonalEditor({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
}) {
  const [busy, setBusy] = useState(false);
  const set = (k: keyof PersonalInfo) => (v: string) => onChange({ ...value, [k]: v });

  const onPhoto = (file?: File) => {
    if (!file) return;
    if (file.size > 3_000_000) {
      toast.error("Please use a photo under 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const enhance = async () => {
    if (!value.summary.trim()) {
      toast.error("Write a short summary first, then enhance it.");
      return;
    }
    setBusy(true);
    const res = await improveSummary({
      data: { summary: value.summary, jobTitle: value.jobTitle },
    });
    setBusy(false);
    if (!res.ok) return void toast.error(res.error);
    onChange({ ...value, summary: res.text });
    toast.success("Summary enhanced");
  };

  return (
    <div className="space-y-4">
      <EditorCard title="Profile photo" subtitle="Optional headshot shown in the sidebar">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-md border border-border bg-muted">
            {value.photo ? (
              <img src={value.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                />
              </label>
            </Button>
            {value.photo && (
              <Button variant="ghost" size="sm" onClick={() => onChange({ ...value, photo: "" })}>
                <X className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Personal details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value={value.fullName} onChange={set("fullName")} />
          <Field label="Job title" value={value.jobTitle} onChange={set("jobTitle")} />
          <Field label="Email" value={value.email} onChange={set("email")} type="email" />
          <Field label="Phone" value={value.phone} onChange={set("phone")} />
          <Field label="Location" value={value.location} onChange={set("location")} />
          <Field label="Nationality" value={value.nationality} onChange={set("nationality")} />
          <Field label="LinkedIn" value={value.linkedin} onChange={set("linkedin")} />
          <Field label="Website" value={value.website} onChange={set("website")} />
          <Field
            label="Portfolio URL (QR code)"
            value={value.portfolio}
            onChange={set("portfolio")}
            className="sm:col-span-2"
          />
        </div>
      </EditorCard>

      <EditorCard title="Professional summary">
        <AreaField
          label="Summary"
          rows={6}
          value={value.summary}
          onChange={set("summary")}
          placeholder="Senior Architectural Designer with 15+ years..."
          action={
            <Button variant="ghost" size="sm" onClick={enhance} disabled={busy}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              AI enhance
            </Button>
          }
        />
      </EditorCard>
    </div>
  );
}
