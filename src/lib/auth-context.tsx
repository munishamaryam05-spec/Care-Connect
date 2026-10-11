import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type Profile, type Language } from './supabase';
import { demoStore, ALL_DEMO_USERS, DEMO_SENIOR_1, type DemoUser } from './demo-store';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  language: Language;
  isDemo: boolean;
  setLanguage: (lang: Language) => void;
  refreshProfile: () => Promise<void>;
  loginAsDemoUser: (demoUser: DemoUser) => void;
  enterDemoMode: (demoUser?: DemoUser) => void;
  exitDemoMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  language: 'en',
  isDemo: false,
  setLanguage: () => {},
  refreshProfile: async () => {},
  loginAsDemoUser: () => {},
  enterDemoMode: () => {},
  exitDemoMode: () => {},
  signOut: async () => {},
});

const UI_LANG_KEY = 'careconnect_ui_language';
const DEMO_ACTIVE_USER_KEY = 'careconnect_active_demo_user';
const DEMO_MODE_FLAG_KEY = 'careconnect_demo_mode_active';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize language: preserve user preference or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(UI_LANG_KEY) as Language;
    if (saved && ['en', 'kn', 'ml', 'hi'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  // Only restore demo mode if explicitly activated previously and active user ID exists
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    const savedFlag = localStorage.getItem(DEMO_MODE_FLAG_KEY);
    const savedUser = localStorage.getItem(DEMO_ACTIVE_USER_KEY);
    return savedFlag === 'true' && Boolean(savedUser);
  });

  // Helper to get effective UI language
  function getEffectiveLanguage(fallback: Language = 'en'): Language {
    const saved = localStorage.getItem(UI_LANG_KEY) as Language;
    if (saved && ['en', 'kn', 'ml', 'hi'].includes(saved)) {
      return saved;
    }
    return fallback;
  }

  // Handle demo user sign-in
  function applyDemoUser(demoUser: DemoUser) {
    // Preserve currently selected interface language independently of persona
    const activeLang = getEffectiveLanguage(demoUser.preferred_language || 'en');

    const mockUser: User = {
      id: demoUser.id,
      app_metadata: {},
      user_metadata: { name: demoUser.display_name },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: demoUser.email,
    };

    const storedProfile = demoStore.getProfile(demoUser.id);
    const mockProfile: Profile = storedProfile
      ? { ...storedProfile, preferred_language: activeLang }
      : {
          id: demoUser.id,
          display_name: demoUser.display_name,
          role: demoUser.role,
          preferred_language: activeLang,
          created_at: new Date().toISOString(),
          phone: demoUser.phone,
        };

    setUser(mockUser);
    setSession({
      access_token: 'mock-demo-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    });
    setProfile(mockProfile);
    setLanguageState(activeLang);

    localStorage.setItem(DEMO_ACTIVE_USER_KEY, demoUser.id);
    localStorage.setItem(DEMO_MODE_FLAG_KEY, 'true');
    setIsDemo(true);
    setLoading(false);
  }

  function loginAsDemoUser(demoUser: DemoUser) {
    applyDemoUser(demoUser);
  }

  function enterDemoMode(demoUser: DemoUser = DEMO_SENIOR_1) {
    applyDemoUser(demoUser);
  }

  function exitDemoMode() {
    localStorage.removeItem(DEMO_ACTIVE_USER_KEY);
    localStorage.removeItem(DEMO_MODE_FLAG_KEY);
    setIsDemo(false);
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  async function loadProfile(userId: string) {
    if (isDemo) {
      const p = demoStore.getProfile(userId);
      if (p) {
        setProfile(p);
      }
      return;
    }

    if (!isSupabaseConfigured) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (data) {
        setProfile(data);
        const activeLang = getEffectiveLanguage(data.preferred_language || 'en');
        setLanguageState(activeLang);
      }
    } catch {
      // fallback
    }
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id);
  }

  async function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem(UI_LANG_KEY, lang);

    if (isDemo && user) {
      demoStore.updateProfile(user.id, { preferred_language: lang });
      setProfile(prev => (prev ? { ...prev, preferred_language: lang } : null));
      return;
    }

    if (user && isSupabaseConfigured) {
      await supabase
        .from('profiles')
        .update({ preferred_language: lang })
        .eq('id', user.id);
      setProfile(prev => (prev ? { ...prev, preferred_language: lang } : null));
    }
  }

  async function signOut() {
    if (isDemo) {
      exitDemoMode();
      return;
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  useEffect(() => {
    // 1. If demo mode was explicitly active with a user ID in localStorage, restore it
    if (isDemo) {
      const activeId = localStorage.getItem(DEMO_ACTIVE_USER_KEY);
      if (activeId) {
        const matched = ALL_DEMO_USERS.find(u => u.id === activeId) || DEMO_SENIOR_1;
        applyDemoUser(matched);
        return;
      }
    }

    // 2. If Supabase is not configured, do not auto-login; show the welcome/onboarding screen
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 3. Real Supabase auth flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await loadProfile(session.user.id);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await loadProfile(session.user.id);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  // Subscribe to demo store updates
  useEffect(() => {
    if (!isDemo || !user) return;
    const unsubscribe = demoStore.subscribe(() => {
      const p = demoStore.getProfile(user.id);
      if (p) {
        setProfile(p);
      }
    });
    return unsubscribe;
  }, [isDemo, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        language,
        isDemo,
        setLanguage,
        refreshProfile,
        loginAsDemoUser,
        enterDemoMode,
        exitDemoMode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
