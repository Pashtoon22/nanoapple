import { forwardRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Link2,
  Flag,
  Building2,
  GraduationCap,
  Award,
  BadgeCheck,
  Users,
  BookOpen,
  Presentation,
  UserRound,
} from "lucide-react";
import type { ResumeData, SectionKey } from "@/lib/resume/types";
import { SECTION_LABELS } from "@/lib/resume/types";

const DENSITY = { compact: 0.9, normal: 1, relaxed: 1.12 } as const;
const FONT_STACK = {
  Inter: "'Inter', system-ui, sans-serif",
  Manrope: "'Manrope', system-ui, sans-serif",
  Poppins: "'Poppins', system-ui, sans-serif",
} as const;

const SECTION_ICON: Record<SectionKey, typeof Building2> = {
  experience: Building2,
  education: GraduationCap,
  projects: Presentation,
  awards: Award,
  certifications: BadgeCheck,
  memberships: Users,
  publications: BookOpen,
  workshops: Presentation,
  references: UserRound,
};

function Rule({ color }: { color: string }) {
  return (
    <div className="mt-1.5 mb-3 flex items-center gap-1.5">
      <span className="h-[2px] w-8" style={{ background: color }} />
      <span className="h-px flex-1" style={{ background: `${color}33` }} />
    </div>
  );
}

function SectionTitle({
  k,
  navy,
  accent,
}: {
  k: SectionKey;
  navy: string;
  accent: string;
}) {
  const Icon = SECTION_ICON[k];
  return (
    <div className="break-inside-avoid">
      <div className="flex items-center gap-2">
        <Icon className="h-[13px] w-[13px]" style={{ color: accent }} strokeWidth={2} />
        <h2
          className="text-[11.5px] font-bold uppercase tracking-[0.18em]"
          style={{ color: navy }}
        >
          {SECTION_LABELS[k]}
        </h2>
      </div>
      <Rule color={accent} />
    </div>
  );
}

function Bar({ level, accent }: { level: number; accent: string }) {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(4, Math.min(100, level))}%`, background: accent }}
      />
    </div>
  );
}

export const ResumePreview = forwardRef<HTMLDivElement, { data: ResumeData }>(
  function ResumePreview({ data }, ref) {
    const { theme, personal } = data;
    const scale = DENSITY[theme.density];
    const accent = theme.accent;
    const navy = theme.navy;
    const charcoal = theme.charcoal;
    const qrTarget = personal.portfolio || personal.website || personal.linkedin;
    const qr = qrTarget
      ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(
          qrTarget.startsWith("http") ? qrTarget : `https://${qrTarget}`,
        )}`
      : "";

    const contacts = [
      { icon: Mail, value: personal.email },
      { icon: Phone, value: personal.phone },
      { icon: MapPin, value: personal.location },
      { icon: Globe, value: personal.website },
      { icon: Linkedin, value: personal.linkedin },
      { icon: Link2, value: personal.portfolio },
      { icon: Flag, value: personal.nationality },
    ].filter((c) => c.value);

    const visible = data.sectionOrder.filter((s) => !data.hiddenSections.includes(s));

    const sidebar = (
      <aside
        className="relative w-[72mm] shrink-0 px-[9mm] py-[11mm] text-white"
        style={{ background: navy }}
      >
        {theme.showBlueprint && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.9) .5px,transparent .5px),linear-gradient(90deg,rgba(255,255,255,.9) .5px,transparent .5px)",
              backgroundSize: "6mm 6mm",
            }}
          />
        )}
        <div className="relative">
          {personal.photo ? (
            <div
              className="mx-auto mb-5 h-[34mm] w-[34mm] overflow-hidden rounded-sm border"
              style={{ borderColor: accent }}
            >
              <img src={personal.photo} alt={personal.fullName} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className="mx-auto mb-5 grid h-[34mm] w-[34mm] place-items-center rounded-sm border text-2xl font-semibold"
              style={{ borderColor: accent, color: accent }}
            >
              {(personal.fullName || "A")
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
          )}

          <div className="mb-6 text-center">
            <div className="text-[15px] font-semibold leading-tight tracking-tight">
              {personal.fullName || "Your Name"}
            </div>
            <div
              className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              {personal.jobTitle}
            </div>
          </div>

          <SidebarHeading label="Contact" accent={accent} />
          <ul className="mb-6 space-y-[5px]">
            {contacts.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[8.5px] leading-[1.5] text-white/85">
                <c.icon className="mt-[1px] h-[10px] w-[10px] shrink-0" style={{ color: accent }} />
                <span className="break-all">{c.value}</span>
              </li>
            ))}
          </ul>

          {personal.summary && (
            <>
              <SidebarHeading label="Profile" accent={accent} />
              <p className="mb-6 text-[8.5px] leading-[1.65] text-white/80">{personal.summary}</p>
            </>
          )}

          {data.skills.length > 0 && (
            <>
              <SidebarHeading label="Technical Skills" accent={accent} />
              <div className="mb-6 space-y-[7px]">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="mb-[3px] flex items-baseline justify-between text-[8.5px] text-white/85">
                      <span>{s.name}</span>
                      <span className="text-[7.5px] text-white/50">{s.level}%</span>
                    </div>
                    <Bar level={s.level} accent={accent} />
                  </div>
                ))}
              </div>
            </>
          )}

          {data.software.length > 0 && (
            <>
              <SidebarHeading label="Software" accent={accent} />
              <div className="mb-6 grid grid-cols-2 gap-[4px]">
                {data.software.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-[2px] border border-white/15 bg-white/[0.06] px-[5px] py-[4px]"
                  >
                    <div className="mb-[3px] truncate text-[7.5px] text-white/90">{s.name}</div>
                    <Bar level={s.level} accent={accent} />
                  </div>
                ))}
              </div>
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <SidebarHeading label="Languages" accent={accent} />
              <ul className="mb-6 space-y-[4px]">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-[8.5px] text-white/85">
                    <span>{l.name}</span>
                    <span style={{ color: accent }}>{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {qr && (
            <>
              <SidebarHeading label="Portfolio" accent={accent} />
              <div className="flex items-center gap-3">
                <img src={qr} alt="Portfolio QR code" className="h-[18mm] w-[18mm] bg-white p-[1mm]" />
                <span className="break-all text-[7.5px] leading-tight text-white/70">{qrTarget}</span>
              </div>
            </>
          )}
        </div>
      </aside>
    );

    const main = (
      <main className="flex-1 px-[11mm] py-[11mm]" style={{ color: charcoal }}>
        <header className="mb-6">
          <h1
            className="text-[26px] font-bold leading-[1.05] tracking-tight"
            style={{ color: navy }}
          >
            {personal.fullName || "Your Name"}
          </h1>
          <div
            className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            {personal.jobTitle}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-[3px] w-14" style={{ background: accent }} />
            <span className="h-px flex-1" style={{ background: `${navy}22` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[8.5px] text-neutral-500">
            {[personal.email, personal.phone, personal.location, personal.linkedin]
              .filter(Boolean)
              .map((c, i) => (
                <span key={i}>{c}</span>
              ))}
          </div>
        </header>

        <div style={{ fontSize: `${9 * scale}px` }} className="space-y-6">
          {visible.map((key) => (
            <section key={key} className="space-y-3">
              <SectionTitle k={key} navy={navy} accent={accent} />
              {key === "experience" && (
                <div className="relative space-y-4 pl-4">
                  <span
                    className="absolute top-1 bottom-1 left-[3px] w-px"
                    style={{ background: `${navy}22` }}
                  />
                  {data.experience.map((e) => (
                    <article key={e.id} className="relative break-inside-avoid">
                      <span
                        className="absolute top-[4px] -left-4 h-[7px] w-[7px] rounded-full border-2 bg-white"
                        style={{ borderColor: accent }}
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="text-[10.5px] font-semibold" style={{ color: navy }}>
                          {e.position}
                        </h3>
                        <span
                          className="rounded-[2px] px-1.5 py-[1px] text-[7.5px] font-medium"
                          style={{ background: `${accent}1f`, color: charcoal }}
                        >
                          {e.startDate} — {e.current ? "Present" : e.endDate}
                        </span>
                      </div>
                      <div className="mt-[2px] text-[8.5px] font-medium text-neutral-600">
                        {e.company}
                        {e.location ? ` · ${e.location}` : ""}
                      </div>
                      {e.responsibilities.length > 0 && (
                        <ul className="mt-1.5 space-y-[3px]">
                          {e.responsibilities.map((r, i) => (
                            <li key={i} className="flex gap-1.5 leading-[1.55] text-neutral-700">
                              <span style={{ color: accent }}>▪</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {e.achievements.length > 0 && (
                        <div
                          className="mt-2 border-l-2 pl-2"
                          style={{ borderColor: `${accent}66` }}
                        >
                          <div
                            className="mb-[2px] text-[7.5px] font-semibold uppercase tracking-widest"
                            style={{ color: accent }}
                          >
                            Key achievements
                          </div>
                          <ul className="space-y-[2px]">
                            {e.achievements.map((a, i) => (
                              <li key={i} className="leading-[1.5] text-neutral-700">
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {e.projects && (
                        <div className="mt-1.5 text-[8px] text-neutral-500">
                          <span className="font-medium">Projects:</span> {e.projects}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {key === "education" &&
                data.education.map((ed) => (
                  <div key={ed.id} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[10px] font-semibold" style={{ color: navy }}>
                        {ed.degree}
                      </h3>
                      <span className="text-[8px] text-neutral-500">{ed.year}</span>
                    </div>
                    <div className="text-[8.5px] text-neutral-600">
                      {ed.institution}
                      {ed.location ? ` · ${ed.location}` : ""}
                    </div>
                    {ed.details && (
                      <p className="mt-[2px] leading-[1.5] text-neutral-600">{ed.details}</p>
                    )}
                  </div>
                ))}

              {key === "projects" && (
                <div className="grid grid-cols-2 gap-3">
                  {data.projects.map((p) => (
                    <article
                      key={p.id}
                      className="break-inside-avoid overflow-hidden rounded-[3px] border"
                      style={{ borderColor: `${navy}1f` }}
                    >
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-[22mm] w-full object-cover" />
                      ) : (
                        <div
                          className="h-[8mm] w-full"
                          style={{
                            background: `repeating-linear-gradient(135deg, ${navy}0d 0 4px, transparent 4px 8px)`,
                          }}
                        />
                      )}
                      <div className="p-2">
                        <div
                          className="text-[7px] font-semibold uppercase tracking-widest"
                          style={{ color: accent }}
                        >
                          {p.category}
                        </div>
                        <h3 className="mt-[1px] text-[9.5px] font-semibold" style={{ color: navy }}>
                          {p.name}
                        </h3>
                        <div className="mt-[2px] text-[7.5px] text-neutral-500">
                          {[p.location, p.year, p.area].filter(Boolean).join(" · ")}
                        </div>
                        {p.client && (
                          <div className="text-[7.5px] text-neutral-500">Client: {p.client}</div>
                        )}
                        {p.role && (
                          <div className="text-[7.5px] font-medium text-neutral-600">{p.role}</div>
                        )}
                        {p.responsibilities && (
                          <p className="mt-1 text-[7.5px] leading-[1.45] text-neutral-600">
                            {p.responsibilities}
                          </p>
                        )}
                        {p.software.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {p.software.map((s) => (
                              <span
                                key={s}
                                className="rounded-[2px] px-1 py-[1px] text-[6.5px]"
                                style={{ background: `${navy}0f`, color: charcoal }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {(["awards", "certifications", "memberships", "publications", "workshops"] as const).includes(
                key as never,
              ) && (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {(data[key as "awards"] ?? []).map((it) => (
                    <li key={it.id} className="break-inside-avoid flex gap-1.5">
                      <span style={{ color: accent }}>▪</span>
                      <span>
                        <span className="font-medium" style={{ color: navy }}>
                          {it.title}
                        </span>
                        {it.subtitle && (
                          <span className="text-neutral-600"> — {it.subtitle}</span>
                        )}
                        {it.year && <span className="text-neutral-500"> ({it.year})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {key === "references" && (
                <div className="grid grid-cols-2 gap-3">
                  {data.references.map((r) => (
                    <div
                      key={r.id}
                      className="break-inside-avoid rounded-[3px] border p-2"
                      style={{ borderColor: `${navy}1f` }}
                    >
                      <div className="text-[9.5px] font-semibold" style={{ color: navy }}>
                        {r.name}
                      </div>
                      <div className="text-[8px] text-neutral-600">{r.title}</div>
                      <div className="mt-[2px] text-[7.5px] text-neutral-500">{r.phone}</div>
                      <div className="text-[7.5px] text-neutral-500">{r.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    );

    return (
      <div
        ref={ref}
        id="resume-print-area"
        className="resume-sheet flex bg-white text-left"
        style={{ fontFamily: FONT_STACK[theme.fontFamily] }}
      >
        {theme.layout === "sidebar-left" ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  },
);

function SidebarHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="mb-2">
      <div className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-white">{label}</div>
      <div className="mt-1 flex items-center gap-1">
        <span className="h-[2px] w-5" style={{ background: accent }} />
        <span className="h-px flex-1 bg-white/15" />
      </div>
    </div>
  );
}
