import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { firestoreErrorMessage } from './firestoreErrors';

const PAYMENT_PAGE = 500;

export type PaidForType = 'placement' | 'training';

export type PaymentStatus = 'pending' | 'partial' | 'completed';

export interface PaymentRow {
  id: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  paidFor: PaidForType;
  totalAmount: number;
  amountPaid: number;
  currency?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export function derivePaymentStatus(total: number, paid: number): PaymentStatus {
  const t = Number.isFinite(total) ? total : 0;
  const p = Number.isFinite(paid) ? paid : 0;
  if (t <= 0) return 'pending';
  if (p >= t - 0.0001) return 'completed';
  if (p > 0) return 'partial';
  return 'pending';
}

export function paymentBalance(total: number, paid: number): number {
  const t = Number.isFinite(total) ? total : 0;
  const p = Number.isFinite(paid) ? paid : 0;
  return Math.max(0, Math.round((t - p) * 100) / 100);
}

export async function listPaymentsForAdmin(): Promise<{
  payments: PaymentRow[];
  error: string | null;
}> {
  try {
    const snap = await getDocs(query(collection(db, 'payments'), limit(PAYMENT_PAGE)));
    const payments: PaymentRow[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Record<string, unknown>),
    })) as PaymentRow[];
    payments.sort((a, b) => {
      const ta = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const tb = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return tb - ta;
    });
    return { payments, error: null };
  } catch (err) {
    console.error('listPaymentsForAdmin:', err);
    return { payments: [], error: firestoreErrorMessage(err) };
  }
}

export interface PaymentWriteInput {
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  paidFor: PaidForType;
  totalAmount: number;
  amountPaid: number;
  currency?: string;
  notes?: string;
}

export async function createPayment(input: PaymentWriteInput): Promise<{ id: string | null; error: string | null }> {
  try {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(db, 'payments'), {
      ...input,
      currency: input.currency?.trim() || 'INR',
      createdAt: now,
      updatedAt: now,
    });
    return { id: ref.id, error: null };
  } catch (err) {
    console.error('createPayment:', err);
    return { id: null, error: firestoreErrorMessage(err) };
  }
}

export async function updatePayment(
  id: string,
  input: PaymentWriteInput,
): Promise<{ error: string | null }> {
  try {
    await updateDoc(doc(db, 'payments', id), {
      ...input,
      currency: input.currency?.trim() || 'INR',
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (err) {
    console.error('updatePayment:', err);
    return { error: firestoreErrorMessage(err) };
  }
}
