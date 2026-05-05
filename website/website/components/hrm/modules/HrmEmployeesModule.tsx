'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { Plus, RefreshCcw, UserPlus } from 'lucide-react';
import { hrmCreateEmployee, hrmGetEmployees } from '@/api/hrmEmployees';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
});

const HrmEmployeesModule: React.FC = () => {
  const token = useHrmAuthStore((state) => state.token);
  const apiReady = canCallHrmApi(token);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const employeesQuery = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      hrmCreateEmployee(
        createEmployeeSchema.parse({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
        }),
        token,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hrm', 'employees', token] });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setFormError(null);
      setShowForm(false);
    },
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setFormError(null);
    try {
      createEmployeeSchema.parse({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
      });
    } catch {
      setFormError('Please enter valid employee details.');
      return;
    }
    const button = event.currentTarget.querySelector('button[type="submit"]');
    if (button) {
      hrmTapFeedback(button);
    }
    createMutation.mutate();
  };

  const sortedEmployees = useMemo(
    () => [...(employeesQuery.data ?? [])].sort((a, b) => b.id - a.id),
    [employeesQuery.data],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Employees</h4>
          <p className="text-sm font-medium text-slate-500">Manage employee records and onboarding.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => employeesQuery.refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Close Form' : 'Add Employee'}
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      {showForm ? (
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] md:grid-cols-2"
        >
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending || !apiReady}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {createMutation.isPending ? 'Saving...' : 'Create Employee'}
            </button>
            {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}
            {createMutation.isError ? (
              <p className="text-sm font-medium text-red-600">{(createMutation.error as Error).message}</p>
            ) : null}
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Code</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    Connect the API to list employees.
                  </td>
                </tr>
              ) : employeesQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    <HrmSkeleton lines={4} />
                  </td>
                </tr>
              ) : employeesQuery.isError ? (
                <tr>
                  <td className="px-4 py-4 text-red-600" colSpan={4}>
                    {(employeesQuery.error as Error).message}
                  </td>
                </tr>
              ) : sortedEmployees.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((emp) => (
                  <tr key={emp.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-bold text-slate-700">{emp.employee_id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default HrmEmployeesModule;
