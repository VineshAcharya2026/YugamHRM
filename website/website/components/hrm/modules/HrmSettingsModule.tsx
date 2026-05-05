'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Briefcase, RefreshCcw, Shield, Wallet } from 'lucide-react';
import {
  hrmCreateDepartment,
  hrmCreateDesignation,
  hrmCreateSalaryStructure,
  hrmGetCompany,
  hrmGetDepartments,
  hrmGetDesignations,
  hrmGetRoles,
  hrmGetSalaryStructures,
  hrmUpdateCompany,
} from '@/api/hrmSettings';
import { hrmGetEmployees } from '@/api/hrmEmployees';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const HrmSettingsModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const role = useHrmAuthStore((s) => s.user?.role);
  const canEdit = role === 'admin' || role === 'hr';
  const qc = useQueryClient();

  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    pan: '',
    gstin: '',
    cin: '',
    brandImageUrl: '',
  });
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [desigTitle, setDesigTitle] = useState('');
  const [desigDept, setDesigDept] = useState('');
  const [desigGrade, setDesigGrade] = useState('');
  const [salaryName, setSalaryName] = useState('');

  const company = useQuery({
    queryKey: ['hrm', 'settings-company', token],
    queryFn: () => hrmGetCompany(token),
    staleTime: 30_000,
    enabled: apiReady,
  });

  React.useEffect(() => {
    const c = company.data;
    if (!c) return;
    setCompanyForm({
      name: c.name ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      address: c.address ?? '',
      website: c.website ?? '',
      pan: c.pan ?? '',
      gstin: c.gstin ?? '',
      cin: c.cin ?? '',
      brandImageUrl: c.brandImageUrl ?? '',
    });
  }, [company.data]);

  const departments = useQuery({
    queryKey: ['hrm', 'settings-depts', token],
    queryFn: () => hrmGetDepartments(token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const designations = useQuery({
    queryKey: ['hrm', 'settings-desigs', token],
    queryFn: () => hrmGetDesignations({}, token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const roles = useQuery({
    queryKey: ['hrm', 'settings-roles', token],
    queryFn: () => hrmGetRoles(token),
    staleTime: 60_000,
    enabled: apiReady,
  });
  const salaryStructures = useQuery({
    queryKey: ['hrm', 'settings-salary', token],
    queryFn: () => hrmGetSalaryStructures(token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const employees = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    enabled: apiReady,
  });

  const saveCompany = useMutation({
    mutationFn: () =>
      hrmUpdateCompany(
        {
          name: companyForm.name || undefined,
          email: companyForm.email || null,
          phone: companyForm.phone || null,
          address: companyForm.address || null,
          website: companyForm.website || null,
          pan: companyForm.pan || null,
          gstin: companyForm.gstin || null,
          cin: companyForm.cin || null,
          brandImageUrl: companyForm.brandImageUrl || null,
        },
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'settings-company', token] });
    },
  });

  const addDept = useMutation({
    mutationFn: () =>
      hrmCreateDepartment(
        { name: deptName.trim(), headId: deptHead ? Number(deptHead) : null },
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'settings-depts', token] });
      setDeptName('');
      setDeptHead('');
    },
  });

  const addDesig = useMutation({
    mutationFn: () =>
      hrmCreateDesignation(
        {
          title: desigTitle.trim(),
          departmentId: desigDept ? Number(desigDept) : null,
          grade: desigGrade.trim() || null,
        },
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'settings-desigs', token] });
      setDesigTitle('');
      setDesigGrade('');
    },
  });

  const addSalary = useMutation({
    mutationFn: () => hrmCreateSalaryStructure({ name: salaryName.trim() }, token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'settings-salary', token] });
      setSalaryName('');
    },
  });

  const refetchAll = () => {
    void company.refetch();
    void departments.refetch();
    void designations.refetch();
    void roles.refetch();
    void salaryStructures.refetch();
  };

  const headOptions = useMemo(() => employees.data ?? [], [employees.data]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Settings</h4>
          <p className="text-sm font-medium text-slate-500">Company profile, org structure, roles, and salary templates (D1-backed).</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={refetchAll}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 text-slate-900">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h5 className="font-black">Company</h5>
        </div>
        {!apiReady ? (
          <p className="text-sm text-slate-500">Connect the API to load company settings.</p>
        ) : company.isLoading ? (
          <HrmSkeleton lines={4} />
        ) : company.isError ? (
          <p className="text-sm text-red-600">{(company.error as Error).message}</p>
        ) : (
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (canEdit && apiReady) saveCompany.mutate();
            }}
          >
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2" placeholder="Legal name" value={companyForm.name} onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Email" value={companyForm.email} onChange={(e) => setCompanyForm((p) => ({ ...p, email: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Phone" value={companyForm.phone} onChange={(e) => setCompanyForm((p) => ({ ...p, phone: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2" placeholder="Address" value={companyForm.address} onChange={(e) => setCompanyForm((p) => ({ ...p, address: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Website URL" value={companyForm.website} onChange={(e) => setCompanyForm((p) => ({ ...p, website: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="https://…" value={companyForm.brandImageUrl} onChange={(e) => setCompanyForm((p) => ({ ...p, brandImageUrl: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="PAN" value={companyForm.pan} onChange={(e) => setCompanyForm((p) => ({ ...p, pan: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="GSTIN" value={companyForm.gstin} onChange={(e) => setCompanyForm((p) => ({ ...p, gstin: e.target.value }))} disabled={!canEdit || !apiReady} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="CIN" value={companyForm.cin} onChange={(e) => setCompanyForm((p) => ({ ...p, cin: e.target.value }))} disabled={!canEdit || !apiReady} />
            {canEdit ? (
              <div className="md:col-span-2">
                <button type="submit" disabled={saveCompany.isPending || !apiReady} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60">Save company</button>
                {saveCompany.isError ? <p className="mt-2 text-sm text-red-600">{(saveCompany.error as Error).message}</p> : null}
                {saveCompany.isSuccess ? <p className="mt-2 text-sm text-emerald-700">{saveCompany.data.message}</p> : null}
              </div>
            ) : (
              <p className="text-sm text-slate-500 md:col-span-2">View only — HR or Admin can edit company profile.</p>
            )}
          </form>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h5 className="font-black text-slate-900">Departments</h5>
          </div>
          {!apiReady ? (
            <p className="text-sm text-slate-500">Connect the API to load departments.</p>
          ) : departments.isLoading ? (
            <HrmSkeleton lines={2} />
          ) : (
            <>
              <ul className="mb-4 max-h-40 space-y-1 overflow-auto text-sm text-slate-700">
                {(departments.data ?? []).map((d) => (
                  <li key={d.id} className="flex justify-between border-b border-slate-100 py-1">
                    <span className="font-semibold">{d.name}</span>
                    <span className="text-slate-500">{d.head_name ?? '—'}</span>
                  </li>
                ))}
              </ul>
              {canEdit ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="New department" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                  <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={deptHead} onChange={(e) => setDeptHead(e.target.value)}>
                    <option value="">Head (optional)</option>
                    {headOptions.map((e) => (
                      <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!deptName.trim() || addDept.isPending || !apiReady}
                    onClick={() => addDept.mutate()}
                    className="rounded-xl bg-brand px-3 py-2 text-xs font-black text-white hover:bg-brand-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h5 className="font-black text-slate-900">Designations</h5>
          </div>
          {!apiReady ? (
            <p className="text-sm text-slate-500">Connect the API to load designations.</p>
          ) : designations.isLoading ? (
            <HrmSkeleton lines={2} />
          ) : (
            <>
              <ul className="mb-4 max-h-40 space-y-1 overflow-auto text-sm text-slate-700">
                {(designations.data ?? []).map((d) => (
                  <li key={d.id} className="flex justify-between border-b border-slate-100 py-1">
                    <span className="font-semibold">{d.title}</span>
                    <span className="text-slate-500">{d.department_name ?? '—'}</span>
                  </li>
                ))}
              </ul>
              {canEdit ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2" placeholder="Title" value={desigTitle} onChange={(e) => setDesigTitle(e.target.value)} />
                  <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={desigDept} onChange={(e) => setDesigDept(e.target.value)}>
                    <option value="">Department</option>
                    {(departments.data ?? []).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Grade" value={desigGrade} onChange={(e) => setDesigGrade(e.target.value)} />
                  <button
                    type="button"
                    disabled={!desigTitle.trim() || addDesig.isPending || !apiReady}
                    onClick={() => addDesig.mutate()}
                    className="rounded-xl bg-brand px-3 py-2 text-xs font-black text-white hover:bg-brand-600 disabled:opacity-50 sm:col-span-2"
                  >
                    Add designation
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h5 className="font-black text-slate-900">Roles (read-only)</h5>
        </div>
        {!apiReady ? (
          <p className="text-sm text-slate-500">Connect the API to load roles.</p>
        ) : roles.isLoading ? (
          <HrmSkeleton lines={2} />
        ) : roles.isError ? (
          <p className="text-sm text-red-600">{(roles.error as Error).message}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">Name</th>
                  <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {(roles.data ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold">{r.name}</td>
                    <td className="px-3 py-2 text-slate-600">{r.permissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          <h5 className="font-black text-slate-900">Salary structures</h5>
        </div>
        <p className="mb-3 text-xs text-slate-500">Templates use default Indian salary splits; customize further in the database or future editor.</p>
        {!apiReady ? (
          <p className="text-sm text-slate-500">Connect the API to load salary structures.</p>
        ) : salaryStructures.isLoading ? (
          <HrmSkeleton lines={2} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-100/80">
                  <tr>
                    <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">Name</th>
                    <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">Basic %</th>
                    <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">HRA %</th>
                    <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">PF emp</th>
                    <th className="px-3 py-2 text-xs font-black uppercase text-slate-500">PT</th>
                  </tr>
                </thead>
                <tbody>
                  {(salaryStructures.data ?? []).map((s) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">{s.name}</td>
                      <td className="px-3 py-2">{s.basic_percent}</td>
                      <td className="px-3 py-2">{s.hra_percent}</td>
                      <td className="px-3 py-2">{s.pf_employee}</td>
                      <td className="px-3 py-2">{s.pt_monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {canEdit ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <input className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Structure name" value={salaryName} onChange={(e) => setSalaryName(e.target.value)} />
                <button
                  type="button"
                  disabled={!salaryName.trim() || addSalary.isPending || !apiReady}
                  onClick={() => addSalary.mutate()}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white disabled:opacity-50"
                >
                  Add structure
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default HrmSettingsModule;
