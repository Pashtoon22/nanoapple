import type { ResumeData } from "./types";
import { sampleResume } from "./sample";

const KEY = "architect-resume:v1";
const BACKUP_KEY = "architect-resume:backups";

export function loadResume(): ResumeData {
  if (typeof window === "undefined") return sampleResume;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return sampleResume;
    const parsed = JSON.parse(raw) as ResumeData;
    return { ...sampleResume, ...parsed, theme: { ...sampleResume.theme, ...parsed.theme } };
  } catch {
    return sampleResume;
  }
}

export function saveResume(data: ResumeData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded — ignore */
  }
}

export type Backup = { id: string; label: string; createdAt: string; data: ResumeData };

export function listBackups(): Backup[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(BACKUP_KEY) ?? "[]") as Backup[];
  } catch {
    return [];
  }
}

export function createBackup(data: ResumeData, label: string): Backup[] {
  const backups = listBackups();
  const next: Backup[] = [
    { id: Math.random().toString(36).slice(2), label, createdAt: new Date().toISOString(), data },
    ...backups,
  ].slice(0, 10);
  window.localStorage.setItem(BACKUP_KEY, JSON.stringify(next));
  return next;
}

export function deleteBackup(id: string): Backup[] {
  const next = listBackups().filter((b) => b.id !== id);
  window.localStorage.setItem(BACKUP_KEY, JSON.stringify(next));
  return next;
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
