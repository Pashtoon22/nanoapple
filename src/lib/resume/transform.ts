import { uid, type ResumeData, type SectionKey } from "./types";
import { sampleResume } from "./sample";

type Any = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const arr = (v: unknown): Any[] => (Array.isArray(v) ? (v as Any[]) : []);
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);

export function mergeParsed(parsed: Any, base: ResumeData): ResumeData {
  const p = (parsed.personal ?? {}) as Any;
  const simple = (key: string) =>
    arr(parsed[key]).map((i) => ({
      id: uid(),
      title: str(i.title),
      subtitle: str(i.subtitle),
      year: str(i.year),
    }));

  return {
    ...base,
    personal: {
      ...base.personal,
      fullName: str(p.fullName) || base.personal.fullName,
      jobTitle: str(p.jobTitle) || base.personal.jobTitle,
      email: str(p.email),
      phone: str(p.phone),
      location: str(p.location),
      website: str(p.website),
      linkedin: str(p.linkedin),
      portfolio: str(p.portfolio),
      nationality: str(p.nationality),
      summary: str(p.summary) || base.personal.summary,
    },
    skills: arr(parsed.skills).map((s) => ({
      id: uid(),
      name: str(s.name),
      level: Number(s.level) || 75,
    })),
    software: arr(parsed.software).map((s) => ({
      id: uid(),
      name: str(s.name),
      level: Number(s.level) || 75,
    })),
    languages: arr(parsed.languages).map((l) => ({
      id: uid(),
      name: str(l.name),
      proficiency: str(l.proficiency),
    })),
    experience: arr(parsed.experience).map((e) => ({
      id: uid(),
      company: str(e.company),
      position: str(e.position),
      location: str(e.location),
      startDate: str(e.startDate),
      endDate: str(e.endDate),
      current: /present/i.test(str(e.endDate)),
      responsibilities: strs(e.responsibilities),
      achievements: strs(e.achievements),
      projects: str(e.projects),
    })),
    education: arr(parsed.education).map((e) => ({
      id: uid(),
      degree: str(e.degree),
      institution: str(e.institution),
      location: str(e.location),
      year: str(e.year),
      details: str(e.details),
    })),
    projects: arr(parsed.projects).map((pr) => ({
      id: uid(),
      name: str(pr.name),
      category: str(pr.category),
      location: str(pr.location),
      year: str(pr.year),
      area: str(pr.area),
      client: str(pr.client),
      role: str(pr.role),
      responsibilities: str(pr.responsibilities),
      software: strs(pr.software),
      image: "",
    })),
    awards: simple("awards"),
    certifications: simple("certifications"),
    memberships: simple("memberships"),
    publications: simple("publications"),
    workshops: simple("workshops"),
    references: arr(parsed.references).map((r) => ({
      id: uid(),
      name: str(r.name),
      title: str(r.title),
      phone: str(r.phone),
      email: str(r.email),
    })),
    sectionOrder: base.sectionOrder as SectionKey[],
  };
}

export function resumeToText(d: ResumeData): string {
  const lines: string[] = [
    d.personal.fullName,
    d.personal.jobTitle,
    [d.personal.email, d.personal.phone, d.personal.location].filter(Boolean).join(" | "),
    "",
    "SUMMARY",
    d.personal.summary,
    "",
    "SKILLS",
    d.skills.map((s) => s.name).join(", "),
    "SOFTWARE",
    d.software.map((s) => s.name).join(", "),
    "",
    "EXPERIENCE",
  ];
  d.experience.forEach((e) => {
    lines.push(
      `${e.position} — ${e.company}, ${e.location} (${e.startDate} - ${e.current ? "Present" : e.endDate})`,
    );
    e.responsibilities.forEach((r) => lines.push(`- ${r}`));
    e.achievements.forEach((a) => lines.push(`* ${a}`));
  });
  lines.push("", "EDUCATION");
  d.education.forEach((e) => lines.push(`${e.degree}, ${e.institution} (${e.year})`));
  lines.push("", "PROJECTS");
  d.projects.forEach((p) =>
    lines.push(`${p.name} — ${p.category}, ${p.location} ${p.year}. ${p.responsibilities}`),
  );
  return lines.filter((l) => l !== undefined).join("\n");
}

export const emptyResume: ResumeData = {
  ...sampleResume,
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    portfolio: "",
    nationality: "",
    photo: "",
    summary: "",
  },
  skills: [],
  software: [],
  languages: [],
  experience: [],
  education: [],
  projects: [],
  awards: [],
  certifications: [],
  memberships: [],
  publications: [],
  workshops: [],
  references: [],
};
