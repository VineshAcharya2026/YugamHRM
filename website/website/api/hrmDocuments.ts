import type { HrmDocumentRow } from '@/types';
import { hrmRequest } from './hrmClient';

export type HrmDocumentInput = {
  employeeId?: number | null;
  name: string;
  type: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  expiryDate?: string;
};

export async function hrmGetDocuments(
  params: { employeeId?: string; type?: string },
  token?: string | null,
): Promise<HrmDocumentRow[]> {
  const query = new URLSearchParams();
  if (params.employeeId) query.set('employeeId', params.employeeId);
  if (params.type) query.set('type', params.type);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return hrmRequest<HrmDocumentRow[]>(`/api/documents${suffix}`, 'GET', undefined, token);
}

export async function hrmCreateDocument(
  payload: HrmDocumentInput,
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, HrmDocumentInput>('/api/documents', 'POST', payload, token);
}
