import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { FileUp, File, Trash2, Download, ExternalLink, Plus, AlertCircle } from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';

export const DocumentManager: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'documents'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setDocuments(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching docs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;
    setUploading(true);
    
    const nameInput = document.getElementById('file-name') as HTMLInputElement;
    const documentName = nameInput.value;

    try {
      // 1. Upload to Storage
      const storagePath = `documents/${user.uid}/${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(storageRef);

      // 2. Save Metadata to Firestore
      const newDoc = {
        userId: user.uid,
        name: documentName,
        fileName: selectedFile.name,
        type: selectedFile.type.split('/')[1] || 'binary',
        size: selectedFile.size,
        url,
        storagePath,
        uploadedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'documents'), newDoc);
      setDocuments(prev => [{ id: docRef.id, ...newDoc }, ...prev]);
      
      // Cleanup
      setSelectedFile(null);
      nameInput.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload. Ensure your Firebase Storage rules allow writes.");
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (docData: any) => {
    if (!window.confirm("Confirm deletion of this asset?")) return;
    try {
      // Delete from Storage
      if (docData.storagePath) {
        const storageRef = ref(storage, docData.storagePath);
        await deleteObject(storageRef);
      }
      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', docData.id));
      setDocuments(prev => prev.filter(d => d.id !== docData.id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">My Career Repository</h2>
          <p className="text-xs font-semibold text-windows-accent uppercase tracking-widest mt-1">Cloud Assets & Certifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 windows-card p-10 h-fit bg-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 rounded-lg bg-windows-accent/10 text-windows-accent">
               <FileUp size={18} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Upload Asset</h3>
          </div>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black/60 px-1 uppercase">Document Label</label>
              <input 
                id="file-name" 
                required 
                className="windows-input w-full" 
                placeholder="e.g. AWS Solutions Architect" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black/60 px-1 uppercase">Cloud Endpoint</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group",
                  selectedFile 
                    ? "border-green-500 bg-green-50/30" 
                    : "border-black/5 bg-black/[0.02] hover:bg-black/5"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <Plus className="rotate-45" size={20} />
                    </div>
                    <p className="text-xs font-bold text-green-700 truncate px-4">{selectedFile.name}</p>
                    <p className="text-[10px] text-green-600 font-medium uppercase font-mono tracking-tighter">
                      READY_FOR_UPLOAD • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="text-windows-accent" size={24} />
                    </div>
                    <p className="text-[11px] font-bold text-black/80 uppercase tracking-tight">Select Cloud Asset</p>
                    <p className="text-[10px] mt-1 text-black/40">PDF, PNG, JPG (MAX 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {selectedFile && (
              <button 
                type="submit"
                disabled={uploading}
                className="windows-button-primary w-full flex items-center justify-center space-x-2 shadow-lg shadow-windows-accent/20"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <Plus size={16} />
                )}
                <span>{uploading ? 'SYNCHRONIZING...' : 'UPLOAD TO REPOSITORY'}</span>
              </button>
            )}
          </form>
        </div>

        {/* File List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Stored Assets ({documents.length})</h3>
          </div>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center p-20 opacity-30">
               <div className="w-12 h-12 rounded-full border-4 border-windows-accent border-t-transparent animate-spin mb-4" />
               <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Querying Storage Cluster...</p>
             </div>
          ) : documents.length === 0 ? (
            <div className="p-20 windows-card border-dashed border-2 flex flex-col items-center justify-center text-center opacity-30">
              <File size={48} className="mb-4 text-black/20" />
              <p className="text-sm font-bold uppercase tracking-widest text-black/60">Your asset repository is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div key={doc.id} className="windows-card p-5 group hover:ring-2 hover:ring-windows-accent/20 transition-all bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-windows-accent/5 flex items-center justify-center text-windows-accent border border-windows-accent/10 shadow-sm">
                        <File size={28} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1f1f1f] group-hover:text-windows-accent transition-colors">{doc.name}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                           <span className="text-[10px] font-bold text-black/30 uppercase tracking-tighter">
                             {formatDate(doc.uploadedAt)}
                           </span>
                           <span className="w-1 h-1 rounded-full bg-black/10" />
                           <span className="text-[10px] font-bold text-windows-accent uppercase tracking-tighter">
                             {doc.type.toUpperCase()}
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-3 rounded-xl hover:bg-windows-accent text-black/30 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-windows-accent/20"
                        title="Open Stream"
                      >
                        <ExternalLink size={20} />
                      </a>
                      <button 
                        onClick={() => deleteDocument(doc)} 
                        className="p-3 rounded-xl hover:bg-red-500 text-black/30 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                        title="Erase Asset"
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
