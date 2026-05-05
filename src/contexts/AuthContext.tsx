import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getRedirectResult, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  isMasterAdminEmail,
  resolveRoleForUser,
  shouldSeedSindhuEmployeeProfile,
  SINDHU_MASTER_EMPLOYEE_PROFILE,
} from '../lib/masterAdmin';
import type { EmployeeProfile } from '../lib/masterAdmin';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'candidate' | 'alumnus';
  displayName: string | null;
  photoURL: string | null;
  /** HR / employee directory fields (shown in Settings & profile). */
  employeeProfile?: EmployeeProfile | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  /** HR admin tools: candidates, tracker, reports, list (same as role admin or master) */
  isAdmin: boolean;
  /** Super-user: full nav + all Firestore rules (master emails in `masterAdmin.ts`). */
  isMaster: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isMaster: false,
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
      role: UserProfile['role'];
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
        const master = isMasterAdminEmail(user.email);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            let data = userDoc.data() as UserProfile;
            const role = master ? 'admin' : data.role;
            if (master && data.role !== 'admin') {
              await updateDoc(userRef, { role: 'admin' });
            }
            if (shouldSeedSindhuEmployeeProfile(user.email, data.employeeProfile)) {
              const ep: EmployeeProfile = { ...SINDHU_MASTER_EMPLOYEE_PROFILE };
              await updateDoc(userRef, {
                role: 'admin',
                displayName: SINDHU_MASTER_EMPLOYEE_PROFILE.fullName,
                employeeProfile: ep,
                employeeProfileUpdatedAt: new Date().toISOString(),
              });
              data = {
                ...data,
                role: 'admin',
                displayName: SINDHU_MASTER_EMPLOYEE_PROFILE.fullName,
                employeeProfile: ep,
              };
            }
            await upsertCandidateDoc({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role,
            });
            setProfile({ ...data, role });
          } else {
            const sindhuSeed = shouldSeedSindhuEmployeeProfile(user.email, null);
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              role: resolveRoleForUser(user.email, 'candidate'),
              displayName: sindhuSeed ? SINDHU_MASTER_EMPLOYEE_PROFILE.fullName : user.displayName,
              photoURL: user.photoURL,
              employeeProfile: sindhuSeed ? { ...SINDHU_MASTER_EMPLOYEE_PROFILE } : null,
            };
            await setDoc(userRef, {
              ...newProfile,
              ...(sindhuSeed ? { employeeProfileUpdatedAt: new Date().toISOString() } : {}),
              createdAt: new Date().toISOString(),
            });
            await upsertCandidateDoc({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: newProfile.role,
            });
            setProfile(newProfile);
          }
        } catch (e) {
          console.error('Auth profile / Firestore:', e);
          setProfile({
            uid: user.uid,
            email: user.email,
            role: resolveRoleForUser(user.email, 'candidate'),
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

  const isMaster = useMemo(() => isMasterAdminEmail(user?.email ?? null), [user?.email]);
  const isAdmin = useMemo(
    () => profile?.role === 'admin' || isMaster,
    [profile?.role, isMaster],
  );

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isMaster, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
