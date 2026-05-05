import type { HrmReportSummary } from '@/types';
import { hrmRequest } from './hrmClient';

export async function hrmGetReportSummary(token?: string | null): Promise<HrmReportSummary> {
  return hrmRequest<HrmReportSummary>('/api/reports/summary', 'GET', undefined, token);
}
