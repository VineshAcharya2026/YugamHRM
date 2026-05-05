import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import {
  getStorageContentTypeForUserDoc,
  humanizeStorageError,
  safeStorageFileName,
  uploadFileResumable,
  validateFileForUserDocuments,
} from '../../lib/storageUpload';
import { FileUp, File, Trash2, ExternalLink, Plus, Camera } from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';
import { firestoreErrorMessage } from '../../lib/firestoreErrors';

export const DocumentManager: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<
    { id: string; name: string; type: string; url: string; storagePath: string; uploadedAt: string; fileName: string; size: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentLabel, setDocumentLabel] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const activeUploadCancelRef = useRef<(() => void) | null>(null);

  const loadDocs = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setListError(null);
    try {
      const q = query(collection(db, 'documents'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      setDocuments(
        querySnapshot.docs.map((d) => {
          const x = d.data() as {
            name: string;
            type: string;
            url: string;
            storagePath: string;
            uploadedAt: string;
            fileName: string;
            size: number;
          };
          return { id: d.id, ...x };
        }),
      );
    } catch (error) {
      console.error('Error fetching docs:', error);
      setListError(firestoreErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const onPickFile = (file: File | undefined) => {
    setFormError(null);
    if (!file) {
      return;
    }
    const err = validateFileForUserDocuments(file);
    if (err) {
      setFormError(err);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!documentLabel.trim()) {
      setDocumentLabel(file.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPickFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user || !selectedFile) {
      setFormError('Choose a file first.');
      return;
    }
    const label = documentLabel.trim() || selectedFile.name;
    setUploading(true);
    setUploadProgress(0);

    const path = `documents/${user.uid}/${Date.now()}_${safeStorageFileName(selectedFile.name)}`;
    const contentType = getStorageContentTypeForUserDoc(selectedFile);
    const { done, cancel } = uploadFileResumable(
      storage,
      path,
      selectedFile,
      (p) => {
        setUploadProgress(Math.round(p.percent));
      },
      { contentType },
    );
    activeUploadCancelRef.current = cancel;

    try {
      const url = await done;

      const newDoc = {
        userId: user.uid,
        name: label,
        fileName: selectedFile.name,
        type: contentType.split('/')[1] || 'file',
        size: selectedFile.size,
        url,
        storagePath: path,
        uploadedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'documents'), newDoc);
      setDocuments((prev) => [{ id: docRef.id, ...newDoc }, ...prev]);
      setSelectedFile(null);
      setDocumentLabel('');
    } catch (error) {
      console.error('Upload error:', error);
      setFormError(humanizeStorageError(error));
    } finally {
      activeUploadCancelRef.current = null;
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (docData: (typeof documents)[0]) => {
    if (!window.confirm('Delete this file from the cloud?')) {
      return;
    }
    try {
      if (docData.storagePath) {
        const storageRef = ref(storage, docData.storagePath);
        await deleteObject(storageRef);
      }
      await deleteDoc(doc(db, 'documents', docData.id));
      setDocuments((prev) => prev.filter((d) => d.id !== docData.id));
    } catch (error) {
      console.error('Delete error:', error);
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code: string }).code)
          : '';
      setFormError(
        code.startsWith('storage/') ? humanizeStorageError(error) : firestoreErrorMessage(error),
      );
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-fg">My Career Repository</h2>
          <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mt-1">
            Cloud assets &amp; certifications
          </p>
        </div>
      </div>

      {listError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          role="alert"
        >
          <span>{listError}</span>
          <button
            type="button"
            onClick={() => void loadDocs()}
            className="shrink-0 text-xs font-bold text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 windows-card p-10 h-fit bg-brand-surface/90 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 rounded-lg bg-brand-info-bg text-brand-cyan">
              <FileUp size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Upload asset</h3>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800 text-xs font-medium">
              {formError}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-brand-fg-muted px-1 uppercase" htmlFor="file-name">
                Document label
              </label>
              <input
                id="file-name"
                value={documentLabel}
                onChange={(e) => setDocumentLabel(e.target.value)}
                className="windows-input w-full"
                placeholder="e.g. AWS Solutions Architect"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-brand-fg-muted px-1 uppercase">File or camera</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 windows-button-secondary py-2.5 text-xs"
                >
                  Choose file
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 windows-button-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  <Camera size={16} />
                  Camera
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                className="hidden"
              />
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group mt-2',
                  selectedFile ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-windows-border bg-brand-page hover:bg-brand-surface-hover',
                )}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <Plus className="rotate-45" size={20} />
                    </div>
                    <p className="text-xs font-bold text-green-700 truncate px-4">{selectedFile.name}</p>
                    <p className="text-[10px] text-green-600 font-medium uppercase font-mono tracking-tighter">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-brand-panel shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="text-brand-cyan" size={24} />
                    </div>
                    <p className="text-[11px] font-bold text-brand-fg uppercase tracking-tight">Select or use camera</p>
                    <p className="text-[10px] mt-1 text-brand-fg-muted">PDF, JPEG, PNG, WebP — max 15 MB</p>
                  </>
                )}
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-brand-page rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-cyan transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-brand-fg-muted font-mono">Uploading… {uploadProgress}%</p>
                  <button
                    type="button"
                    onClick={() => activeUploadCancelRef.current?.()}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedFile && (
              <button
                type="submit"
                disabled={uploading}
                className="windows-button-primary w-full flex items-center justify-center space-x-2 shadow-lg shadow-brand-cyan/20"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <Plus size={16} />
                )}
                <span>{uploading ? 'Uploading…' : 'Upload to repository'}</span>
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Stored assets ({documents.length})</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 opacity-30">
              <div className="w-12 h-12 rounded-full border-4 border-brand-cyan border-t-transparent animate-spin mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Loading…</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-20 windows-card border-dashed border-2 flex flex-col items-center justify-center text-center opacity-30">
              <File size={48} className="mb-4 text-brand-fg-disabled" />
              <p className="text-sm font-bold uppercase tracking-widest text-brand-fg-muted">No files yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="windows-card p-5 group hover:ring-2 hover:ring-brand-cyan/25 transition-all bg-brand-surface/80 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-brand-cyan/5 flex items-center justify-center text-brand-cyan border border-windows-border shadow-sm shrink-0">
                        <File size={28} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-brand-fg group-hover:text-brand-cyan transition-colors truncate">
                          {d.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-brand-fg-disabled uppercase tracking-tighter">
                            {formatDate(d.uploadedAt)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-windows-border" />
                          <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-tighter">
                            {d.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl hover:bg-brand-cyan text-brand-fg-disabled hover:text-brand-cta-text transition-all shadow-sm hover:shadow-lg hover:shadow-brand-cyan/20"
                        title="Open"
                      >
                        <ExternalLink size={20} />
                      </a>
                      <button
                        type="button"
                        onClick={() => void deleteDocument(d)}
                        className="p-3 rounded-xl hover:bg-red-500 text-brand-fg-disabled hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
