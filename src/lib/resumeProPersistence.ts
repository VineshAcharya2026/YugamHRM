import type { Education, Experience, Project, ResumeData, TemplateId } from '../components/resume/pro/types';
import { createEmptyResumeData } from '../components/resume/pro/constants';

export const RESUME_SCHEMA_V2 = 2 as const;

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isTemplateId(v: unknown): v is TemplateId {
  if (typeof v !== 'string') return false;
  const allowed: TemplateId[] = [
    'modern',
    'professional',
    'minimal',
    'creative',
    'standard-tech',
    'data-scientist',
    'product-exec',
    'ux-designer',
    'cloud-architect',
    'cyber-sec',
    'frontend-dev',
    'backend-env',
    'engineering-mgr',
    'devops-pro',
    'qa-expert',
    'ai-researcher',
    'mobile-dev',
    'fullstack-modern',
    'systems-admin',
    'tech-writer',
  ];
  return allowed.includes(v as TemplateId);
}

function normalizeResumeData(input: Partial<ResumeData>): ResumeData {
  const base = createEmptyResumeData(input.personalInfo);
  const personalInfo = { ...base.personalInfo, ...input.personalInfo };
  const exp: Experience[] = Array.isArray(input.experience)
    ? input.experience.map((e, i) => ({
        id: typeof e.id === 'string' && e.id ? e.id : `exp-${i}-${newId()}`,
        company: String(e.company ?? ''),
        position: String(e.position ?? ''),
        location: String(e.location ?? ''),
        startDate: String(e.startDate ?? ''),
        endDate: String(e.endDate ?? ''),
        current: Boolean(e.current),
        description: String(e.description ?? ''),
      }))
    : [];
  const edu: Education[] = Array.isArray(input.education)
    ? input.education.map((e, i) => ({
        id: typeof e.id === 'string' && e.id ? e.id : `edu-${i}-${newId()}`,
        school: String(e.school ?? ''),
        degree: String(e.degree ?? ''),
        fieldOfStudy: String(e.fieldOfStudy ?? ''),
        startDate: String(e.startDate ?? ''),
        endDate: String(e.endDate ?? ''),
        grade: String(e.grade ?? ''),
      }))
    : [];
  const projects: Project[] = Array.isArray(input.projects)
    ? input.projects.map((p, i) => ({
        id: typeof p.id === 'string' && p.id ? p.id : `proj-${i}-${newId()}`,
        name: String(p.name ?? ''),
        description: String(p.description ?? ''),
        link: String(p.link ?? ''),
      }))
    : [];
  const skills = Array.isArray(input.skills)
    ? input.skills.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const languages = Array.isArray(input.languages)
    ? input.languages.map((s) => String(s).trim()).filter(Boolean)
    : [];
  return {
    personalInfo,
    experience: exp,
    education: edu,
    skills,
    projects,
    languages,
  };
}

/** Legacy v1 shape from original ResumeBuilder + React-PDF flow */
function legacyV1ToPro(raw: Record<string, unknown>, fallbackEmail: string | null): ResumeData {
  const personal = (raw.personal ?? {}) as Record<string, unknown>;
  const legacyExp = Array.isArray(raw.experience) ? (raw.experience as Record<string, unknown>[]) : [];
  const legacyEdu = Array.isArray(raw.education) ? (raw.education as Record<string, unknown>[]) : [];
  const legacySkills = Array.isArray(raw.skills) ? (raw.skills as unknown[]) : [];

  const experience: Experience[] = legacyExp.map((e, i) => ({
    id: `legacy-exp-${i}`,
    company: String(e.company ?? ''),
    position: String(e.position ?? ''),
    location: '',
    startDate: String(e.startDate ?? ''),
    endDate: String(e.endDate ?? ''),
    current: !String(e.endDate ?? '').trim(),
    description: String(e.description ?? ''),
  }));

  const education: Education[] = legacyEdu.map((e, i) => ({
    id: `legacy-edu-${i}`,
    school: String(e.school ?? ''),
    degree: String(e.degree ?? ''),
    fieldOfStudy: '',
    startDate: String(e.startDate ?? ''),
    endDate: String(e.endDate ?? ''),
    grade: '',
  }));

  const skills = legacySkills.map((s) => String(s).trim()).filter(Boolean);

  return {
    personalInfo: {
      fullName: String(personal.fullName ?? ''),
      email: String(personal.email ?? fallbackEmail ?? ''),
      phone: String(personal.phone ?? ''),
      location: String(personal.location ?? ''),
      website: String(personal.linkedin ?? ''),
      role: String(personal.tagline ?? ''),
      summary: String(raw.summary ?? ''),
    },
    experience,
    education,
    skills,
    projects: [],
    languages: [],
  };
}

export function loadResumeFromFirestoreDoc(
  raw: Record<string, unknown> | undefined,
  opts: { fallbackEmail?: string | null } = {},
): { templateId: TemplateId; data: ResumeData } {
  if (!raw) {
    return { templateId: 'modern', data: createEmptyResumeData({ email: opts.fallbackEmail ?? '' }) };
  }

  const schemaVersion = raw.schemaVersion;
  if (schemaVersion === RESUME_SCHEMA_V2 && raw.personalInfo && typeof raw.personalInfo === 'object') {
    const templateId = isTemplateId(raw.templateId) ? raw.templateId : 'modern';
    return {
      templateId,
      data: normalizeResumeData(raw as Partial<ResumeData>),
    };
  }

  return {
    templateId: 'modern',
    data: legacyV1ToPro(raw, opts.fallbackEmail ?? null),
  };
}

export function buildResumeFirestorePayload(
  userId: string,
  templateId: TemplateId,
  data: ResumeData,
): Record<string, unknown> {
  return {
    schemaVersion: RESUME_SCHEMA_V2,
    userId,
    lastUpdated: new Date().toISOString(),
    templateId,
    personalInfo: data.personalInfo,
    experience: data.experience,
    education: data.education,
    skills: data.skills,
    projects: data.projects,
    languages: data.languages,
  };
}
