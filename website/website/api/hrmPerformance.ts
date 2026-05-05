import type { HrmGoalRow, HrmPerformanceCycle, HrmReviewRow } from '@/types';
import { hrmRequest } from './hrmClient';

export type HrmCreateCycleInput = {
  name: string;
  periodFrom: string;
  periodTo: string;
  status?: 'draft' | 'active' | 'closed';
};

export type HrmCreateGoalInput = {
  employeeId: number;
  cycleId?: number | null;
  title: string;
  description?: string;
  target?: string;
  metric?: string;
  weight?: number;
  dueDate?: string;
};

export async function hrmGetPerformanceCycles(token?: string | null): Promise<HrmPerformanceCycle[]> {
  return hrmRequest<HrmPerformanceCycle[]>('/api/performance/cycles', 'GET', undefined, token);
}

export async function hrmCreatePerformanceCycle(
  payload: HrmCreateCycleInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateCycleInput>(
    '/api/performance/cycles',
    'POST',
    payload,
    token,
  );
}

export async function hrmGetGoals(
  params: { employeeId?: string },
  token?: string | null,
): Promise<HrmGoalRow[]> {
  const q = params.employeeId ? `?employeeId=${encodeURIComponent(params.employeeId)}` : '';
  return hrmRequest<HrmGoalRow[]>(`/api/performance/goals${q}`, 'GET', undefined, token);
}

export async function hrmCreateGoal(
  payload: HrmCreateGoalInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateGoalInput>(
    '/api/performance/goals',
    'POST',
    payload,
    token,
  );
}

export async function hrmGetReviews(token?: string | null): Promise<HrmReviewRow[]> {
  return hrmRequest<HrmReviewRow[]>('/api/performance/reviews', 'GET', undefined, token);
}

export type HrmCreateReviewInput = {
  employeeId: number;
  reviewerId: number;
  cycleId?: number | null;
  type?: 'annual' | 'mid_year' | 'probation' | 'quarterly';
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  ratingLabel?: string;
  status?: 'draft' | 'submitted' | 'completed';
};

export async function hrmCreateReview(
  payload: HrmCreateReviewInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateReviewInput>(
    '/api/performance/reviews',
    'POST',
    payload,
    token,
  );
}
