import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from './firebase';
import { firestoreErrorMessage } from './firestoreErrors';

const RESUME_PAGE = 100;
const CANDIDATE_PAGE = 500;

/** Row from `candidates` (admin tracker). */
export interface CandidateRow {
  id: string;
  name?: string;
  skillDomain?: string;
  currentCompany?: string;
  currentCtc?: string;
  expectedCtc?: string;
  referredBy?: string;
  emailId?: string;
  contactNo?: string;
  createdAt?: string;
  [key: string]: unknown;
}

/** Resume doc in `resumes` — v2 Pro schema (`schemaVersion` 2) or legacy v1 fields. */
export interface ResumeRow {
  id: string;
  userId?: string;
  personal?: {
    fullName?: string;
    email?: string;
    tagline?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  skills?: string[];
  lastUpdated?: string;
  [key: string]: unknown;
}

export interface AdminDashboardStats {
  totalCandidates: number;
  totalResumes: number;
  totalDocuments: number;
}

export async function fetchAdminDashboardData(): Promise<{
  stats: AdminDashboardStats;
  candidates: CandidateRow[];
  error: string | null;
}> {
  try {
    const [candidatesSnap, resumesSnap, documentsSnap] = await Promise.all([
      getDocs(query(collection(db, 'candidates'), limit(CANDIDATE_PAGE))),
      getDocs(query(collection(db, 'resumes'), limit(RESUME_PAGE))),
      getDocs(query(collection(db, 'documents'), limit(500))),
    ]);

    const candidates: CandidateRow[] = candidatesSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Record<string, unknown>),
    }));

    return {
      stats: {
        totalCandidates: candidates.length,
        totalResumes: resumesSnap.size,
        totalDocuments: documentsSnap.size,
      },
      candidates,
      error: null,
    };
  } catch (err) {
    console.error('fetchAdminDashboardData:', err);
    return {
      stats: { totalCandidates: 0, totalResumes: 0, totalDocuments: 0 },
      candidates: [],
      error: firestoreErrorMessage(err),
    };
  }
}

export async function listResumesForAdmin(): Promise<{
  resumes: ResumeRow[];
  error: string | null;
}> {
  try {
    const snap = await getDocs(query(collection(db, 'resumes'), limit(RESUME_PAGE)));
    const resumes: ResumeRow[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Record<string, unknown>),
    }));
    return { resumes, error: null };
  } catch (err) {
    console.error('listResumesForAdmin:', err);
    return { resumes: [], error: firestoreErrorMessage(err) };
  }
}

export async function listCandidatesForAdmin(): Promise<{
  candidates: CandidateRow[];
  error: string | null;
}> {
  try {
    const snap = await getDocs(query(collection(db, 'candidates'), limit(CANDIDATE_PAGE)));
    const candidates: CandidateRow[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Record<string, unknown>),
    }));
    candidates.sort((a, b) => {
      const ta = new Date(a.createdAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? 0).getTime();
      return tb - ta;
    });
    return { candidates, error: null };
  } catch (err) {
    console.error('listCandidatesForAdmin:', err);
    return { candidates: [], error: firestoreErrorMessage(err) };
  }
}
