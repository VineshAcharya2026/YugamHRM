import { ResumeData, TemplateId } from '../types';
import { cn } from '../lib/utils';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateId;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  // Common Styles for A4 page feel
  const pageClass = "bg-white p-[25mm] text-[#1b1b1b] min-h-[297mm] w-[210mm] shadow-inner font-sans relative overflow-hidden text-[10pt] leading-[1.5] print:p-0 print:shadow-none";

  // Helper to render sections for reuse
  const renderSkills = (className?: string) => (
      <div className={cn("flex flex-wrap gap-2", className)}>
          {data.skills.map(s => (
              <span key={s} className="px-2 py-0.5 bg-[#f0f0f0] rounded text-[8pt] font-medium border border-black/5">{s}</span>
          ))}
      </div>
  );

  // Modern Template Layout (Used by: modern, standard-tech, frontend-dev, mobile-dev, etc.)
  const renderModernLayout = (accentColor = "#0067b8") => (
    <div className={cn(pageClass)}>
      <header className="mb-10 flex justify-between items-start">
        <div className="max-w-[70%]">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 leading-none">{data.personalInfo.fullName.toUpperCase()}</h1>
          <p className="text-lg font-bold tracking-tight" style={{ color: accentColor }}>{data.personalInfo.role}</p>
        </div>
        <div className="text-right text-[9px] font-bold text-slate-400 space-y-1 uppercase tracking-wider">
          <p>{data.personalInfo.location}</p>
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.website}</p>
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-slate-200" />
              Profile
          </h2>
          <p className="text-[10pt] text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-slate-200" />
              Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                  <span className="text-xs font-bold text-slate-400">{exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-500 mb-3">{exp.company} • {exp.location}</h4>
                <p className="text-[10pt] text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-slate-200" />
                Technical Skills
            </h2>
            {renderSkills("mt-2")}
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-slate-200" />
                Education
          </h2>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-800">{edu.school}</span>
                  <span className="font-bold text-slate-400">{edu.startDate} — {edu.endDate}</span>
                </div>
                <p className="text-sm italic text-slate-600">{edu.degree} in {edu.fieldOfStudy} ({edu.grade})</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // Two Column Sidebar Layout (Used by: creative, ux-designer, sidebar-pro, cloud-architect, cyber-sec)
  const renderSidebarLayout = (dark = false, accent = "#0067b8") => (
      <div className={cn(pageClass, "p-0 flex flex-row min-h-screen")}>
          <aside className={cn("w-[35%] p-10 flex flex-col gap-10", dark ? "bg-slate-900 text-white" : "bg-slate-50 border-r border-slate-100")}>
              <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2 leading-tight uppercase">{data.personalInfo.fullName.replace(' ', '\n')}</h1>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-none">{data.personalInfo.role}</p>
              </div>

              <section className="space-y-4">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">Expertise</h3>
                  <div className="flex flex-col gap-2">
                      {data.skills.map(s => (
                          <div key={s} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                              <span className="text-[9pt] font-medium">{s}</span>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="space-y-4">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">Contact Info</h3>
                  <div className="space-y-3 text-[9pt] opacity-80">
                      <p className="truncate">{data.personalInfo.email}</p>
                      <p>{data.personalInfo.phone}</p>
                      <p>{data.personalInfo.location}</p>
                      <p className="truncate italic">{data.personalInfo.website}</p>
                  </div>
              </section>

              <div className="mt-auto pt-10">
                  <p className="text-[8px] font-bold opacity-20 uppercase tracking-[0.5em]">2026 Tech Edition</p>
              </div>
          </aside>

          <main className="flex-1 p-12 bg-white flex flex-col gap-10">
              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-slate-100 pb-2 mb-4" style={{ borderColor: accent + "20" }}>Summary</h2>
                  <p className="text-[10pt] leading-relaxed text-slate-700">{data.personalInfo.summary}</p>
              </section>

              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-slate-100 pb-2 mb-6" style={{ borderColor: accent + "20" }}>Professional Career</h2>
                  <div className="space-y-8">
                      {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-2">
                              <div className="flex justify-between items-baseline">
                                  <h4 className="font-bold text-[11pt] tracking-tight">{exp.position}</h4>
                                  <span className="text-[9pt] font-black opacity-30 tracking-wider italic uppercase">{exp.startDate} - {exp.endDate || 'NOW'}</span>
                              </div>
                              <p className="text-[10pt] font-bold text-slate-500 uppercase tracking-tighter">{exp.company} • {exp.location}</p>
                              <p className="text-[9.5pt] leading-relaxed text-slate-600 italic whitespace-pre-line border-l-2 border-slate-50 pl-4">{exp.description}</p>
                          </div>
                      ))}
                  </div>
              </section>

              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-slate-100 pb-2 mb-4" style={{ borderColor: accent + "20" }}>Academic Background</h2>
                  <div className="space-y-4">
                      {data.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-start">
                              <div>
                                  <p className="font-bold text-[10pt]">{edu.school}</p>
                                  <p className="text-[9pt] text-slate-500">{edu.degree} in {edu.fieldOfStudy}</p>
                              </div>
                              <span className="text-[9pt] font-bold opacity-20">{edu.endDate}</span>
                          </div>
                      ))}
                  </div>
              </section>
          </main>
      </div>
  );

  // Minimal Tech Layout (Used by: minimal, devops-pro, backend-env, systems-admin, qa-expert, data-scientist)
  const renderMinimalLayout = () => (
      <div className={cn(pageClass, "font-mono p-20")}>
          <header className="mb-12 border-b border-black pb-8">
              <h1 className="text-4xl font-bold tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs font-medium uppercase tracking-tight">
                  <p>role: {data.personalInfo.role}</p>
                  <p>mail: {data.personalInfo.email}</p>
                  <p>phone: {data.personalInfo.phone}</p>
                  <p>web: {data.personalInfo.website}</p>
              </div>
          </header>

          <main className="space-y-12">
              <section className="grid grid-cols-[120px_1fr] gap-12">
                  <h3 className="text-[9pt] font-bold uppercase underline underline-offset-4 decoration-2">Abstract</h3>
                  <p className="text-[10pt] leading-relaxed italic">{data.personalInfo.summary}</p>
              </section>

              <section className="grid grid-cols-[120px_1fr] gap-12">
                  <h3 className="text-[9pt] font-bold uppercase underline underline-offset-4 decoration-2">Log</h3>
                  <div className="space-y-8">
                      {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-2">
                              <div className="flex justify-between items-baseline border-b border-black/5 pb-1">
                                  <span className="font-bold text-[11pt] uppercase">{exp.position}</span>
                                  <span className="text-[8pt] opacity-40">{exp.startDate} - {exp.endDate || 'now'}</span>
                              </div>
                              <p className="text-[9pt] font-bold opacity-60">@{exp.company}, {exp.location}</p>
                              <p className="text-[9.5pt] leading-snug">{exp.description}</p>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="grid grid-cols-[120px_1fr] gap-12">
                  <h3 className="text-[9pt] font-bold uppercase underline underline-offset-4 decoration-2">Stack</h3>
                  <div className="flex flex-wrap gap-4 text-[9pt] font-black italic">
                      {data.skills.map(s => <span key={s}>{s}</span>)}
                  </div>
              </section>
          </main>
      </div>
  );

  // Executive Tech Layout (Used by: professional, product-exec, engineering-mgr, tech-writer)
  const renderExecutiveLayout = () => (
      <div className={cn(pageClass, "font-serif p-16 border-[12px] border-double border-slate-100")}>
          <header className="text-center mb-16 space-y-4">
              <h1 className="text-4xl font-bold tracking-[.1em] uppercase border-b-2 border-slate-900 inline-block pb-1 px-8">{data.personalInfo.fullName}</h1>
              <p className="font-sans text-xs uppercase tracking-[.4em] font-black text-slate-400">{data.personalInfo.role}</p>
              <div className="font-sans text-[8pt] flex justify-center gap-6 text-slate-500 font-bold">
                  <span>{data.personalInfo.email}</span>
                  <span>|</span>
                  <span>{data.personalInfo.phone}</span>
                  <span>|</span>
                  <span>{data.personalInfo.location}</span>
              </div>
          </header>

          <div className="space-y-12">
            <section className="space-y-4">
                <h3 className="font-sans text-[10pt] font-black uppercase tracking-[.2em] text-slate-300">Executive Profile</h3>
                <p className="text-[11pt] leading-relaxed text-slate-800 italic indent-8">{data.personalInfo.summary}</p>
            </section>

            <section className="space-y-6">
                <h3 className="font-sans text-[10pt] font-black uppercase tracking-[.2em] text-slate-300">Experience Record</h3>
                <div className="space-y-10">
                    {data.experience.map(exp => (
                        <div key={exp.id} className="space-y-2">
                            <div className="flex justify-between items-baseline font-sans">
                                <h4 className="font-bold text-[12pt] uppercase tracking-tight">{exp.position}</h4>
                                <span className="text-[9pt] font-bold text-slate-400 italic">{exp.startDate} - {exp.endDate || 'Present'}</span>
                            </div>
                            <h5 className="text-[11pt] font-bold italic opacity-70 mb-3">{exp.company} • {exp.location}</h5>
                            <p className="text-[10.5pt] leading-relaxed text-slate-700 whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="font-sans text-[10pt] font-black uppercase tracking-[.2em] text-slate-300">Academic History</h3>
                {data.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-start border-l-2 border-slate-100 pl-6">
                        <div>
                            <p className="font-bold text-[11pt]">{edu.school}</p>
                            <p className="text-[10pt] font-bold opacity-60">{edu.degree} in {edu.fieldOfStudy}</p>
                        </div>
                        <span className="font-sans text-[8pt] font-bold opacity-20">{edu.endDate}</span>
                    </div>
                ))}
            </section>
          </div>
      </div>
  );

  // Grouping templates to layouts
  switch (template) {
    case 'modern':
    case 'standard-tech':
        return renderModernLayout("#0067b8");
    case 'frontend-dev':
        return renderModernLayout("#6366f1");
    case 'mobile-dev':
        return renderModernLayout("#ec4899");
    case 'fullstack-modern':
        return renderModernLayout("#10b981");
    case 'ai-researcher':
        return renderModernLayout("#8b5cf6");

    case 'creative':
    case 'ux-designer':
        return renderSidebarLayout(false, "#f59e0b");
    case 'cloud-architect':
        return renderSidebarLayout(true, "#3b82f6");
    case 'cyber-sec':
        return renderSidebarLayout(true, "#22c55e");

    case 'minimal':
    case 'devops-pro':
    case 'backend-env':
    case 'systems-admin':
    case 'qa-expert':
    case 'data-scientist':
        return renderMinimalLayout();

    case 'professional':
    case 'product-exec':
    case 'engineering-mgr':
    case 'tech-writer':
        return renderExecutiveLayout();

    default:
        return renderModernLayout("#0067b8");
  }
}
