import type { HrmPayrollRun } from '@/types';
import { hrmRequest } from './hrmClient';

export async function hrmGetPayrollRuns(token?: string | null): Promise<HrmPayrollRun[]> {
  return hrmRequest<HrmPayrollRun[]>('/api/payroll/runs', 'GET', undefined, token);
}

export async function hrmRunPayroll(
  month: string,
  token?: string | null,
): Promise<{ message: string; runId?: number }> {
  return hrmRequest<{ message: string; runId?: number }, { month: string }>(
    '/api/payroll/run',
    'POST',
    { month },
    token,
  );
}
