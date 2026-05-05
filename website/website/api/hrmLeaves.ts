import type { HrmLeaveRequest, HrmLeaveType } from '@/types';
import { hrmRequest } from './hrmClient';

export type HrmCreateLeaveRequestInput = {
  leaveTypeId: number;
  fromDate: string;
  toDate: string;
  totalDays: number;
  halfDay?: boolean;
  reason?: string;
};

export async function hrmGetLeaveRequests(token?: string | null): Promise<HrmLeaveRequest[]> {
  return hrmRequest<HrmLeaveRequest[]>('/api/leaves/requests', 'GET', undefined, token);
}

export async function hrmGetLeaveTypes(token?: string | null): Promise<HrmLeaveType[]> {
  return hrmRequest<HrmLeaveType[]>('/api/leaves/types', 'GET', undefined, token);
}

export async function hrmCreateLeaveRequest(
  payload: HrmCreateLeaveRequestInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateLeaveRequestInput>(
    '/api/leaves/requests',
    'POST',
    payload,
    token,
  );
}
