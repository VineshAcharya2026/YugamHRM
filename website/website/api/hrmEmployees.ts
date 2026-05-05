import type { HrmEmployee } from '@/types';
import { hrmRequest } from './hrmClient';

export async function hrmGetEmployees(token?: string | null): Promise<HrmEmployee[]> {
  return hrmRequest<HrmEmployee[]>('/api/employees', 'GET', undefined, token);
}

export type HrmCreateEmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export async function hrmCreateEmployee(
  payload: HrmCreateEmployeeInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmCreateEmployeeInput>(
    '/api/employees',
    'POST',
    payload,
    token,
  );
}
