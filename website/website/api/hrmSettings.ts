import { hrmRequest } from './hrmClient';

/** Raw JSON row from GET /api/settings/company. */
type HrmCompanyWire = {
  id: number;
  name: string;
  logo_url: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  pan: string | null;
  gstin: string | null;
  cin: string | null;
  created_at: string;
};

export type HrmCompanyProfile = Omit<HrmCompanyWire, 'logo_url'> & {
  brandImageUrl: string | null;
};

function mapCompanyWire(w: HrmCompanyWire): HrmCompanyProfile {
  const { logo_url: brandImageUrl, ...rest } = w;
  return { ...rest, brandImageUrl };
}

export type HrmDepartmentRow = {
  id: number;
  name: string;
  head_id: number | null;
  created_at: string;
  head_name: string | null;
};

export type HrmDesignationRow = {
  id: number;
  title: string;
  department_id: number | null;
  grade: string | null;
  department_name: string | null;
};

export type HrmRoleRow = {
  id: number;
  name: string;
  permissions: string;
};

export type HrmSalaryStructureRow = {
  id: number;
  name: string;
  basic_percent: number;
  hra_percent: number;
  ta_percent: number;
  da_percent: number;
  special_percent: number;
  pf_employee: number;
  pf_employer: number;
  esi_employee: number;
  esi_employer: number;
  pt_monthly: number;
  created_at: string;
};

export type HrmCompanyUpdate = {
  name?: string;
  brandImageUrl?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  pan?: string | null;
  gstin?: string | null;
  cin?: string | null;
};

/** PUT JSON body expected by the Worker (camelCase image field). */
type HrmCompanyUpdateWire = Omit<HrmCompanyUpdate, 'brandImageUrl'> & { logoUrl?: string | null };

export async function hrmGetCompany(token?: string | null): Promise<HrmCompanyProfile | null> {
  const row = await hrmRequest<HrmCompanyWire | null>('/api/settings/company', 'GET', undefined, token);
  return row ? mapCompanyWire(row) : null;
}

export async function hrmUpdateCompany(payload: HrmCompanyUpdate, token?: string | null): Promise<{ message: string }> {
  const { brandImageUrl, ...rest } = payload;
  const body: HrmCompanyUpdateWire = {
    ...rest,
    ...(brandImageUrl !== undefined ? { logoUrl: brandImageUrl } : {}),
  };
  return hrmRequest<{ message: string }, HrmCompanyUpdateWire>('/api/settings/company', 'PUT', body, token);
}

export async function hrmGetDepartments(token?: string | null): Promise<HrmDepartmentRow[]> {
  return hrmRequest<HrmDepartmentRow[]>('/api/settings/departments', 'GET', undefined, token);
}

export async function hrmCreateDepartment(
  payload: { name: string; headId?: number | null },
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, typeof payload>(
    '/api/settings/departments',
    'POST',
    payload,
    token,
  );
}

export async function hrmGetDesignations(
  params: { departmentId?: string },
  token?: string | null,
): Promise<HrmDesignationRow[]> {
  const q = params.departmentId ? `?departmentId=${encodeURIComponent(params.departmentId)}` : '';
  return hrmRequest<HrmDesignationRow[]>(`/api/settings/designations${q}`, 'GET', undefined, token);
}

export async function hrmCreateDesignation(
  payload: { title: string; departmentId?: number | null; grade?: string | null },
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, typeof payload>(
    '/api/settings/designations',
    'POST',
    payload,
    token,
  );
}

export async function hrmGetRoles(token?: string | null): Promise<HrmRoleRow[]> {
  return hrmRequest<HrmRoleRow[]>('/api/settings/roles', 'GET', undefined, token);
}

export async function hrmGetSalaryStructures(token?: string | null): Promise<HrmSalaryStructureRow[]> {
  return hrmRequest<HrmSalaryStructureRow[]>('/api/settings/salary-structures', 'GET', undefined, token);
}

export async function hrmCreateSalaryStructure(
  payload: {
    name: string;
    basicPercent?: number;
    hraPercent?: number;
    taPercent?: number;
    daPercent?: number;
    specialPercent?: number;
    pfEmployee?: number;
    pfEmployer?: number;
    esiEmployee?: number;
    esiEmployer?: number;
    ptMonthly?: number;
  },
  token?: string | null,
): Promise<{ message: string; id?: number }> {
  return hrmRequest<{ message: string; id?: number }, typeof payload>(
    '/api/settings/salary-structures',
    'POST',
    payload,
    token,
  );
}
