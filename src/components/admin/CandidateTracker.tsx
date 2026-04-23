import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Please select a PDF file.");
        return;
      }
      setSelectedFile(file);
      setUploading(true);
      
      try {
        const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setResumeUrl(url);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      alert("Please upload a resume first.");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, 'candidates'), {
        ...formData,
        resumeUrl,
        createdAt: new Date().toISOString()
      });
      alert("Candidate successfully recorded.");
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
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-20 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-black/5 pb-10 px-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#1f1f1f]">Candidate Tracker</h2>
          <p className="text-xs font-semibold text-windows-accent uppercase tracking-[0.2em] mt-2">Add New Candidate</p>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-bold text-black/40 bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm">
           <ClipboardList size={14} className="text-windows-accent" />
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-windows-accent/10 text-windows-accent shadow-sm">
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#1f1f1f]">New Candidate Record</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Candidate Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="name" required value={formData.name} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Full Name" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Contact No</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="contactNo" required value={formData.contactNo} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="+91..." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="emailId" type="email" required value={formData.emailId} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Current Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="currentCompany" required value={formData.currentCompany} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Company Name" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Skill/Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="skillDomain" required value={formData.skillDomain} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="e.g. Java Fullstack" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Notice Period</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="noticePeriod" required value={formData.noticePeriod} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="e.g. 30 Days" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Current CTC</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="currentCtc" required value={formData.currentCtc} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="LPA" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Expected CTC</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="expectedCtc" required value={formData.expectedCtc} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="LPA" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Check Status</label>
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
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Referred By</label>
                <div className="relative group">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={16} />
                  <input name="referredBy" value={formData.referredBy} onChange={handleInputChange} className="windows-input w-full !pl-11" placeholder="Referrer Name" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black/40 uppercase tracking-tighter px-1">Remarks</label>
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
              className="windows-button-primary w-full py-4 text-sm flex items-center justify-center space-x-3 shadow-lg shadow-windows-accent/20"
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
            className="windows-card p-10 bg-windows-accent/5 border-windows-accent/10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-windows-accent text-white shadow-md shadow-windows-accent/30">
                  <Upload size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1f1f1f]">Resume Upload</h3>
                  <p className="text-[10px] font-semibold text-windows-accent/60 uppercase tracking-tighter">PDF File Check</p>
                </div>
              </div>
              {resumeUrl && <CheckCircle2 className="text-green-500" size={20} />}
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer bg-white group",
                resumeUrl ? "border-green-500" : "border-black/5 hover:border-windows-accent/30"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileSelect} />
              <div className="w-16 h-16 rounded-full bg-windows-bg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className={cn("text-black/20 group-hover:text-windows-accent transition-colors", resumeUrl && "text-green-500")} size={32} />
              </div>
              <p className="text-xs font-bold text-[#1f1f1f] uppercase tracking-tighter">
                {uploading ? 'UPLOADING...' : resumeUrl ? 'REPLACE RESUME PDF' : 'UPLOAD CANDIDATE RESUME'}
              </p>
              <p className="text-[10px] mt-1 text-black/40">Only standard PDF files accepted</p>
            </div>
          </motion.div>

          <AnimatePresence>
            {resumeUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="windows-card p-0 overflow-hidden border-2 border-windows-accent/10 h-[600px] shadow-2xl relative"
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
