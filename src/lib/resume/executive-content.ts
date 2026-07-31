/**
 * Professionally rewritten executive content derived from the source CV.
 * Wording is condensed, de-duplicated and re-written in international
 * professional English with ATS-friendly action verbs.
 */

export type ExecExperience = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
};

export type ExecProject = {
  name: string;
  meta: string;
  detail: string;
};

export const execProfile = {
  name: "Abdul Qader Wadan",
  title: "Senior Architect | Engineering Coordinator | Project Manager",
  subtitle: "WASH Engineer • QC Manager • Estimation Engineer • Urban Planner",
  email: "eng.qader@gmail.com",
  phone: "+93 787 308 321",
  location: "Kabul, Afghanistan",
  linkedin: "linkedin.com/in/abdulqaderwadan",
  nationality: "Afghan",
};

export const professionalProfile =
  "Chartered-level Senior Architect and Engineering Coordinator with more than 18 years of international-standard experience delivering public, institutional, humanitarian and infrastructure projects across Afghanistan. Recognised for uniting architectural design leadership with disciplined project management, quality assurance and cost control — from concept design and IBC/Neufert-compliant documentation through tendering, site supervision and handover.";

export const careerSummary = [
  "Directed the architectural design and delivery of schools, clinics, mosques, orphanages, commercial and residential buildings for donor-funded and government programmes.",
  "Coordinated multidisciplinary architectural, structural and MEP teams, establishing unified drawing standards that reduced site queries and rework.",
  "Managed full project lifecycles for international clients including MBRCH, USACE, PRT-funded programmes and humanitarian organisations.",
  "Delivered nationwide WASH infrastructure — boreholes, surface and elevated reservoirs, ablution and hand-wash facilities — with standardised, replicable design details.",
  "Led QA/QC systems covering submittal control, material verification, as-built management and stop-work authority.",
  "Produced BOQs, cost breakdowns and tender estimates for multi-million-dollar donor construction packages.",
];

export const coreCompetencies = [
  "Architectural Design Leadership",
  "Project & Programme Management",
  "Engineering Coordination",
  "Construction Documentation",
  "Quality Assurance / QC Systems",
  "Cost Estimation & BOQ Control",
  "WASH & Water Infrastructure",
  "Site Supervision & Handover",
  "Tender & Contract Review",
  "Urban & Town Planning",
  "Team Leadership & Mentoring",
  "Donor & Stakeholder Reporting",
];

export const experience: ExecExperience[] = [
  {
    company: "Zia Ayoubi Construction Company (ZACC)",
    role: "Architect & Engineering Coordinator",
    location: "Kabul, Afghanistan",
    period: "Jan 2025 – May 2026",
    bullets: [
      "Led architectural design and shop-drawing production for commercial, residential, educational, healthcare and religious buildings in full compliance with IBC and Neufert standards.",
      "Established a single coordinated drawing standard across architectural and MEP disciplines, measurably reducing site RFIs and rework.",
      "Directed project planning, master scheduling and resource allocation covering finance, materials and site staffing.",
      "Acted as QC Engineer — reviewing specifications, contract documents, submittals and as-built drawings prior to approval.",
      "Chaired weekly coordination meetings and conducted daily inspections to safeguard programme, cost and quality targets.",
    ],
  },
  {
    company: "Humanitarian Assistance Society (H.A.S)",
    role: "Architect & Engineering Coordinator",
    location: "Multi-province, Afghanistan",
    period: "Jul 2017 – Dec 2024",
    bullets: [
      "Headed nationwide architectural design of schools, clinics, orphanages, mosques and community facilities for humanitarian programmes.",
      "Designed and supervised WASH infrastructure including water wells, surface reservoirs and elevated water tanks across multiple provinces.",
      "Standardised WASH design details, enabling rapid, cost-efficient replication of water and sanitation facilities nationwide.",
      "Delivered seven consecutive years of humanitarian construction without a quality-driven project stoppage.",
      "Owned scheduling, estimating, site surveying, monitoring and donor reporting across the portfolio.",
    ],
  },
  {
    company: "Mohammad Bin Rashid Al Maktoum Humanitarian & Charity Establishment (MBRCH)",
    role: "Architect Designer | QC Manager | Operations Manager",
    location: "Kandahar, Afghanistan",
    period: "Oct 2013 – Jun 2017",
    bullets: [
      "Held six concurrent technical mandates — design, WASH engineering, quality control, operations, estimation and town planning — on a single donor programme.",
      "Delivered a complete potable-water network for the MBR Disabled People Town, providing year-round supply to township residents.",
      "Completed the water supply system, hand-wash facilities and ablution building for Sheikh Sayed Orphanage, Kandahar City.",
      "Governed QA/QC through submittal review, daily inspection, as-built control and weekly coordination forums.",
      "Prepared cost estimates, BOQs and cost-breakdown analyses for USACE and PRT-funded projects.",
      "Executed town-planning studies covering site survey and the zoning of commercial, residential, public and road networks.",
    ],
  },
  {
    company: "Sadiq Noor Construction Co. / Waheed Zia Construction Co. JV",
    role: "Architect Designer & Construction Manager",
    location: "Nangarhar, Afghanistan",
    period: "Jun 2012 – Sep 2013",
    bullets: [
      "Designed donor-funded schools, clinics and mosques with complete 2D/3D documentation packages.",
      "Managed construction delivery with structured daily, weekly and monthly reporting to head office.",
      "Implemented a rigorous concrete testing regime — slump, air content and 7/14/21/28-day compression testing — maintaining full compliance across all pours.",
      "Prepared BOQs and cost-breakdown analyses for USACE, PRT and other donor tenders.",
      "Conducted pre-task safety briefings for skilled and unskilled workforces.",
    ],
  },
  {
    company: "Sadiq Noor Construction Co. / Urban Builders Group JV",
    role: "Architect Designer & QC / Submittals Manager",
    location: "Herat, Afghanistan",
    period: "Oct 2011 – May 2012",
    bullets: [
      "Built the joint venture's submittal control system from inception, delivering full traceability from approval to installation.",
      "Reviewed shop drawings and submittals for conformance with project specifications and donor requirements.",
      "Led preparatory, initial and follow-up quality meetings for every definable feature of work.",
      "Verified delivered materials against approved submittals and maintained daily as-built records.",
      "Exercised stop-work authority to resolve safety and quality non-conformances.",
    ],
  },
  {
    company: "Sadiq Noor Construction Company (SNCC) — Head Office",
    role: "Architect Designer & Design Team Manager",
    location: "Kabul, Afghanistan",
    period: "May 2010 – Sep 2011",
    bullets: [
      "Led the in-house design team producing school, clinic and mosque designs to IBC and Neufert standards.",
      "Defined the company's design quality directives, KPI dashboards and reporting standards still in use today.",
      "Prepared and analysed departmental budgets and financial performance reports.",
      "Estimated USACE and PRT tenders and scrutinised tender documents, drawings and schedules.",
      "Mentored and appraised design staff on evolving codes, tools and business guidelines.",
    ],
  },
  {
    company: "Mohammad Bin Rashid Al Maktoum Charitable Foundation (MBR)",
    role: "Architect Designer, Surveyor & Interior Designer",
    location: "Afghanistan",
    period: "Jan 2009 – Apr 2010",
    bullets: [
      "Produced scaled foundation, building and structural drawings from consolidated site data.",
      "Assessed the technical implications of design concepts including loads, volumes and stress factors.",
      "Designed interior layouts, finishes, colour schemes and material specifications for commercial premises.",
      "Operated survey instrumentation, including EDM, for site data capture and setting out.",
    ],
  },
  {
    company: "Atal Yadgar Construction & Engineering Company",
    role: "Architect Surveyor & Draftsman",
    location: "Afghanistan",
    period: "Jun 2007 – Dec 2008",
    bullets: [
      "Surveyed heritage and historic residential buildings and produced accurate measured drawing sets.",
      "Mapped projects and issued complete construction drawing packages.",
    ],
  },
];

export const keyResponsibilities = [
  "Architectural concept development, design development and construction documentation.",
  "Coordination of architectural, structural and MEP disciplines across concurrent packages.",
  "Programme planning, master scheduling and resource management.",
  "Quality assurance, submittal control, inspection regimes and as-built verification.",
  "Cost estimation, BOQ preparation and tender evaluation.",
  "WASH infrastructure design, delivery and commissioning.",
  "Client, donor and authority liaison with formal progress reporting.",
];

export const majorProjects: ExecProject[] = [
  {
    name: "MBR Disabled People Town — Water Supply System",
    meta: "Panjwaye, Kandahar · MBRCH · 2014",
    detail:
      "Full design and construction supervision of source, storage and distribution networks for a township serving residents with disabilities.",
  },
  {
    name: "Sheikh Sayed Orphanage — Facilities Package",
    meta: "Kohkaran, Kandahar · MBRCH · 2015",
    detail:
      "Water supply system, student hand-wash facilities and ablution building delivered from design through supervised handover.",
  },
  {
    name: "IHH Orphanage — Hand-Wash Facilities",
    meta: "Jowzjan Province · H.A.S · 2019",
    detail:
      "Sanitation and hand-wash facilities designed and constructed for orphanage students, including layout, detailing and supervision.",
  },
  {
    name: "National WASH Programme — Wells & Reservoirs",
    meta: "Multi-province · H.A.S · 2017–2024",
    detail:
      "Survey, design and construction of wells, surface and elevated reservoirs with standardised, repeatable detailing.",
  },
  {
    name: "Public Schools & Clinics Programme",
    meta: "Nangarhar & Herat · USACE / PRT · 2011–2013",
    detail:
      "Architectural design, shop drawings, submittal control and construction quality management for donor-funded facilities.",
  },
  {
    name: "Community Mosques & Ablution Buildings",
    meta: "Multi-province · Multiple donors · 2013–2026",
    detail:
      "Concept to construction documentation balancing traditional architectural form with efficient modern construction.",
  },
];

export const education = [
  {
    degree: "Bachelor of Architecture",
    school: "Kabul University — Faculty of Engineering",
    meta: "Kabul, Afghanistan · 2009",
    detail:
      "Architectural design, building technology, structures and urban planning.",
  },
  {
    degree: "High School Diploma",
    school: "Yusuf Abad High School, Bajaur",
    meta: "Pakistan · 1996",
    detail: "",
  },
];

export const technicalSkills = [
  { name: "Architectural Design", level: 95 },
  { name: "Project Management", level: 92 },
  { name: "Construction Documentation", level: 94 },
  { name: "Quality Assurance / QC", level: 93 },
  { name: "Cost Estimation & BOQ", level: 90 },
  { name: "WASH Engineering", level: 88 },
  { name: "BIM Coordination", level: 80 },
  { name: "Interior Design", level: 82 },
];

export const softwareSkills = [
  { name: "AutoCAD", level: 96 },
  { name: "3ds Max", level: 88 },
  { name: "SketchUp", level: 90 },
  { name: "Lumion", level: 85 },
  { name: "Autodesk Revit", level: 82 },
  { name: "V-Ray", level: 78 },
  { name: "MS Project", level: 86 },
  { name: "Microsoft Office", level: 92 },
  { name: "Adobe Photoshop", level: 80 },
];

export const languages = [
  { name: "Pashto", level: "Native" },
  { name: "Dari", level: "Native" },
  { name: "Urdu", level: "Fluent" },
  { name: "English", level: "Professional" },
];

export const strengths = [
  "Decisive leadership under demanding site conditions",
  "Meticulous attention to detail and code compliance",
  "Clear communication with donors and authorities",
  "Systematic, process-driven quality culture",
  "Commercial awareness and cost discipline",
  "Calm, dependable delivery in complex environments",
];

export const certifications = [
  "IBC & Neufert Applied Design Standards — professional practice",
  "Microsoft Project — Planning & Scheduling",
  "Excel BOQ Automation Formats — self-developed estimating templates",
  "Proposal Writing & Management Tools — internal systems development",
];

export const references = [
  {
    name: "Eng. Najeebullah Hussain Kheil",
    title: "Mechanical Design Team Manager",
    phone: "+93 700 001 298",
    email: "nh8239@gmail.com",
  },
  {
    name: "Hashmatullah Majede",
    title: "Project Manager",
    phone: "+93 700 474 441",
    email: "eng.hashmat@yahoo.com",
  },
];

export const coverLetter = {
  greeting: "Dear Hiring Manager,",
  paragraphs: [
    "I am writing to express my strong interest in senior architectural and engineering leadership opportunities within your organisation. With more than 18 years of progressive experience as a Senior Architect, Engineering Coordinator and Project Manager, I have delivered public, institutional, humanitarian and infrastructure projects for international donors including MBRCH, USACE, PRT-funded programmes and leading humanitarian agencies.",
    "My career has been built on the ability to lead a project from first concept to supervised handover. I have directed the architectural design of schools, clinics, mosques, orphanages, commercial and residential buildings to IBC and Neufert standards, while simultaneously coordinating architectural, structural and MEP disciplines. Establishing unified drawing standards across those disciplines has consistently reduced site queries, rework and programme risk.",
    "Alongside design leadership, I bring hard delivery experience in project management, quality control and cost engineering. I have implemented submittal control systems from inception, exercised stop-work authority to resolve non-conformances, managed inspection and concrete testing regimes, and prepared BOQs, tender estimates and cost-breakdown analyses for multi-million-dollar donor packages. In parallel, I have designed and supervised nationwide WASH infrastructure — boreholes, surface and elevated reservoirs, ablution and hand-wash facilities — standardising details so that facilities could be replicated rapidly and economically across provinces.",
    "I work fluently with international teams, donor requirements and formal reporting frameworks, and I am equally comfortable in the design studio, the coordination meeting and on site. I would welcome the opportunity to bring this combination of architectural rigour, engineering coordination and delivery discipline to your projects.",
    "Thank you for considering my application. I would be pleased to discuss how my experience aligns with your current requirements, and I am available for interview at your convenience.",
  ],
  closing: "Yours sincerely,",
};
