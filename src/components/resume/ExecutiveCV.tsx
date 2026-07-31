import type { ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Building2,
  GraduationCap,
  Wrench,
  MonitorSmartphone,
  Languages as LanguagesIcon,
  Award,
  Users,
  Compass,
  ListChecks,
  Briefcase,
  Star,
} from "lucide-react";
import {
  execProfile,
  professionalProfile,
  careerSummary,
  coreCompetencies,
  experience,
  keyResponsibilities,
  majorProjects,
  education,
  technicalSkills,
  softwareSkills,
  languages,
  strengths,
  certifications,
  references,
} from "@/lib/resume/executive-content";

/* ---------------- shared primitives ---------------- */

export function Sheet({
  children,
  page,
  total,
}: {
  children: ReactNode;
  page: number;
  total: number;
}) {
  return (
    <div className="exec-sheet relative flex flex-col bg-white text-[#111214]">
      <div className="exec-topbar" />
      <div className="flex-1 px-[14mm] pt-[9mm] pb-[6mm]">{children}</div>
      <div className="exec-footer">
        <span>{execProfile.name} — Curriculum Vitae</span>
        <span className="exec-footer-rule" />
        <span>
          Page {page} of {total}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <div className="mb-[3mm] flex items-center gap-2">
      <span className="flex h-[6mm] w-[6mm] items-center justify-center rounded-[2px] bg-[#111214]">
        <Icon className="h-[3.2mm] w-[3.2mm] text-[#C9A227]" strokeWidth={2} />
      </span>
      <h2 className="text-[10.5pt] font-semibold uppercase tracking-[0.18em] text-[#111214]">
        {children}
      </h2>
      <span className="ml-2 h-px flex-1 bg-[#C9A227]/60" />
    </div>
  );
}

function SideTitle({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <div className="mb-[2.5mm] flex items-center gap-2">
      <Icon className="h-[3.4mm] w-[3.4mm] text-[#C9A227]" strokeWidth={2} />
      <h3 className="text-[8.5pt] font-semibold uppercase tracking-[0.16em] text-white">
        {children}
      </h3>
    </div>
  );
}

function Bar({ level }: { level: number }) {
  return (
    <div className="mt-[1mm] h-[1.1mm] w-full rounded-full bg-white/15">
      <div
        className="h-full rounded-full bg-[#C9A227]"
        style={{ width: `${level}%` }}
      />
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-[1.4mm]">
      {items.map((t) => (
        <li key={t} className="flex gap-[2mm] text-[9pt] leading-[1.45] text-[#2B2D31]">
          <span className="mt-[1.6mm] h-[1.2mm] w-[1.2mm] shrink-0 rotate-45 bg-[#C9A227]" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- sidebar ---------------- */

function Sidebar({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <aside className="exec-side flex w-[62mm] shrink-0 flex-col gap-[5mm] bg-[#111214] px-[6mm] py-[6mm]">
      {variant === 1 && (
        <>
          <div>
            <SideTitle icon={Mail}>Contact</SideTitle>
            <ul className="space-y-[1.8mm] text-[8.2pt] leading-[1.35] text-white/85">
              <li className="flex items-start gap-[2mm]">
                <Phone className="mt-[0.4mm] h-[3mm] w-[3mm] shrink-0 text-[#C9A227]" />
                {execProfile.phone}
              </li>
              <li className="flex items-start gap-[2mm] break-all">
                <Mail className="mt-[0.4mm] h-[3mm] w-[3mm] shrink-0 text-[#C9A227]" />
                {execProfile.email}
              </li>
              <li className="flex items-start gap-[2mm]">
                <MapPin className="mt-[0.4mm] h-[3mm] w-[3mm] shrink-0 text-[#C9A227]" />
                {execProfile.location}
              </li>
              <li className="flex items-start gap-[2mm] break-all">
                <Linkedin className="mt-[0.4mm] h-[3mm] w-[3mm] shrink-0 text-[#C9A227]" />
                {execProfile.linkedin}
              </li>
              <li className="flex items-start gap-[2mm]">
                <Globe className="mt-[0.4mm] h-[3mm] w-[3mm] shrink-0 text-[#C9A227]" />
                {execProfile.nationality} national
              </li>
            </ul>
          </div>

          <div>
            <SideTitle icon={Compass}>Core Competencies</SideTitle>
            <div className="flex flex-wrap gap-[1.5mm]">
              {coreCompetencies.map((c) => (
                <span
                  key={c}
                  className="rounded-[2px] border border-[#C9A227]/40 px-[1.8mm] py-[0.8mm] text-[7.4pt] leading-tight text-white/85"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SideTitle icon={Wrench}>Technical Skills</SideTitle>
            <div className="space-y-[2mm]">
              {technicalSkills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-baseline justify-between text-[8pt] text-white/85">
                    <span>{s.name}</span>
                    <span className="text-[7pt] text-[#C9A227]">{s.level}%</span>
                  </div>
                  <Bar level={s.level} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {variant === 2 && (
        <>
          <div>
            <SideTitle icon={MonitorSmartphone}>Software Skills</SideTitle>
            <div className="space-y-[2mm]">
              {softwareSkills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-baseline justify-between text-[8pt] text-white/85">
                    <span>{s.name}</span>
                    <span className="text-[7pt] text-[#C9A227]">{s.level}%</span>
                  </div>
                  <Bar level={s.level} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SideTitle icon={LanguagesIcon}>Languages</SideTitle>
            <ul className="space-y-[1.6mm] text-[8.2pt] text-white/85">
              {languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between">
                  <span>{l.name}</span>
                  <span className="text-[7.4pt] uppercase tracking-wider text-[#C9A227]">
                    {l.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SideTitle icon={Star}>Professional Strengths</SideTitle>
            <ul className="space-y-[1.6mm] text-[8pt] leading-[1.4] text-white/85">
              {strengths.map((s) => (
                <li key={s} className="flex gap-[2mm]">
                  <span className="mt-[1.6mm] h-[1.1mm] w-[1.1mm] shrink-0 rotate-45 bg-[#C9A227]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {variant === 3 && (
        <>
          <div>
            <SideTitle icon={Award}>Certifications & Training</SideTitle>
            <ul className="space-y-[1.8mm] text-[8pt] leading-[1.4] text-white/85">
              {certifications.map((c) => (
                <li key={c} className="flex gap-[2mm]">
                  <span className="mt-[1.6mm] h-[1.1mm] w-[1.1mm] shrink-0 rotate-45 bg-[#C9A227]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SideTitle icon={Compass}>Sector Experience</SideTitle>
            <ul className="space-y-[1.6mm] text-[8pt] leading-[1.4] text-white/85">
              {[
                "Education & healthcare facilities",
                "Religious & community buildings",
                "Humanitarian & donor programmes",
                "Water, sanitation & hygiene (WASH)",
                "Commercial & residential development",
                "Urban planning & town zoning",
              ].map((s) => (
                <li key={s} className="flex gap-[2mm]">
                  <span className="mt-[1.6mm] h-[1.1mm] w-[1.1mm] shrink-0 rotate-45 bg-[#C9A227]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {variant === 4 && (
        <>
          <div>
            <SideTitle icon={Users}>References</SideTitle>
            <ul className="space-y-[3mm] text-[8pt] leading-[1.4] text-white/85">
              {references.map((r) => (
                <li key={r.email}>
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-[7.6pt] text-[#C9A227]">{r.title}</p>
                  <p className="break-all">{r.phone}</p>
                  <p className="break-all">{r.email}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SideTitle icon={Mail}>Contact</SideTitle>
            <ul className="space-y-[1.6mm] text-[8.2pt] leading-[1.35] text-white/85">
              <li className="break-all">{execProfile.phone}</li>
              <li className="break-all">{execProfile.email}</li>
              <li>{execProfile.location}</li>
              <li className="break-all">{execProfile.linkedin}</li>
            </ul>
          </div>

          <div className="mt-auto border-t border-white/15 pt-[3mm] text-[7.4pt] leading-[1.4] text-white/60">
            Certificates, detailed drawings and a full project portfolio are
            available on request.
          </div>
        </>
      )}

    </aside>
  );
}

/* ---------------- masthead ---------------- */

function Masthead() {
  return (
    <header className="mb-[6mm] border-b-2 border-[#111214] pb-[4mm]">
      <p className="text-[8pt] uppercase tracking-[0.42em] text-[#C9A227]">
        Curriculum Vitae
      </p>
      <h1 className="mt-[1.5mm] text-[26pt] font-semibold leading-none tracking-[-0.01em] text-[#111214]">
        {execProfile.name}
      </h1>
      <p className="mt-[2mm] text-[10.5pt] font-medium tracking-[0.04em] text-[#111214]">
        {execProfile.title}
      </p>
      <p className="mt-[1mm] text-[8.6pt] tracking-[0.06em] text-[#6B6E76]">
        {execProfile.subtitle}
      </p>
    </header>
  );
}

function ExperienceBlock({ item }: { item: (typeof experience)[number] }) {
  return (
    <article className="break-inside-avoid mb-[4.5mm]">
      <div className="flex items-baseline justify-between gap-[3mm]">
        <h3 className="text-[10pt] font-semibold text-[#111214]">{item.role}</h3>
        <span className="shrink-0 rounded-[2px] bg-[#111214] px-[2mm] py-[0.6mm] text-[7.4pt] font-medium tracking-wide text-[#C9A227]">
          {item.period}
        </span>
      </div>
      <p className="mb-[2mm] text-[8.6pt] italic text-[#6B6E76]">
        {item.company} · {item.location}
      </p>
      <Bullets items={item.bullets} />
    </article>
  );
}

/* ---------------- pages ---------------- */

export function ExecutiveCV() {
  const total = 4;
  return (
    <div id="exec-cv" className="exec-doc flex flex-col items-center gap-6">
      {/* PAGE 1 */}
      <Sheet page={1} total={total}>
        <div className="flex h-full gap-[7mm]">
          <div className="flex-1">
            <Masthead />
            <section className="mb-[5mm]">
              <SectionTitle icon={Briefcase}>Professional Profile</SectionTitle>
              <p className="text-[9.2pt] leading-[1.5] text-[#2B2D31]">
                {professionalProfile}
              </p>
            </section>
            <section className="mb-[5mm]">
              <SectionTitle icon={ListChecks}>Career Summary</SectionTitle>
              <Bullets items={careerSummary} />
            </section>
            <section>
              <SectionTitle icon={Building2}>Professional Experience</SectionTitle>
              {experience.slice(0, 1).map((e) => (
                <ExperienceBlock key={e.company} item={e} />
              ))}
            </section>
          </div>
          <Sidebar variant={1} />
        </div>
      </Sheet>

      {/* PAGE 2 */}
      <Sheet page={2} total={total}>
        <div className="flex h-full gap-[7mm]">
          <div className="flex-1">
            <section>
              <SectionTitle icon={Building2}>
                Professional Experience (continued)
              </SectionTitle>
              {experience.slice(1, 4).map((e) => (
                <ExperienceBlock key={e.company} item={e} />
              ))}
            </section>
          </div>
          <Sidebar variant={2} />
        </div>
      </Sheet>

      {/* PAGE 3 */}
      <Sheet page={3} total={total}>
        <div className="flex h-full gap-[7mm]">
          <div className="flex-1">
            <section>
              <SectionTitle icon={Building2}>
                Professional Experience (continued)
              </SectionTitle>
              {experience.slice(4).map((e) => (
                <ExperienceBlock key={e.company} item={e} />
              ))}
            </section>
          </div>
          <Sidebar variant={3} />
        </div>
      </Sheet>

      {/* PAGE 4 */}
      <Sheet page={4} total={total}>
        <div className="flex h-full gap-[7mm]">
          <div className="flex-1">
            <section className="mb-[5mm]">
              <SectionTitle icon={ListChecks}>Key Responsibilities</SectionTitle>
              <Bullets items={keyResponsibilities} />
            </section>

            <section className="mb-[5mm]">
              <SectionTitle icon={Compass}>Major Projects</SectionTitle>
              <div className="grid grid-cols-2 gap-[3mm]">
                {majorProjects.map((p) => (
                  <div
                    key={p.name}
                    className="break-inside-avoid border-l-2 border-[#C9A227] pl-[2.5mm]"
                  >
                    <p className="text-[8.8pt] font-semibold leading-tight text-[#111214]">
                      {p.name}
                    </p>
                    <p className="text-[7.4pt] uppercase tracking-wide text-[#C9A227]">
                      {p.meta}
                    </p>
                    <p className="mt-[0.8mm] text-[8pt] leading-[1.4] text-[#2B2D31]">
                      {p.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle icon={GraduationCap}>Education</SectionTitle>
              <div className="space-y-[2.5mm]">
                {education.map((e) => (
                  <div key={e.degree} className="break-inside-avoid">
                    <p className="text-[9.4pt] font-semibold text-[#111214]">
                      {e.degree}
                    </p>
                    <p className="text-[8.4pt] italic text-[#6B6E76]">
                      {e.school} · {e.meta}
                    </p>
                    {e.detail && (
                      <p className="text-[8.4pt] leading-[1.4] text-[#2B2D31]">
                        {e.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
          <Sidebar variant={4} />
        </div>
      </Sheet>
    </div>
  );
}

