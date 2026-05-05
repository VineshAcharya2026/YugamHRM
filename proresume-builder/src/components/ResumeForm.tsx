import { ResumeData, Experience, Education } from '../types';
import { User, Briefcase, GraduationCap, Award, Globe, Plus, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  setData: (data: ResumeData) => void;
}

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1.5 flex-1 min-w-0">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
        <input 
        {...props} 
        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fluent-active/10 focus:border-fluent-active focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
        />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
    </div>
  </div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">{label}</label>
    <div className="relative group">
        <textarea 
          {...props} 
          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fluent-active/10 focus:border-fluent-active focus:bg-white transition-all h-36 resize-none placeholder:text-slate-300 shadow-sm"
        />
        <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, onAdd }: any) => (
  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-fluent-active shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <div>
          <h3 className="font-bold text-base text-slate-800 tracking-tight">{title}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Management Section</p>
      </div>
    </div>
    {onAdd && (
      <button 
        onClick={onAdd}
        className="text-[10px] uppercase font-bold tracking-widest bg-fluent-active text-white px-5 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
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
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
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

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setData({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
    };
    setData({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setData({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const updateSkills = (skillsString: string) => {
      setData({ ...data, skills: skillsString.split(',').map(s => s.trim()).filter(Boolean) });
  };

  const updateLanguages = (langsString: string) => {
    setData({ ...data, languages: langsString.split(',').map(l => l.trim()).filter(Boolean) });
  };

  return (
    <div className="space-y-12 pb-10">
      {/* Personal Info */}
      <section>
        <SectionHeader icon={User} title="Personal Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            placeholder="John Doe"
            value={data.personalInfo.fullName}
            onChange={(e: any) => updatePersonalInfo('fullName', e.target.value)}
          />
          <Input 
            label="Professional Title" 
            placeholder="Lead Developer"
            value={data.personalInfo.role}
            onChange={(e: any) => updatePersonalInfo('role', e.target.value)}
          />
          <Input 
            label="Email" 
            placeholder="john@example.com"
            value={data.personalInfo.email}
            onChange={(e: any) => updatePersonalInfo('email', e.target.value)}
          />
          <Input 
            label="Phone" 
            placeholder="+1 234 567 890"
            value={data.personalInfo.phone}
            onChange={(e: any) => updatePersonalInfo('phone', e.target.value)}
          />
          <Input 
            label="Location" 
            placeholder="New York, NY"
            value={data.personalInfo.location}
            onChange={(e: any) => updatePersonalInfo('location', e.target.value)}
          />
          <Input 
            label="Portfolio / Website" 
            placeholder="johndoe.com"
            value={data.personalInfo.website}
            onChange={(e: any) => updatePersonalInfo('website', e.target.value)}
          />
        </div>
        <div className="mt-6">
          <TextArea 
            label="Professional Summary" 
            placeholder="A short punchy introduction..."
            value={data.personalInfo.summary}
            onChange={(e: any) => updatePersonalInfo('summary', e.target.value)}
          />
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionHeader icon={Briefcase} title="Experience" onAdd={addExperience} />
        <div className="space-y-8">
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative group bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-fluent-active/20 transition-all duration-300">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input 
                    label="Position" 
                    value={exp.position} 
                    onChange={(e: any) => updateExperience(exp.id, 'position', e.target.value)}
                  />
                  <Input 
                    label="Company" 
                    value={exp.company} 
                    onChange={(e: any) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <Input 
                    label="Location" 
                    value={exp.location} 
                    onChange={(e: any) => updateExperience(exp.id, 'location', e.target.value)}
                  />
                  <div className="flex gap-4">
                    <Input 
                      label="Start" 
                      placeholder="Jan 2020"
                      value={exp.startDate} 
                      onChange={(e: any) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                    <Input 
                      label="End" 
                      placeholder="Present"
                      value={exp.endDate} 
                      disabled={exp.current}
                      onChange={(e: any) => updateExperience(exp.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <TextArea 
                    label="Roles & Achievements" 
                    value={exp.description} 
                    onChange={(e: any) => updateExperience(exp.id, 'description', e.target.value)}
                  />
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <SectionHeader icon={Award} title="Technical Inventory" />
        <div className="space-y-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fluent-active" />
                Expertise Stack (Comma-separated)
            </p>
            <div className="relative group">
                <textarea 
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-fluent-active/10 focus:border-fluent-active focus:bg-white transition-all h-32 resize-none shadow-sm font-mono placeholder:text-slate-300"
                    value={data.skills.join(', ')}
                    onChange={(e) => updateSkills(e.target.value)}
                    placeholder="React, AWS, Python, System Design..."
                />
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-fluent-active transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
            </div>
        </div>
      </section>

      {/* Education */}
      <section>
        <SectionHeader icon={GraduationCap} title="Education" onAdd={addEducation} />
        <div className="space-y-8">
          {data.education.map((edu) => (
            <div key={edu.id} className="relative group bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-fluent-active/20 transition-all duration-300">
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input 
                    label="School / Uni" 
                    value={edu.school} 
                    onChange={(e: any) => updateEducation(edu.id, 'school', e.target.value)}
                  />
                  <Input 
                    label="Qualification" 
                    value={edu.degree} 
                    onChange={(e: any) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <Input 
                    label="Field" 
                    value={edu.fieldOfStudy} 
                    onChange={(e: any) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  />
                  <div className="flex gap-4">
                    <Input 
                      label="From" 
                      value={edu.startDate} 
                      onChange={(e: any) => updateEducation(edu.id, 'startDate', e.target.value)}
                    />
                    <Input 
                      label="To" 
                      value={edu.endDate} 
                      onChange={(e: any) => updateEducation(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <SectionHeader icon={Globe} title="Languages" />
        <Input 
          label="Spoken Languages" 
          placeholder="English (Native), German (Fluent)..."
          value={data.languages.join(', ')}
          onChange={(e: any) => updateLanguages(e.target.value)}
        />
      </section>
    </div>
  );
}
