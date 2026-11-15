import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { userService } from '../services/userService';
import { sessionService } from '../services/sessionService';
import { UserProfile } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LoadingScreen } from './LoadingScreen';
import { doc, onSnapshot } from 'firebase/firestore';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  hasPremiumAccess: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  hasPremiumAccess: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribeSession: (() => void) | null = null;

    // Authentication state is sourced exclusively from Firebase Auth.
    // Browser storage is not an identity provider and must never grant access.
    localStorage.removeItem("simulatedUser");
    localStorage.removeItem("simulatedProfile");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setIsAuthReady(false);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (unsubscribeSession) {
        unsubscribeSession();
        unsubscribeSession = null;
      }

      if (currentUser) {
        let userProfile: UserProfile | null = null;
        try {
          userProfile = await userService.getUser(currentUser.uid);
          if (!userProfile) {
            userProfile = await userService.syncProfile(currentUser);
          }

          if (userProfile) {
            localStorage.setItem("tipo", userProfile.tipo);
          }

          unsubscribeProfile = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (docSnap) => {
              if (docSnap.exists()) {
                const updatedProfile = docSnap.data() as UserProfile;
                setProfile(updatedProfile);
                localStorage.setItem("tipo", updatedProfile.tipo);
              }
            },
            (listenerError) => {
              console.error("Erro ao acompanhar atualizações do perfil:", listenerError);
            }
          );

          try {
            await sessionService.registerSession(currentUser.uid);
            unsubscribeSession = sessionService.listenToCurrentSession(currentUser.uid, () => {
              auth.signOut();
            });
          } catch (sessionErr) {
            console.error("Falha ao registrar monitoramento da sessão:", sessionErr);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil autenticado:", error);
        }

        setUser(currentUser);
        setProfile(userProfile);
        setLoading(false);
        setIsAuthReady(true);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("tipo");
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeSession) unsubscribeSession();
    };
  }, []);

  const hasPremiumAccess = (): boolean => {
    if (!profile) return false;
    if (
      profile.tipo === 'admin' ||
      profile.tipo === 'super_admin' ||
      profile.tipo === 'terapeuta' ||
      profile.tipo === 'clinica' ||
      profile.tipo === 'empresa' ||
      profile.tipo === 'prefeitura' ||
      profile.tipo === 'moderador'
    ) return true;
    if (profile.subscriptionStatus === 'active') return true;
    if (profile.subscriptionStatus === 'trial') {
      if (!profile.trialEndDate) return true;
      return new Date() <= new Date(profile.trialEndDate);
    }
    return false;
  };

  if (loading || !isAuthReady) {
    return <LoadingScreen message="Autenticando sua sessão..." />;
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, hasPremiumAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, isAuthReady } = useAuth();
  const location = useLocation();

  if (loading || !isAuthReady) return <LoadingScreen message="Verificando permissões..." />;
  if (!user) return <Navigate to="/login" replace />;

  const isStandardUser = !profile || profile.tipo === 'usuario';
  if (isStandardUser && !profile?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

export const PremiumProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, isAuthReady, hasPremiumAccess } = useAuth();
  const location = useLocation();

  if (loading || !isAuthReady) return <LoadingScreen message="Verificando assinatura..." />;
  if (!user) return <Navigate to="/login" replace />;

  const isStandardUser = !profile || profile.tipo === 'usuario';
  if (isStandardUser && !profile?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (!hasPremiumAccess()) return <Navigate to="/assinatura" replace />;
  return <>{children}</>;
};
