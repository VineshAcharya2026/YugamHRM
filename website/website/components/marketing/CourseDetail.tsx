'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICES, getWhatsAppLink } from '@/constants';
import { ArrowLeft, Clock, BarChart, CheckCircle, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const router = useRouter();
  const course = SERVICES.find((s) => s.id === courseId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  const handleWhatsApp = () => {
    if (!course) return;
    window.open(getWhatsAppLink(`Hi! I'm interested in the ${course.title} course at Softivox Tech. I'd like to discuss the curriculum and next batch availability.`), '_blank');
  };

  if (!course) {
    return (
      <div className="pt-40 pb-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black text-ink mb-4">Course not found</h2>
        <p className="text-slate-500 mb-8">The program you're looking for might have been updated.</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 font-bold text-white shadow-lift transition hover:bg-brand-600"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero — light shell (matches HRM marketing) */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper pt-12 pb-16 sm:pt-16">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/3 translate-x-1/4 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[280px] w-[280px] translate-y-1/3 -translate-x-1/4 rounded-full bg-ink/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/')}
            className="group mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Directory
          </button>

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="animate-in slide-in-from-left duration-700 lg:col-span-8">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-50 px-5 py-2">
                <Sparkles className="h-4 w-4 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-800">Elite Training Program</span>
              </div>

              <h1 className="heading-display mb-6">{course.title}</h1>

              <p className="mb-10 max-w-2xl text-xl font-medium leading-relaxed text-slate-600">{course.description}</p>

              <div className="flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <Clock className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-500">Duration</p>
                    <p className="font-bold text-ink">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <BarChart className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-500">Level</p>
                    <p className="font-bold text-ink">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-500">Commitment</p>
                    <p className="font-bold text-emerald-700">100% Placement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-20 animate-in fade-in duration-1000">
              <div>
                <h2 className="section-title">Program overview</h2>
                <h3 className="text-4xl font-black text-ink mb-8 tracking-tight">Master the Skills That Matter</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  {course.fullDescription || "Our comprehensive curriculum is designed by industry experts to provide hands-on experience with the latest enterprise technologies."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-ink tracking-tight">Curriculum Modules</h3>
                  <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                    6 Integrated Modules
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {(course.curriculum || [
                    'Foundations & Core Principles',
                    'Advanced Concepts & Frameworks',
                    'Industry Project Phases',
                    'Enterprise Integration Strategies',
                    'Optimization & Best Practices',
                    'Mock Interviews & Career Prep'
                  ]).map((item, idx) => (
                    <div key={idx} className="group flex items-center gap-6 rounded-2xl border border-ink/10 bg-paper p-5 transition hover:border-brand/30 hover:bg-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-semibold text-brand shadow-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <p className="text-slate-800 font-bold text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-10 animate-in slide-in-from-right duration-700">
              {/* Enrollment Card */}
              <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200/90 bg-white p-10 shadow-xl shadow-slate-200/50">
                <div className="relative z-10">
                  <h4 className="mb-2 text-2xl font-black text-ink">Next Batch Launch</h4>
                  <p className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-500">Enrollments closing soon</p>

                  <div className="mb-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                        <Sparkles className="h-5 w-5 text-brand" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Limited 15 Seats / Batch</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Placement Support Active</p>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand px-8 py-5 text-lg font-black text-white shadow-lift transition-all hover:bg-brand-600"
                  >
                    <MessageCircle className="h-6 w-6" /> Reserve Seat
                  </button>
                </div>
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
              </div>

              {/* Trainer Profile Card */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
                <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">Lead Mentor</h5>
                <div className="flex items-center gap-6 mb-8">
                  <img 
                    src={course.trainer?.image || `https://i.pravatar.cc/200?u=${course.trainer?.name}`} 
                    alt={course.trainer?.name} 
                    className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-slate-100"
                  />
                  <div>
                    <h6 className="text-xl font-black text-ink leading-none mb-2">{course.trainer?.name || "Expert Lead"}</h6>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand">Industry veteran</p>
                  </div>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 italic">
                  "{course.trainer?.bio || "Committed to delivering high-impact technical education for modern MNC roles."}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {(course.trainer?.expertise || ['Consulting', 'Architecture', 'Engineering']).map(exp => (
                    <span key={exp} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
