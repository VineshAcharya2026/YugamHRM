import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { firestoreErrorMessage } from '../../lib/firestoreErrors';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Layout, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { buildResumeFirestorePayload, loadResumeFromFirestoreDoc } from '../../lib/resumeProPersistence';
import { exportHtmlNodeToPdf, pickPdfSourceElement } from '../../lib/exportResumePdf';
import type { ResumeData, TemplateId } from './pro/types';
import { createEmptyResumeData } from './pro/constants';
import ResumeForm from './pro/ResumeForm';
import ResumePreview from './pro/ResumePreview';
import TemplateSelector from './pro/TemplateSelector';

type BuilderPage = 'templates' | 'editor';

export const ResumeBuilder: React.FC = () => {
  const { user, profile } = useAuth();
  const [page, setPage] = useState<BuilderPage>('editor');
  const [data, setData] = useState<ResumeData>(() => createEmptyResumeData());
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [banner, setBanner] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  /** Full-size preview without parent `transform` — html2canvas is unreliable on scaled nodes. */
  const pdfCaptureRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'resumes', user.uid));
      const raw = snap.exists() ? (snap.data() as Record<string, unknown>) : undefined;
      const { templateId: tid, data: d } = loadResumeFromFirestoreDoc(raw, { fallbackEmail: profile?.email ?? user.email });
      setTemplateId(tid);
      setData(d);
    } catch (err) {
      console.error('Resume load:', err);
      setBanner({ tone: 'err', text: firestoreErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [user, profile?.email]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    setBanner(null);
    try {
      await setDoc(doc(db, 'resumes', user.uid), buildResumeFirestorePayload(user.uid, templateId, data));
      setBanner({ tone: 'ok', text: 'Resume saved to the cloud.' });
      window.setTimeout(() => setBanner(null), 4000);
    } catch (err) {
      console.error('Resume save:', err);
      setBanner({ tone: 'err', text: firestoreErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!user) return;
    const source = pickPdfSourceElement(pdfCaptureRef, previewRef);
    if (!source) {
      setBanner({ tone: 'err', text: 'Preview not ready. Open the editor tab and try again.' });
      return;
    }
    setPdfBusy(true);
    setBanner(null);
    try {
      const slug = (data.personalInfo.fullName || 'resume').toLowerCase().replace(/\s+/g, '-');
      await exportHtmlNodeToPdf(source, slug);
    } catch (err) {
      console.error('PDF export:', err);
      const hint = err instanceof Error && err.message ? err.message : '';
      setBanner({
        tone: 'err',
        text:
          hint && hint.length < 180
            ? `Could not generate PDF. ${hint}`
            : 'Could not generate PDF. Try again; if it keeps failing, remove external photos or use another browser.',
      });
    } finally {
      setPdfBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="col-header animate-pulse p-10 text-xs font-bold uppercase tracking-[0.2em] text-brand-fg-muted">
        Loading resume builder…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 font-sans">
      <div className="flex flex-col gap-4 border-b border-windows-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-fg">Resume builder</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-fg-muted">Templates, live preview, cloud save</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-windows-border bg-brand-panel p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setPage('templates')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all',
                page === 'templates' ? 'fluent-button-primary shadow-md' : 'text-brand-fg-muted hover:bg-brand-surface-hover',
              )}
            >
              <Layout className="h-4 w-4" />
              Templates
            </button>
            <button
              type="button"
              onClick={() => setPage('editor')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all',
                page === 'editor' ? 'fluent-button-primary shadow-md' : 'text-brand-fg-muted hover:bg-brand-surface-hover',
              )}
            >
              <FileText className="h-4 w-4" />
              Editor
            </button>
          </div>
          {page === 'editor' && (
            <>
              <button
                type="button"
                onClick={() => void onSave()}
                disabled={saving}
                className="windows-button-secondary flex items-center gap-2 text-xs py-2.5 px-4 disabled:opacity-50"
              >
                <Save className="w-4 h-4 opacity-60" />
                {saving ? 'Saving…' : 'Save to cloud'}
              </button>
              <button
                type="button"
                onClick={() => void handleDownloadPdf()}
                disabled={pdfBusy}
                className="fluent-button-primary flex items-center gap-2 px-5 py-2.5 text-xs shadow-lg shadow-brand-cyan/20 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {pdfBusy ? 'Building PDF…' : 'Download PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      {banner && (
        <div
          className={cn(
            'rounded-lg border px-4 py-3 text-sm',
            banner.tone === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
              : 'border-red-500/30 bg-red-500/10 text-red-800',
          )}
          role="status"
        >
          {banner.text}
        </div>
      )}

      <AnimatePresence mode="wait">
        {page === 'templates' ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="windows-card p-8">
              <h3 className="mb-1 text-lg font-bold text-brand-fg">Choose a layout</h3>
              <p className="mb-6 text-sm text-brand-fg-muted">Pick a template, then switch to Editor to fill details and export.</p>
              <TemplateSelector
                current={templateId}
                onSelect={(id) => {
                  setTemplateId(id);
                  setPage('editor');
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(380px,480px)] gap-8 items-start"
          >
            <div className="windows-card p-6 sm:p-8 min-w-0">
              <ResumeForm data={data} setData={setData} />
            </div>

            <div className="xl:sticky xl:top-4 space-y-3">
              <div
                ref={pdfCaptureRef}
                className="fixed top-0 z-0 w-[210mm] max-w-none pointer-events-none"
                style={{ left: -10000 }}
                aria-hidden
              >
                <ResumePreview data={data} template={templateId} />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-fg-muted">Live preview</span>
                <span className="text-[10px] font-bold uppercase text-brand-fg-disabled">{templateId.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex max-h-[min(78vh,900px)] flex-col items-center overflow-hidden overflow-y-auto rounded-xl border border-windows-border bg-brand-page p-4 no-scrollbar sm:p-6">
                <div className="origin-top scale-[0.38] sm:scale-[0.42] md:scale-[0.48] xl:scale-[0.52] transition-transform shadow-2xl">
                  <div ref={previewRef}>
                    <ResumePreview data={data} template={templateId} />
                  </div>
                </div>
              </div>
              <p className="px-2 text-center text-[10px] text-brand-fg-muted">
                PDF export uses a full-size copy of the preview (no scaling). Save to cloud before leaving the page.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
