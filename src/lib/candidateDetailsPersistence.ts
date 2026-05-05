import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type InterviewStage =
  | 'not-scheduled'
  | 'scheduled'
  | 'screening'
  | 'final-round'
  | 'selected'
  | 'rejected';

const STAGES: InterviewStage[] = [
  'not-scheduled',
  'scheduled',
  'screening',
  'final-round',
  'selected',
  'rejected',
];

/** Editable fields mirrored in `users` + `candidates` for admin tools. */
export interface CandidateFormFields {
  phone: string;
  location: string;
  primarySkill: string;
  experienceYears: string;
  designation: string;
  bloodGroup: string;
  address: string;
  currentCompany: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  referredBy: string;
}

export const EMPTY_CANDIDATE_FORM: CandidateFormFields = {
  phone: '',
  location: '',
  primarySkill: '',
  experienceYears: '',
  designation: '',
  bloodGroup: '',
  address: '',
  currentCompany: '',
  currentCtc: '',
  expectedCtc: '',
  noticePeriod: '',
  referredBy: '',
};

export interface InterviewStatusSlice {
  stage: InterviewStage;
  company: string;
  notes: string;
  updatedAt: string;
}

export interface CandidateDetailsLoadResult {
  form: CandidateFormFields;
  interview: InterviewStatusSlice;
  /** `candidates/{uid}.updatedAt` when the tracker row exists. */
  candidateRecordUpdatedAt: string | null;
}

export type AuthProfileSnapshot = {
  displayName?: string | null;
  email?: string | null;
  employeeProfile?: { fullName?: string | null } | null;
};

function parseInterviewStage(raw: string): InterviewStage {
  return STAGES.includes(raw as InterviewStage) ? (raw as InterviewStage) : 'not-scheduled';
}

function toIsoStringMaybe(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (typeof v === 'object' && v !== null && 'toDate' in v && typeof (v as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (v as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Load merged candidate form fields from `users/{uid}` and workplace fields from `candidates/{uid}` if present.
 */
export async function loadCandidateDetails(uid: string): Promise<CandidateDetailsLoadResult | null> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) return null;

  const data = userSnap.data() as Record<string, unknown>;
  const p = (data.candidateProfile ?? {}) as Record<string, unknown>;
  const ep = (data.employeeProfile ?? {}) as Record<string, unknown>;
  const i = (data.interviewStatus ?? {}) as Record<string, unknown>;

  const cSnap = await getDoc(doc(db, 'candidates', uid));
  const c = cSnap.exists() ? (cSnap.data() as Record<string, unknown>) : {};

  return {
    form: {
      phone: String(p.phone ?? ep.contactNo ?? ''),
      location: String(p.location ?? c.location ?? ''),
      primarySkill: String(p.primarySkill ?? c.skillDomain ?? ''),
      experienceYears: String(p.experienceYears ?? c.experienceYears ?? ''),
      designation: String(ep.designation ?? ''),
      bloodGroup: String(ep.bloodGroup ?? ''),
      address: String(ep.address ?? ''),
      currentCompany: String(c.currentCompany ?? ''),
      currentCtc: String(c.currentCtc ?? ''),
      expectedCtc: String(c.expectedCtc ?? ''),
      noticePeriod: String(c.noticePeriod ?? ''),
      referredBy: String(c.referredBy ?? ''),
    },
    interview: {
      stage: parseInterviewStage(String(i.stage ?? 'not-scheduled')),
      company: String(i.company ?? ''),
      notes: String(i.notes ?? ''),
      updatedAt: String(i.updatedAt ?? ''),
    },
    candidateRecordUpdatedAt: cSnap.exists() ? toIsoStringMaybe(c.updatedAt) : null,
  };
}

/**
 * Persist profile + candidate tracker row (merge). Interview fields on `users` are not modified here.
 */
export async function saveCandidateProfileForm(
  uid: string,
  profile: AuthProfileSnapshot,
  form: CandidateFormFields,
): Promise<void> {
  const now = new Date().toISOString();
  const phone = form.phone.trim();
  const location = form.location.trim();
  const primarySkill = form.primarySkill.trim();
  const experienceYears = form.experienceYears.trim();
  const designation = form.designation.trim();
  const bloodGroup = form.bloodGroup.trim();
  const address = form.address.trim();
  const currentCompany = form.currentCompany.trim();
  const currentCtc = form.currentCtc.trim();
  const expectedCtc = form.expectedCtc.trim();
  const noticePeriod = form.noticePeriod.trim();
  const referredBy = form.referredBy.trim();

  await updateDoc(doc(db, 'users', uid), {
    candidateProfile: {
      phone,
      location,
      primarySkill,
      experienceYears,
    },
    employeeProfile: {
      contactNo: phone,
      designation,
      bloodGroup,
      address,
      fullName: profile.displayName ?? profile.employeeProfile?.fullName ?? '',
    },
    candidateProfileUpdatedAt: now,
    employeeProfileUpdatedAt: now,
  });

  await setDoc(
    doc(db, 'candidates', uid),
    {
      userId: uid,
      name: profile.displayName ?? '',
      emailId: profile.email ?? '',
      contactNo: phone,
      skillDomain: primarySkill,
      location: location || address.split('\n')[0] || '',
      experienceYears,
      currentCompany,
      currentCtc,
      expectedCtc,
      noticePeriod,
      referredBy,
      updatedAt: now,
    },
    { merge: true },
  );
}
