import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStorageContentTypeForAdminPdf,
  humanizeStorageError,
  safeStorageFileName,
  uploadFileResumable,
  validatePdfForAdminResume,
} from '../../lib/storageUpload';
import { 
  UserPlus, 
  Upload, 
  FileText, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Briefcase,
  Phone,
  Mail,
  DollarSign,
  Clock,
  UserCheck,
  MoreVertical,
  ClipboardList,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const CandidateTracker: React.FC = () => {
  const { user, canWriteCandidates } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadCancelRef = useRef<(() => void) | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    emailId: '',
    currentCompany: '',
    skillDomain: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '',
    isGenuine: 'Genuine',
    remarks: '',
    referredBy: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setUploadError(null);
    if (!file || !user || !canWriteCandidates) {
      if (!user) {
        setUploadError('You must be signed in to upload.');
      }
      return;
    }
    const bad = validatePdfForAdminResume(file);
    if (bad) {
      setUploadError(bad);
      setSelectedFile(null);
      setResumeUrl(null);
      return;
    }
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);
    const path = `resumes/${user.uid}/${Date.now()}_${safeStorageFileName(file.name)}`;
    const contentType = getStorageContentTypeForAdminPdf(file);
    const { done, cancel } = uploadFileResumable(
      storage,
      path,
      file,
      (p) => {
        setUploadProgress(Math.round(p.percent));
      },
      { contentType },
    );
    activeUploadCancelRef.current = cancel;
    try {
      const url = await done;
      setResumeUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(humanizeStorageError(error));
      setResumeUrl(null);
    } finally {
      activeUploadCancelRef.current = null;
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWriteCandidates) return;
    setUploadError(null);
    if (!resumeUrl) {
      setUploadError('Upload a resume PDF first (wait until the green check appears).');
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, 'candidates'), {
        ...formData,
        resumeUrl,
        createdAt: new Date().toISOString()
      });
      setFormData({
        name: '',
        contactNo: '',
        emailId: '',
        currentCompany: '',
        skillDomain: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '',
        isGenuine: 'Genuine',
        remarks: '',
        referredBy: ''
      });
      setResumeUrl(null);
      setSelectedFile(null);
      setSaveMessage('Candidate saved to the database.');
      window.setTimeout(() => setSaveMessage(null), 5000);
    } catch (error) {
      console.error('Submit error:', error);
      setUploadError(error instanceof Error ? error.message : 'Could not save candidate.');
    } finally {
      setLoading(false);
    }
  };

  if (!canWriteCandidates) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 font-sans">
        <h2 className="text-3xl font-bold tracking-tight text-brand-fg">Candidate Tracker</h2>
        <p className="text-sm text-brand-fg-muted">
          This desk can view candidates from the candidate list. Creating, editing, and deleting records is limited to HR, placements, and the master admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-20 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-windows-border pb-10 px-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-brand-fg">Candidate Tracker</h2>
          <p className="text-xs font-semibold text-brand-cyan uppercase tracking-[0.2em] mt-2">Add New Candidate</p>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-bold text-brand-fg-muted rounded-full border border-windows-border bg-brand-panel px-4 py-2 shadow-sm">
           <ClipboardList size={14} className="text-brand-cyan" />
           <span className="uppercase tracking-widest">Awaiting Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Registration Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 windows-card p-12 space-y-10"
        >
          {saveMessage && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-800 text-sm font-medium -mt-2">
              {saveMessage}
            </div>
          )}
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-brand-info-bg text-brand-cyan shadow-sm">
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-bold text-brand-fg">New Candidate Record</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Candidate Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="name" required value={formData.name} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Full Name" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Contact No</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="contactNo" required value={formData.contactNo} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="+91..." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="emailId" type="email" required value={formData.emailId} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Current Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="currentCompany" required value={formData.currentCompany} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Company Name" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Skill/Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="skillDomain" required value={formData.skillDomain} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="e.g. Java Fullstack" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Notice Period</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="noticePeriod" required value={formData.noticePeriod} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="e.g. 30 Days" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Current CTC</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="currentCtc" required value={formData.currentCtc} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="LPA" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Expected CTC</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="expectedCtc" required value={formData.expectedCtc} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="LPA" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Check Status</label>
                <select 
                  name="isGenuine" 
                  value={formData.isGenuine} 
                  onChange={handleInputChange}
                  className="windows-input w-full"
                >
                  <option value="Genuine">Genuine Profile</option>
                  <option value="Fake">Flagged/Fake</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Referred By</label>
                <div className="relative group">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={16} />
                  <input name="referredBy" value={formData.referredBy} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Referrer Name" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-brand-fg-muted uppercase tracking-tighter px-1">Remarks</label>
              <textarea 
                name="remarks" 
                rows={3} 
                value={formData.remarks} 
                onChange={handleInputChange} 
                className="windows-input w-full min-h-[80px]" 
                placeholder="Internal recruitment notes..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || uploading}
              className="windows-button-primary w-full py-4 text-sm flex items-center justify-center space-x-3 shadow-lg shadow-brand-cyan/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{loading ? 'SAVING...' : 'SAVE CANDIDATE TO DATABASE'}</span>
            </button>
          </form>
        </motion.div>

        {/* Resume Operations */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="windows-card border border-windows-border bg-brand-surface/90 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-brand-fg uppercase tracking-wider">
                Live Candidate Preview
              </h3>
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-1 rounded',
                  formData.isGenuine === 'Genuine'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                )}
              >
                {formData.isGenuine}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="opacity-50">Name:</span>{' '}
                <span className="font-semibold">{formData.name || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Phone:</span>{' '}
                <span className="font-semibold">{formData.contactNo || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Email:</span>{' '}
                <span className="font-semibold">{formData.emailId || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Company:</span>{' '}
                <span className="font-semibold">{formData.currentCompany || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Domain:</span>{' '}
                <span className="font-semibold">{formData.skillDomain || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Current CTC:</span>{' '}
                <span className="font-semibold">{formData.currentCtc || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Expected CTC:</span>{' '}
                <span className="font-semibold">{formData.expectedCtc || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Notice:</span>{' '}
                <span className="font-semibold">{formData.noticePeriod || '-'}</span>
              </div>
              <div>
                <span className="opacity-50">Referred By:</span>{' '}
                <span className="font-semibold">{formData.referredBy || '-'}</span>
              </div>
              <div className="pt-2 border-t border-windows-border">
                <p className="opacity-50 text-[11px] uppercase tracking-wider mb-1">Remarks</p>
                <p className="font-medium whitespace-pre-wrap">{formData.remarks || '-'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="windows-card border border-windows-border bg-brand-info-bg/20 p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-brand-cyan p-2 text-brand-cta-text shadow-md shadow-brand-cyan/30">
                  <Upload size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-fg">Resume upload</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-tighter text-brand-fg-muted">PDF (admin only, resumable)</p>
                </div>
              </div>
              {resumeUrl && <CheckCircle2 className="text-green-500" size={20} />}
            </div>

            {uploadError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-800">
                {uploadError}
              </div>
            )}

            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={cn(
                'group cursor-pointer rounded-2xl border-2 border-dashed bg-brand-page p-12 text-center transition-all',
                resumeUrl ? 'border-emerald-500' : 'border-windows-border hover:border-brand-cyan/40',
                uploading && "opacity-60 pointer-events-none"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
              />
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-panel transition-transform group-hover:scale-110">
                <FileText className={cn('text-brand-fg-disabled transition-colors group-hover:text-brand-cyan', resumeUrl && 'text-emerald-600')} size={32} />
              </div>
              <p className="text-xs font-bold text-brand-fg uppercase tracking-tighter">
                {uploading ? `UPLOADING… ${uploadProgress}%` : resumeUrl ? 'Replace resume PDF' : 'Upload candidate resume'}
              </p>
              <p className="text-[10px] mt-1 text-brand-fg-muted">PDF only, max 15 MB</p>
            </div>
            {uploading && (
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-page">
                  <div
                    className="h-full bg-brand-cyan transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => activeUploadCancelRef.current?.()}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Cancel upload
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {resumeUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="windows-card relative h-[600px] overflow-hidden border-2 border-windows-border p-0 shadow-2xl"
              >
                <div className="absolute top-4 left-4 z-10">
                   <div className="p-2 bg-black/80 text-white rounded-lg backdrop-blur-md flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      <Eye size={12} />
                      <span>Live Resume Preview</span>
                   </div>
                </div>
                <iframe 
                  src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                  className="w-full h-full border-none"
                  title="Resume Preview"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {!resumeUrl && !uploading && (
             <div className="flex flex-col items-center justify-center p-20 opacity-20 text-center grayscale">
                <XCircle size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.4em]">No Preview Available</p>
                <p className="text-[10px] mt-2 italic font-mono">WAITING_FOR_FILE</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
