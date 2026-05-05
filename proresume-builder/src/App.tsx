import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Layout, FileText, ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, Code, Globe, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData, TemplateId } from './types';
import { INITIAL_DATA, TEMPLATES } from './constants';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import TemplateSelector from './components/TemplateSelector';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('modern');
  const [page, setPage] = useState<'selection' | 'builder'>('selection');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`resume-${data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="flex h-screen bg-[#f3f3f3]">
      {/* Sidebar Navigation */}
      <aside className="w-[68px] sm:w-64 border-r border-fluent-border flex flex-col acrylic z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-fluent-active flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            R
          </div>
          <span className="hidden sm:block font-bold text-lg tracking-tight">ProResume</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <button 
            onClick={() => setPage('selection')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
              page === 'selection' ? "bg-white shadow-sm text-fluent-active font-semibold" : "hover:bg-fluent-hover text-[#5d5d5d]"
            )}
          >
            <Layout className="w-5 h-5" />
            <span className="hidden sm:block text-sm">Store & Templates</span>
          </button>
          
          <button 
            onClick={() => setPage('builder')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
              page === 'builder' ? "bg-white shadow-sm text-fluent-active font-semibold" : "hover:bg-fluent-hover text-[#5d5d5d]"
            )}
          >
            <FileText className="w-5 h-5" />
            <span className="hidden sm:block text-sm">Resume Builder</span>
          </button>
        </nav>

        <div className="p-4 px-6">
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-[#888] tracking-widest mb-4">Account</p>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-fluent-hover cursor-pointer transition-all">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold ring-2 ring-white">
                    VJ
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate leading-none">Vinesh JM</p>
                    <p className="text-[10px] text-[#888] truncate">Pro Membership</p>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header/Title Bar */}
        <header className="h-16 flex items-center justify-between px-8 shrink-0">
             <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold text-[#1b1b1b]">
                    {page === 'selection' ? 'Templates Store' : 'Editing: My Resume'}
                </h2>
             </div>
             
             <div className="flex items-center gap-3">
                {page === 'builder' && (
                    <button 
                        onClick={handleDownloadPDF}
                        className="fluent-button-primary shadow-lg shadow-blue-500/20 text-xs py-2 px-5 flex items-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                    </button>
                )}
             </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-12 no-scrollbar">
            <AnimatePresence mode="wait">
            {page === 'selection' ? (
                <motion.div
                    key="selection"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                >
                    <div className="mb-10 mt-4">
                        <h1 className="text-4xl font-bold tracking-tighter mb-2">Build your future.</h1>
                        <p className="text-[#5d5d5d] text-base">Select from our professionally curated template collection designed for tech industries.</p>
                    </div>
                    
                    <TemplateSelector 
                        onSelect={(id) => {
                            setActiveTemplate(id);
                            setPage('builder');
                        }} 
                        current={activeTemplate}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="builder"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)] gap-8 h-full items-start"
                >
                    {/* Editor Section */}
                    <div className="flex flex-col min-w-0">
                        <div className="bg-white border border-fluent-border rounded-xl p-6 sm:p-8 shadow-sm">
                            <ResumeForm data={data} setData={setData} />
                        </div>
                    </div>

                    {/* Preview Sidebar */}
                    <div className="hidden lg:flex flex-col gap-4 sticky top-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Live Viewport</span>
                            <div className="flex gap-2 text-[10px] font-bold text-slate-400">
                                <span className="text-fluent-active">A4</span>
                                <span>/</span>
                                <span>US LETTER</span>
                            </div>
                        </div>
                        
                        <div className="bg-[#e5e5e5] rounded-xl border border-fluent-border overflow-hidden h-[calc(100vh-180px)] flex flex-col items-center p-8 overflow-y-auto no-scrollbar">
                           <div className="shadow-2xl origin-top scale-[0.45] xl:scale-[0.55] transition-transform">
                                <div ref={previewRef}>
                                    <ResumePreview data={data} template={activeTemplate} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-1.5 mt-2">
                            {TEMPLATES.slice(0, 8).map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTemplate(t.id)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        activeTemplate === t.id ? "bg-fluent-active w-4" : "bg-slate-300 hover:bg-slate-400"
                                    )}
                                    title={t.name}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
