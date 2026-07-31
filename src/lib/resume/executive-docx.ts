import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  Footer,
  PageNumber,
} from "docx";
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
  coverLetter,
} from "./executive-content";

const GOLD = "C9A227";
const BLACK = "111214";
const GREY = "6B6E76";
const BODY = "2B2D31";

const PAGE = {
  size: { width: 11906, height: 16838 }, // A4 in DXA
  margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
};

const CONTENT_WIDTH = 11906 - 2000; // 9906
const SIDE_W = 3200;
const MAIN_W = CONTENT_WIDTH - SIDE_W;

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function txt(text: string, opts: Record<string, unknown> = {}) {
  return new TextRun({ text, font: "Arial", ...opts });
}

function sectionHeading(text: string) {
  return new Paragraph({
    spacing: { before: 260, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 2 },
    },
    children: [
      txt(text.toUpperCase(), { bold: true, size: 22, color: BLACK, characterSpacing: 40 }),
    ],
  });
}

function bullet(text: string, color = BODY) {
  return new Paragraph({
    numbering: { reference: "gold-bullets", level: 0 },
    spacing: { after: 60 },
    children: [txt(text, { size: 19, color })],
  });
}

function body(text: string) {
  return new Paragraph({
    spacing: { after: 100, line: 280 },
    children: [txt(text, { size: 19, color: BODY })],
  });
}

function sideHeading(text: string) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [
      txt(text.toUpperCase(), { bold: true, size: 17, color: GOLD, characterSpacing: 30 }),
    ],
  });
}

function sideLine(text: string, opts: Record<string, unknown> = {}) {
  return new Paragraph({
    spacing: { after: 50 },
    children: [txt(text, { size: 16, color: "FFFFFF", ...opts })],
  });
}

function sideBullet(text: string) {
  return new Paragraph({
    spacing: { after: 50 },
    children: [txt(`•  ${text}`, { size: 16, color: "FFFFFF" })],
  });
}

function experienceParagraphs() {
  const out: Paragraph[] = [];
  for (const e of experience) {
    out.push(
      new Paragraph({
        spacing: { before: 200, after: 20 },
        children: [
          txt(e.role, { bold: true, size: 21, color: BLACK }),
          txt("   |   ", { size: 19, color: GOLD }),
          txt(e.period, { bold: true, size: 18, color: GOLD }),
        ],
      }),
    );
    out.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          txt(`${e.company} · ${e.location}`, { italics: true, size: 18, color: GREY }),
        ],
      }),
    );
    for (const b of e.bullets) out.push(bullet(b));
  }
  return out;
}

function mainColumn(): Paragraph[] {
  const out: Paragraph[] = [];

  out.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        txt("CURRICULUM VITAE", { size: 16, color: GOLD, characterSpacing: 120 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [txt(execProfile.name, { bold: true, size: 44, color: BLACK })],
    }),
    new Paragraph({
      spacing: { after: 30 },
      children: [txt(execProfile.title, { bold: true, size: 21, color: BLACK })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: BLACK, space: 4 },
      },
      children: [txt(execProfile.subtitle, { size: 17, color: GREY })],
    }),
  );

  out.push(sectionHeading("Professional Profile"), body(professionalProfile));
  out.push(sectionHeading("Career Summary"), ...careerSummary.map((t) => bullet(t)));
  out.push(sectionHeading("Professional Experience"), ...experienceParagraphs());
  out.push(
    sectionHeading("Key Responsibilities"),
    ...keyResponsibilities.map((t) => bullet(t)),
  );

  out.push(sectionHeading("Major Projects"));
  for (const p of majorProjects) {
    out.push(
      new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [txt(p.name, { bold: true, size: 19, color: BLACK })],
      }),
      new Paragraph({
        spacing: { after: 20 },
        children: [txt(p.meta, { size: 16, color: GOLD })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [txt(p.detail, { size: 18, color: BODY })],
      }),
    );
  }

  out.push(sectionHeading("Education"));
  for (const e of education) {
    out.push(
      new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [txt(e.degree, { bold: true, size: 20, color: BLACK })],
      }),
      new Paragraph({
        spacing: { after: e.detail ? 20 : 80 },
        children: [
          txt(`${e.school} · ${e.meta}`, { italics: true, size: 18, color: GREY }),
        ],
      }),
    );
    if (e.detail) out.push(body(e.detail));
  }

  return out;
}

function sideColumn(): Paragraph[] {
  const out: Paragraph[] = [];

  out.push(sideHeading("Contact"));
  out.push(
    sideLine(execProfile.phone),
    sideLine(execProfile.email),
    sideLine(execProfile.location),
    sideLine(execProfile.linkedin),
    sideLine(`${execProfile.nationality} national`),
  );

  out.push(sideHeading("Core Competencies"));
  for (const c of coreCompetencies) out.push(sideBullet(c));

  out.push(sideHeading("Technical Skills"));
  for (const s of technicalSkills) out.push(sideLine(`${s.name} — ${s.level}%`));

  out.push(sideHeading("Software Skills"));
  for (const s of softwareSkills) out.push(sideLine(`${s.name} — ${s.level}%`));

  out.push(sideHeading("Languages"));
  for (const l of languages) out.push(sideLine(`${l.name} — ${l.level}`));

  out.push(sideHeading("Professional Strengths"));
  for (const s of strengths) out.push(sideBullet(s));

  out.push(sideHeading("Certifications & Training"));
  for (const c of certifications) out.push(sideBullet(c));

  out.push(sideHeading("References"));
  for (const r of references) {
    out.push(
      sideLine(r.name, { bold: true }),
      new Paragraph({
        spacing: { after: 40 },
        children: [txt(r.title, { size: 15, color: GOLD })],
      }),
      sideLine(r.phone),
      sideLine(r.email),
      new Paragraph({ spacing: { after: 80 }, children: [txt("", { size: 12 })] }),
    );
  }

  return out;
}

function baseDoc(children: (Paragraph | Table)[], footerLabel: string) {
  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    numbering: {
      config: [
        {
          reference: "gold-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "▪",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 280, hanging: 200 } },
                run: { color: GOLD, font: "Arial" },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: PAGE },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                border: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 4 },
                },
                tabStops: [{ type: "right" as never, position: CONTENT_WIDTH }],
                children: [
                  txt(`${execProfile.name} — ${footerLabel}`, { size: 15, color: GREY }),
                  txt("\tPage ", { size: 15, color: GREY }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 15, color: GREY, font: "Arial" }),
                  txt(" of ", { size: 15, color: GREY }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: GREY, font: "Arial" }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

export async function buildCvDocx(): Promise<Blob> {
  const table = new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [MAIN_W, SIDE_W],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: MAIN_W, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 0, right: 240 },
            verticalAlign: VerticalAlign.TOP,
            children: mainColumn(),
          }),
          new TableCell({
            borders: noBorders,
            width: { size: SIDE_W, type: WidthType.DXA },
            shading: { fill: BLACK, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: sideColumn(),
          }),
        ],
      }),
    ],
  });

  const doc = baseDoc([table], "Curriculum Vitae");
  return Packer.toBlob(doc);
}

export async function buildCoverLetterDocx(): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 40 },
      children: [txt("COVER LETTER", { size: 16, color: GOLD, characterSpacing: 120 })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [txt(execProfile.name, { bold: true, size: 40, color: BLACK })],
    }),
    new Paragraph({
      spacing: { after: 30 },
      children: [txt(execProfile.title, { bold: true, size: 20, color: BLACK })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [txt(execProfile.subtitle, { size: 17, color: GREY })],
    }),
    new Paragraph({
      spacing: { after: 240 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLACK, space: 4 } },
      children: [
        txt(
          `${execProfile.phone}  ·  ${execProfile.email}  ·  ${execProfile.location}  ·  ${execProfile.linkedin}`,
          { size: 17, color: BODY },
        ),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [txt(today, { size: 18, color: GREY })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [txt(coverLetter.greeting, { bold: true, size: 20, color: BLACK })],
    }),
    ...coverLetter.paragraphs.map(
      (p) =>
        new Paragraph({
          spacing: { after: 160, line: 300 },
          children: [txt(p, { size: 19, color: BODY })],
        }),
    ),
    new Paragraph({
      spacing: { before: 240, after: 240 },
      children: [txt(coverLetter.closing, { size: 19, color: BODY })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GOLD, space: 4 } },
      children: [txt(execProfile.name, { bold: true, size: 26, color: BLACK })],
    }),
    new Paragraph({
      children: [txt(execProfile.subtitle, { size: 17, color: GREY })],
    }),
  ];

  return Packer.toBlob(baseDoc(children, "Cover Letter"));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
