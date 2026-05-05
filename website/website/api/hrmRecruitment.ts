import type { HrmCandidate, HrmJobPosting } from '@/types';
import { hrmRequest } from './hrmClient';

export type HrmCreateJobInput = {
  title: string;
  description?: string;
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'intern';
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  openings?: number;
};

export type HrmCreateCandidateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skills?: string[];
  source?: string;
};

export async function hrmGetJobs(token?: string | null): Promise<HrmJobPosting[]> {
  return hrmRequest<HrmJobPosting[]>('/api/recruitment/jobs', 'GET', undefined, token);
}

export async function hrmCreateJob(
  payload: HrmCreateJobInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateJobInput>(
    '/api/recruitment/jobs',
    'POST',
    payload,
    token,
  );
}

export async function hrmGetCandidates(token?: string | null): Promise<HrmCandidate[]> {
  return hrmRequest<HrmCandidate[]>('/api/recruitment/candidates', 'GET', undefined, token);
}

export async function hrmCreateCandidate(
  payload: HrmCreateCandidateInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateCandidateInput>(
    '/api/recruitment/candidates',
    'POST',
    payload,
    token,
  );
}
