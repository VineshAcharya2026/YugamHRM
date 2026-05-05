import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

/** 15 MiB — aligned with default Storage rules. */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const DOCS_ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const PDF = 'application/pdf';

/** When `file.type` is empty (common on mobile), infer from extension. */
export function inferAllowedMimeFromFileName(
  fileName: string,
): (typeof DOCS_ALLOWED_TYPES)[number] | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return null;
}

/**
 * Content-Type for Storage metadata — must match `storage.rules` `isSmallUserDoc()`.
 * Never use application/octet-stream for user document paths.
 */
export function getStorageContentTypeForUserDoc(file: File): string {
  if (file.type && DOCS_ALLOWED_TYPES.includes(file.type as (typeof DOCS_ALLOWED_TYPES)[number])) {
    return file.type;
  }
  return inferAllowedMimeFromFileName(file.name) ?? 'application/pdf';
}

/** Admin resume vault: PDF only in rules. */
export function getStorageContentTypeForAdminPdf(file: File): string {
  if (file.type === PDF) return PDF;
  if (file.name.toLowerCase().endsWith('.pdf')) return PDF;
  return PDF;
}

export function validateFileForUserDocuments(file: File): string | null {
  if (file.size <= 0) {
    return 'File is empty.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File is too large. Maximum size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`;
  }
  const fromMime = file.type && DOCS_ALLOWED_TYPES.includes(file.type as (typeof DOCS_ALLOWED_TYPES)[number]);
  const fromName = inferAllowedMimeFromFileName(file.name) !== null;
  if (!fromMime && !fromName) {
    return 'Allowed types: PDF, JPEG, PNG, or WebP.';
  }
  return null;
}

export function validatePdfForAdminResume(file: File): string | null {
  if (file.size <= 0) {
    return 'File is empty.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `PDF must be under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`;
  }
  const namePdf = file.name.toLowerCase().endsWith('.pdf');
  if (!namePdf && file.type !== PDF) {
    return 'Only PDF files are allowed.';
  }
  return null;
}

export function safeStorageFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, '_');
  return base.slice(0, 200) || 'file';
}

export function humanizeStorageError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code);
    if (code === 'storage/unauthorized' || code === 'storage/permission-denied') {
      return 'Permission denied. Sign in again, or ask an admin to check Storage rules.';
    }
    if (code === 'storage/canceled') {
      return 'Upload was canceled.';
    }
    if (code === 'storage/quota-exceeded') {
      return 'Storage quota exceeded. Contact the project owner.';
    }
    if (code === 'storage/retry-limit-exceeded' || code === 'storage/unknown') {
      return 'Network error. Check your connection and try again.';
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Upload failed. Please try again.';
}

export type UploadProgress = {
  percent: number;
  bytesTransferred: number;
  totalBytes: number;
};

export type UploadFileOptions = {
  contentType: string;
  timeoutMs?: number;
  urlTimeoutMs?: number;
};

const DEFAULT_UPLOAD_TIMEOUT_MS = 12 * 60 * 1000;
const DEFAULT_URL_TIMEOUT_MS = 90 * 1000;

/** Files this size or below use a single `uploadBytes` call (more reliable for small PDFs; avoids resumable “stuck at 0%”). */
const USE_SIMPLE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;

function withUrlRace(urlWork: Promise<string>, urlBudget: number) {
  const urlTimeout = new Promise<never>((_, r) => {
    setTimeout(
      () =>
        r(
          new Error(
            'Could not finalize upload (download link). Check network and that Firebase Storage is enabled.',
          ),
        ),
      urlBudget,
    );
  });
  return Promise.race([urlWork, urlTimeout]);
}

/**
 * Small file: one-shot upload (more reliable for tiny PDFs; avoids resumable “0%” stalls).
 */
function uploadFileSimple(
  storage: FirebaseStorage,
  path: string,
  file: File,
  onProgress: ((p: UploadProgress) => void) | undefined,
  contentType: string,
  totalBudget: number,
  urlBudget: number,
): { done: Promise<string>; cancel: () => void } {
  const storageRef = ref(storage, path);

  const work = (async () => {
    onProgress?.({
      percent: 0,
      bytesTransferred: 0,
      totalBytes: file.size,
    });
    await uploadBytes(storageRef, file, { contentType });
    onProgress?.({
      percent: 100,
      bytesTransferred: file.size,
      totalBytes: file.size,
    });
    return withUrlRace(getDownloadURL(storageRef), urlBudget);
  })();

  const done = Promise.race([
    work,
    new Promise<never>((_, r) => {
      setTimeout(
        () =>
          r(
            new Error('Upload timed out. Try a smaller file or a more stable network, then try again.'),
          ),
        totalBudget,
      );
    }),
  ]);

  return {
    done,
    /** `uploadBytes` cannot be stopped mid-request; use for UI parity only. */
    cancel: () => {},
  };
}

/**
 * Resumable upload with progress, cancel, and timeouts.
 * Small files use `uploadBytes` to avoid resumable sessions stuck at 0% on some browsers.
 */
export function uploadFileResumable(
  storage: FirebaseStorage,
  path: string,
  file: File,
  onProgress?: (p: UploadProgress) => void,
  options?: UploadFileOptions,
): { done: Promise<string>; cancel: () => void } {
  const contentType = options?.contentType ?? 'application/pdf';
  const totalBudget = options?.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS;
  const urlBudget = options?.urlTimeoutMs ?? DEFAULT_URL_TIMEOUT_MS;

  if (file.size <= USE_SIMPLE_UPLOAD_MAX_BYTES) {
    return uploadFileSimple(storage, path, file, onProgress, contentType, totalBudget, urlBudget);
  }

  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, { contentType });

  let totalTimer: ReturnType<typeof setTimeout> | undefined;

  const done = new Promise<string>((resolve, reject) => {
    const clearTotal = () => {
      if (totalTimer !== undefined) {
        clearTimeout(totalTimer);
        totalTimer = undefined;
      }
    };

    const fail = (err: unknown) => {
      clearTotal();
      reject(err);
    };

    const succeed = (url: string) => {
      clearTotal();
      resolve(url);
    };

    totalTimer = setTimeout(() => {
      try {
        task.cancel();
      } catch {
        /* ignore */
      }
      fail(
        new Error('Upload timed out. Try a smaller file or a more stable network, then try again.'),
      );
    }, totalBudget);

    task.on(
      'state_changed',
      (snapshot) => {
        const total = snapshot.totalBytes;
        const transferred = snapshot.bytesTransferred;
        const percent = total > 0 ? (transferred / total) * 100 : 0;
        onProgress?.({
          percent,
          bytesTransferred: transferred,
          totalBytes: total,
        });
      },
      (err) => {
        fail(err);
      },
      () => {
        void withUrlRace(getDownloadURL(task.snapshot.ref), urlBudget).then(succeed).catch(fail);
      },
    );
  });

  return {
    done,
    cancel: () => {
      try {
        task.cancel();
      } catch {
        /* ignore */
      }
    },
  };
}
