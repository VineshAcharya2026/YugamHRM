import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRedirectResult, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  isGoogleUser,
  sessionRole,
  canWriteCandidates,
  canReadCandidates,
  type AppRole,
} from '../lib/staffAccounts';
import type { EmployeeProfile } from '../lib/masterAdmin';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: AppRole;
  displayName: string | null;
  photoURL: string | null;
  /** HR / employee directory fields (shown in Settings & profile). */
  employeeProfile?: EmployeeProfile | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  /** Full control: seeded master on a password session. */
  isMaster: boolean;
  /** Create and edit candidate records (master, HR, placements). */
  canWriteCandidates: boolean;
  /** Open the candidate directory. */
  canReadCandidates: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isMaster: false,
  canWriteCandidates: false,
  canReadCandidates: false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch(() => undefined);

    const upsertCandidateDoc = async (args: {
      uid: string;
      email: string | null;
      displayName: string | null;
      role: AppRole;
    }) => {
      if (args.role !== 'candidate') return;
      const now = new Date().toISOString();
      const name = args.displayName?.trim() || '';
      const candidateRef = doc(db, 'candidates', args.uid);
      const candidateSnap = await getDoc(candidateRef);
      const existing = candidateSnap.exists() ? (candidateSnap.data() as Record<string, unknown>) : null;
      await setDoc(
        candidateRef,
        {
          userId: args.uid,
          name,
          emailId: args.email ?? '',
          contactNo: '',
          skillDomain: '',
          currentCompany: '',
          currentCtc: '',
          expectedCtc: '',
          noticePeriod: '',
          isGenuine: 'Pending',
          remarks: '',
          referredBy: '',
          source: 'auth-signup',
          updatedAt: now,
          createdAt: typeof existing?.createdAt === 'string' ? existing.createdAt : now,
        },
        { merge: true },
      );
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const signedInWithGoogle = isGoogleUser(user.providerData.map((provider) => provider.providerId));
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            const role = sessionRole(data.role, signedInWithGoogle);
            await upsertCandidateDoc({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role,
            });
            setProfile({ ...data, role });
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              role: 'candidate',
              displayName: user.displayName,
              photoURL: user.photoURL,
              employeeProfile: null,
            };
            await setDoc(userRef, {
              ...newProfile,
              createdAt: new Date().toISOString(),
            });
            await upsertCandidateDoc({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: 'candidate',
            });
            setProfile(newProfile);
          }
        } catch (e) {
          console.error('Auth profile / Firestore:', e);
          setProfile({
            uid: user.uid,
            email: user.email,
            role: signedInWithGoogle ? 'candidate' : sessionRole(undefined, false),
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  const role = profile?.role ?? 'candidate';
  const isMaster = role === 'master';
  const writeCandidates = canWriteCandidates(role);
  const readCandidates = canReadCandidates(role);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isMaster, canWriteCandidates: writeCandidates, canReadCandidates: readCandidates, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
