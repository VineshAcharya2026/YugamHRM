import type React from 'react';

export interface Trainer {
  name: string;
  bio: string;
  image: string;
  expertise: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fullDescription?: string;
  curriculum?: string[];
  trainer?: Trainer;
  duration?: string;
  level?: string;
  batchInfo?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface HrmUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface HrmSessionUser {
  sub: string;
  employeeId: number;
  email: string;
  name: string;
  role: string;
}

export interface HrmLoginResponse {
  token: string;
  user: HrmUser & {
    employeeId: number;
    empCode: string;
    permissions: string[];
  };
}

export interface HrmEmployee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export interface HrmPayrollRun {
  id: number;
  month: string;
  status: string;
  employee_count?: number;
}

export interface HrmJobPosting {
  id: number;
  title: string;
  employment_type: string;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  openings: number | null;
  status: string;
}

export interface HrmCandidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  source: string | null;
}

export interface HrmLeaveType {
  id: number;
  name: string;
  code: string;
  days_per_year: number;
}

export interface HrmLeaveRequest {
  id: number;
  employee_id: number;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  total_days: number;
  status: string;
  leave_type: string;
  first_name: string;
  last_name: string;
}

export interface HrmAttendanceRow {
  id: number;
  employee_id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: number | null;
  status: string;
}

export interface HrmDocumentRow {
  id: number;
  employee_id: number | null;
  employee_name: string | null;
  employee_code: string | null;
  name: string;
  type: string;
  file_url: string;
  mime_type: string | null;
  is_verified: number;
  created_at: string;
}

export interface HrmPerformanceCycle {
  id: number;
  name: string;
  period_from: string;
  period_to: string;
  status: string;
  created_at: string;
}

export interface HrmGoalRow {
  id: number;
  employee_id: number;
  cycle_id: number | null;
  title: string;
  description: string | null;
  target: string | null;
  metric: string | null;
  weight: number | null;
  status: string;
  self_rating: number | null;
  manager_rating: number | null;
  due_date: string | null;
  created_at: string;
  first_name: string;
  last_name: string;
  emp_code: string;
  cycle_name: string | null;
}

export interface HrmReviewRow {
  id: number;
  employee_id: number;
  reviewer_id: number;
  cycle_id: number | null;
  type: string;
  self_rating: number | null;
  manager_rating: number | null;
  final_rating: number | null;
  rating_label: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  employee_name: string;
  reviewer_name: string;
  cycle_name: string | null;
}

export interface HrmReportSummary {
  employees: { total: number; active: number };
  payrollRuns: number;
  openJobs: number;
  pendingLeaveRequests: number;
  attendanceRecordsThisMonth: number;
  documents: number;
  goals: number;
  performanceReviews: number;
  generatedAt: string;
}

export interface HrmDashboardModule {
  key:
    | 'employees'
    | 'payroll'
    | 'recruitment'
    | 'leaves'
    | 'attendance'
    | 'performance'
    | 'documents'
    | 'reports'
    | 'settings';
  title: string;
  description: string;
  status: 'live' | 'coming_soon';
  route: string;
}

export type HrmModuleKey = HrmDashboardModule['key'];
