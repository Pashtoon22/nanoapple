export type SkillBar = { id: string; name: string; level: number };
export type SoftwareSkill = { id: string; name: string; level: number };
export type LanguageItem = { id: string; name: string; proficiency: string };

export type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  projects: string;
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  details: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  year: string;
  area: string;
  client: string;
  role: string;
  responsibilities: string;
  software: string[];
  image: string;
};

export type SimpleItem = { id: string; title: string; subtitle: string; year: string };
export type ReferenceItem = {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  portfolio: string;
  nationality: string;
  photo: string;
  summary: string;
};

export type SectionKey =
  | "experience"
  | "education"
  | "projects"
  | "awards"
  | "certifications"
  | "memberships"
  | "publications"
  | "workshops"
  | "references";

export type ResumeTheme = {
  navy: string;
  accent: string;
  charcoal: string;
  fontFamily: "Inter" | "Manrope" | "Poppins";
  density: "compact" | "normal" | "relaxed";
  layout: "sidebar-left" | "sidebar-right";
  showBlueprint: boolean;
};

export type ResumeData = {
  personal: PersonalInfo;
  skills: SkillBar[];
  software: SoftwareSkill[];
  languages: LanguageItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  awards: SimpleItem[];
  certifications: SimpleItem[];
  memberships: SimpleItem[];
  publications: SimpleItem[];
  workshops: SimpleItem[];
  references: ReferenceItem[];
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  theme: ResumeTheme;
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const SECTION_LABELS: Record<SectionKey, string> = {
  experience: "Work Experience",
  education: "Education",
  projects: "Project Portfolio",
  awards: "Awards",
  certifications: "Certifications",
  memberships: "Professional Memberships",
  publications: "Publications",
  workshops: "Workshops & Training",
  references: "References",
};
