import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useForm, useFieldArray } from 'react-hook-form';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeTemplate } from './ResumeTemplate';
import { Save, Download, Plus, Trash2, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      personal: { fullName: '', email: '', phone: '', location: '', tagline: '', linkedin: '' },
      summary: '',
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ school: '', degree: '', startDate: '', endDate: '' }],
      skills: [''],
    }
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" as const });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" as const });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" as any });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'resumes', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          reset(docSnap.data());
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, reset]);

  const onSave = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'resumes', user.uid), {
        ...data,
        userId: user.uid,
        lastUpdated: new Date().toISOString()
      });
      alert('Data synchronized successfully!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formData = watch();
  
  // Memoize the document to prevent unnecessary re-renders of the engine
  const resumeDocument = useMemo(() => <ResumeTemplate data={formData} />, [formData]);

  if (loading) return <div className="animate-pulse col-header font-bold text-xs uppercase tracking-[0.2em] p-10">Starting Resume Builder...</div>;

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-black/5 shadow-sm">
        <div className="flex space-x-1 overflow-x-auto scrollbar-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <button 
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? 'bg-windows-accent text-white shadow-md' 
                  : step > i 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'text-black/40 hover:bg-black/5'
              }`}
            >
              STEP 0{i}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="windows-card p-10 space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Personal Details</h2>
                <p className="text-xs font-medium opacity-40 uppercase tracking-widest">Your basic contact information</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">Full Name</label>
                  <input {...register('personal.fullName')} className="windows-input w-full" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">Professional Tagline</label>
                  <input {...register('personal.tagline')} className="windows-input w-full" placeholder="Full Stack Cloud Engineer" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">Email</label>
                  <input {...register('personal.email')} className="windows-input w-full" placeholder="john@yugamcloud.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">Phone</label>
                  <input {...register('personal.phone')} className="windows-input w-full" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">Location</label>
                  <input {...register('personal.location')} className="windows-input w-full" placeholder="Bangalore, IN" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/60 px-1 uppercase tracking-tighter">LinkedIn URL</label>
                  <input {...register('personal.linkedin')} className="windows-input w-full" placeholder="linkedin.com/in/johndoe" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="windows-card p-10 space-y-6"
            >
               <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Executive Summary</h2>
                <p className="text-xs font-medium opacity-40 uppercase tracking-widest">High-level professional overview</p>
              </div>
              <textarea 
                {...register('summary')} 
                rows={10}
                className="windows-input w-full resize-none leading-relaxed"
                placeholder="Briefly describe your career goals, key achievements, and unique value proposition..."
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-2">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Work History</h2>
                  <p className="text-xs font-medium opacity-40 uppercase tracking-widest">Your past job roles</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => appendExp({ company: '', position: '', startDate: '', endDate: '', description: '' })}
                  className="windows-button-secondary flex items-center space-x-2 text-xs"
                >
                  <Plus size={14} /> <span>Add Position</span>
                </button>
              </div>
              {expFields.map((field, index) => (
                <div key={field.id} className="windows-card p-6 space-y-4 relative group">
                  <button 
                    onClick={() => removeExp(index)} 
                    className="absolute top-4 right-4 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Company</label>
                      <input {...register(`experience.${index}.company`)} className="windows-input w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Position</label>
                      <input {...register(`experience.${index}.position`)} className="windows-input w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Period</label>
                      <div className="flex items-center space-x-2">
                        <input {...register(`experience.${index}.startDate`)} placeholder="Start" className="windows-input w-full" />
                        <span className="opacity-20">-</span>
                        <input {...register(`experience.${index}.endDate`)} placeholder="End" className="windows-input w-full" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Responsibilities</label>
                    <textarea 
                      {...register(`experience.${index}.description`)} 
                      className="windows-input w-full h-24 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-2">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Education</h2>
                  <p className="text-xs font-medium opacity-40 uppercase tracking-widest">Your schools and certificates</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => appendEdu({ school: '', degree: '', startDate: '', endDate: '' })}
                  className="windows-button-secondary flex items-center space-x-2 text-xs"
                >
                  <Plus size={14} /> <span>Add Education</span>
                </button>
              </div>
              {eduFields.map((field, index) => (
                <div key={field.id} className="windows-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative group">
                  <button onClick={() => removeEdu(index)} className="absolute top-4 right-4 p-2 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">School / University</label>
                    <input {...register(`education.${index}.school`)} className="windows-input w-full" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Degree / Specialization</label>
                    <input {...register(`education.${index}.degree`)} className="windows-input w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Start Date</label>
                    <input {...register(`education.${index}.startDate`)} className="windows-input w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-tighter px-1">Completion Date</label>
                    <input {...register(`education.${index}.endDate`)} className="windows-input w-full" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="windows-card p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Skills & Export</h2>
                    <p className="text-xs font-medium opacity-40 uppercase tracking-widest">List your skills and get your file</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => (appendSkill as any)('')}
                    className="windows-button-secondary flex items-center space-x-2 text-xs"
                  >
                    <Plus size={14} /> <span>Add Skill</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="relative group">
                      <input {...register(`skills.${index}`)} className="windows-input w-full pr-8" placeholder="Skill name" />
                      <button 
                        onClick={() => removeSkill(index)} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 windows-card bg-windows-accent/5 border-dashed border-2 border-windows-accent/20 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-windows-accent flex items-center justify-center text-white shadow-xl rotate-3">
                    <Download size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1f1f1f]">Your PDF is Ready</h3>
                    <p className="text-sm opacity-50 mt-1">Your info is now in the job template.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <PDFDownloadLink 
                      key={JSON.stringify(formData)} // Key-stabilize to force refresh when data changes
                      document={resumeDocument} 
                      fileName={`${formData.personal.fullName || 'Resume'}_YugamCloud.pdf`}
                      className="windows-button-primary bg-[#1f1f1f] text-white px-10 py-3 shadow-lg flex items-center space-x-3"
                    >
                      {({ loading }: any) => (
                        <>
                          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Download size={20} />}
                          <span>{loading ? 'Making PDF...' : 'Download Resume'}</span>
                        </>
                      )}
                    </PDFDownloadLink>

                    <button 
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="windows-button-secondary flex items-center space-x-2 px-8 py-3"
                    >
                      <Eye size={18} />
                      <span>{showPreview ? 'Hide View' : 'Live Preview'}</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showPreview && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 600 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full mt-8 rounded-xl overflow-hidden shadow-inner border border-black/10"
                      >
                        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                          {resumeDocument}
                        </PDFViewer>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-8 border-t border-black/5">
          <button 
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center space-x-2 text-sm font-bold text-black/40 hover:text-black/80 disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={20} /> <span>Back</span>
          </button>
          
          <div className="flex space-x-4">
            <button 
              type="submit"
              disabled={saving}
              className="windows-button-secondary flex items-center space-x-2"
            >
              <Save size={18} className="opacity-50" /> 
              <span>{saving ? 'Syncing...' : 'Save Draft'}</span>
            </button>
            {step < 5 && (
              <button 
                type="button"
                onClick={() => setStep(s => Math.min(5, s + 1))}
                className="windows-button-primary flex items-center space-x-2 px-8"
              >
                <span>Continue</span> <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
