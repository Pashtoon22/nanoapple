import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { execProfile, coverLetter } from "@/lib/resume/executive-content";

export function ExecutiveCoverLetter() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div id="exec-letter" className="exec-doc flex flex-col items-center gap-6">
      <div className="exec-sheet relative flex flex-col bg-white text-[#111214]">
        <div className="exec-topbar" />
        <div className="flex-1 px-[20mm] pt-[12mm] pb-[8mm]">
          <header className="mb-[8mm] border-b-2 border-[#111214] pb-[4mm]">
            <p className="text-[8pt] uppercase tracking-[0.42em] text-[#C9A227]">
              Cover Letter
            </p>
            <h1 className="mt-[1.5mm] text-[24pt] font-semibold leading-none text-[#111214]">
              {execProfile.name}
            </h1>
            <p className="mt-[2mm] text-[10pt] font-medium tracking-[0.04em] text-[#111214]">
              {execProfile.title}
            </p>
            <div className="mt-[3mm] flex flex-wrap gap-x-[6mm] gap-y-[1mm] text-[8.4pt] text-[#4A4D54]">
              <span className="flex items-center gap-[1.5mm]">
                <Phone className="h-[3mm] w-[3mm] text-[#C9A227]" />
                {execProfile.phone}
              </span>
              <span className="flex items-center gap-[1.5mm]">
                <Mail className="h-[3mm] w-[3mm] text-[#C9A227]" />
                {execProfile.email}
              </span>
              <span className="flex items-center gap-[1.5mm]">
                <MapPin className="h-[3mm] w-[3mm] text-[#C9A227]" />
                {execProfile.location}
              </span>
              <span className="flex items-center gap-[1.5mm]">
                <Linkedin className="h-[3mm] w-[3mm] text-[#C9A227]" />
                {execProfile.linkedin}
              </span>
            </div>
          </header>

          <p className="mb-[6mm] text-[9pt] uppercase tracking-[0.18em] text-[#6B6E76]">
            {today}
          </p>

          <p className="mb-[4mm] text-[10pt] font-semibold text-[#111214]">
            {coverLetter.greeting}
          </p>

          <div className="space-y-[3.5mm]">
            {coverLetter.paragraphs.map((p, i) => (
              <p key={i} className="text-[9.6pt] leading-[1.6] text-[#2B2D31]">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-[8mm]">
            <p className="text-[9.6pt] text-[#2B2D31]">{coverLetter.closing}</p>
            <p className="mt-[6mm] text-[13pt] font-semibold text-[#111214]">
              {execProfile.name}
            </p>
            <span className="mt-[1.5mm] block h-[0.6mm] w-[38mm] bg-[#C9A227]" />
            <p className="mt-[1.5mm] text-[8.4pt] tracking-[0.06em] text-[#6B6E76]">
              {execProfile.subtitle}
            </p>
          </div>
        </div>
        <div className="exec-footer">
          <span>{execProfile.name} — Cover Letter</span>
          <span className="exec-footer-rule" />
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
