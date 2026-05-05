import type { HrmAttendanceRow } from '@/types';
import { hrmRequest } from './hrmClient';

export type HrmAttendanceInput = {
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  status?: 'present' | 'absent' | 'half_day' | 'wfh' | 'holiday' | 'on_leave';
  notes?: string;
};

export async function hrmGetAttendance(
  params: { employeeId?: string; month?: string },
  token?: string | null,
): Promise<HrmAttendanceRow[]> {
  const query = new URLSearchParams();
  if (params.employeeId) query.set('employeeId', params.employeeId);
  if (params.month) query.set('month', params.month);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return hrmRequest<HrmAttendanceRow[]>(`/api/attendance${suffix}`, 'GET', undefined, token);
}

export async function hrmUpsertAttendance(
  payload: HrmAttendanceInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmAttendanceInput>('/api/attendance', 'POST', payload, token);
}
