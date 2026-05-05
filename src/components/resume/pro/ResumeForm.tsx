import type { ComponentProps, ElementType } from 'react';
import type { Education, Experience, Project, ResumeData } from './types';
import { User, Briefcase, GraduationCap, Award, Globe, Plus, Trash2, FolderGit2 } from 'lucide-react';

function newRowId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface ResumeFormProps {
  data: ResumeData;
  setData: (data: ResumeData) => void;
}

const Input = ({ label, ...props }: ComponentProps<'input'> & { label: string }) => (
  <div className="space-y-1.5 flex-1 min-w-0">
    <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg border border-windows-border bg-brand-surface text-sm text-brand-fg shadow-sm transition-all placeholder:text-brand-fg-disabled focus:border-brand-edge-active focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
      />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
    </div>
  </div>
);

const TextArea = ({ label, ...props }: ComponentProps<'textarea'> & { label: string }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
      <textarea
        {...props}
        className="h-36 w-full resize-none rounded-lg border border-windows-border bg-brand-surface px-4 py-3 text-sm text-brand-fg shadow-sm transition-all placeholder:text-brand-fg-disabled focus:border-brand-edge-active focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
      />
      <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
    </div>
  </div>
);

const SectionHeader = ({
  icon: Icon,
  title,
  onAdd,
}: {
  icon: ElementType;
  title: string;
  onAdd?: () => void;
}) => (
  <div className="flex items-center justify-between mb-8 border-b border-windows-border pb-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-muted flex items-center justify-center text-fluent-active shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-base text-brand-fg tracking-tight">{title}</h3>
        <p className="text-[10px] text-brand-fg-muted font-bold uppercase tracking-widest leading-none">Management Section</p>
      </div>
    </div>
    {onAdd && (
      <button
        type="button"
        onClick={onAdd}
        className="fluent-button-primary flex items-center gap-2 rounded-lg px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-cyan/20"
      >
        <Plus className="w-3.5 h-3.5" /> Add {title.split(' ')[0]}
      </button>
    )}
  </div>
);

export default function ResumeForm({ data, setData }: ResumeFormProps) {
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setData({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: newRowId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setData({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setData({
      ...data,
      experience: data.experience.map((exp) => {
        if (exp.id !== id) return exp;
        const next = { ...exp, [field]: value };
        if (field === 'current' && value === true) {
          next.endDate = '';
        }
        return next;
      }),
    });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter((exp) => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: newRowId(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
    };
    setData({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter((edu) => edu.id !== id) });
  };

  const addProject = () => {
    const p: Project = { id: newRowId(), name: '', description: '', link: '' };
    setData({ ...data, projects: [...data.projects, p] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData({
      ...data,
      projects: data.projects.map((pr) => (pr.id === id ? { ...pr, [field]: value } : pr)),
    });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter((pr) => pr.id !== id) });
  };

  const updateSkills = (skillsString: string) => {
    setData({ ...data, skills: skillsString.split(',').map((s) => s.trim()).filter(Boolean) });
  };

  const updateLanguages = (langsString: string) => {
    setData({ ...data, languages: langsString.split(',').map((l) => l.trim()).filter(Boolean) });
  };

  return (
    <div className="space-y-12 pb-10">
      <section>
        <SectionHeader icon={User} title="Personal Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" placeholder="John Doe" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
          <Input label="Professional Title" placeholder="Lead Developer" value={data.personalInfo.role} onChange={(e) => updatePersonalInfo('role', e.target.value)} />
          <Input label="Email" placeholder="john@example.com" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
          <Input label="Phone" placeholder="+1 234 567 890" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
          <Input label="Location" placeholder="New York, NY" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
          <Input label="Portfolio / Website" placeholder="johndoe.com" value={data.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
        </div>
        <div className="mt-6">
          <TextArea
            label="Professional Summary"
            placeholder="A short punchy introduction..."
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          />
        </div>
      </section>

      <section>
        <SectionHeader icon={Briefcase} title="Experience" onAdd={addExperience} />
        <div className="space-y-8">
          {data.experience.map((exp) => (
            <div
              key={exp.id}
              className="group relative rounded-2xl border border-windows-border bg-brand-surface p-6 shadow-sm transition-all duration-300 hover:border-brand-cyan/30 hover:shadow-xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="absolute top-6 right-6 p-2.5 text-brand-fg-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                <Input label="Location" value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} />
                <div className="flex gap-4">
                  <Input label="Start" placeholder="Jan 2020" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                  <Input label="End" placeholder="Present" value={exp.endDate} disabled={exp.current} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} />
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-fg-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-windows-border text-brand-cyan focus:ring-brand-cyan"
                />
                I currently work here
              </label>
              <div className="mt-6">
                <TextArea label="Roles & Achievements" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Award} title="Technical Inventory" />
        <div className="space-y-4">
          <p className="text-[10px] text-brand-fg-muted font-bold uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-fluent-active" />
            Expertise Stack (Comma-separated)
          </p>
          <div className="relative group">
            <textarea
              className="h-32 w-full resize-none rounded-2xl border border-windows-border bg-brand-surface px-5 py-4 font-mono text-sm text-brand-fg shadow-sm transition-all placeholder:text-brand-fg-disabled focus:border-brand-edge-active focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
              value={data.skills.join(', ')}
              onChange={(e) => updateSkills(e.target.value)}
              placeholder="React, AWS, Python, System Design..."
            />
            <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader icon={GraduationCap} title="Education" onAdd={addEducation} />
        <div className="space-y-8">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="group relative rounded-2xl border border-windows-border bg-brand-surface p-6 shadow-sm transition-all duration-300 hover:border-brand-cyan/30 hover:shadow-xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="absolute top-6 right-6 p-2.5 text-brand-fg-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="School / Uni" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                <Input label="Qualification" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                <Input label="Field" value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} />
                <Input label="Grade / GPA" value={edu.grade} onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)} />
                <div className="flex gap-4">
                  <Input label="From" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                  <Input label="To" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={FolderGit2} title="Projects" onAdd={addProject} />
        <div className="space-y-8">
          {data.projects.map((pr) => (
            <div
              key={pr.id}
              className="group relative rounded-2xl border border-windows-border bg-brand-surface p-6 shadow-sm transition-all duration-300 hover:border-brand-cyan/30 hover:shadow-xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => removeProject(pr.id)}
                className="absolute top-6 right-6 p-2.5 text-brand-fg-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 gap-6">
                <Input label="Project name" value={pr.name} onChange={(e) => updateProject(pr.id, 'name', e.target.value)} />
                <Input label="Link" placeholder="github.com/..." value={pr.link} onChange={(e) => updateProject(pr.id, 'link', e.target.value)} />
                <TextArea label="Description" value={pr.description} onChange={(e) => updateProject(pr.id, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Globe} title="Languages" />
        <Input
          label="Spoken Languages"
          placeholder="English (Native), German (Fluent)..."
          value={data.languages.join(', ')}
          onChange={(e) => updateLanguages(e.target.value)}
        />
      </section>
    </div>
  );
}
