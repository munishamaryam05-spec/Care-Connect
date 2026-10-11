import { useState } from 'react';
import {
  Heart, Eye, EyeOff, Shield, Sparkles, AlertCircle, ArrowLeft,
  CheckCircle, Database, Phone, Volume2, Users, ChevronRight, HelpCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { t } from '@/lib/translations';
import { useAuth } from '@/lib/auth-context';
import {
  DEMO_SENIOR_1, DEMO_SENIOR_2, DEMO_CAREGIVER_1, DEMO_CAREGIVER_2,
  type DemoUser
} from '@/lib/demo-store';
import { LanguageDropdown } from '@/components/LanguageSelector';
import { Spinner } from '@/components/ui/Spinner';
import type { Role } from '@/lib/supabase';

type AuthView = 'welcome' | 'form';
type FormMode = 'signin' | 'signup';

export function AuthPage() {
  const { language, setLanguage, enterDemoMode } = useAuth();
  const [view, setView] = useState<AuthView>('welcome');
  const [mode, setMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('senior');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSetupHelp, setShowSetupHelp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError(t('invalidEmail', language));
      return;
    }
    if (password.length < 6) {
      setError(t('invalidPassword', language));
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError(t('requiredField', language));
      return;
    }

    // Check if user entered demo credentials in the form
    const demoMatches = [DEMO_SENIOR_1, DEMO_SENIOR_2, DEMO_CAREGIVER_1, DEMO_CAREGIVER_2].find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (demoMatches) {
      enterDemoMode(demoMatches);
      return;
    }

    // Handle missing Supabase configuration honestly without inventing fake responses
    if (!isSupabaseConfigured) {
      setError(t('supabaseMissingNotice', language));
      return;
    }

    // Live Supabase authentication
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            display_name: name.trim(),
            role,
            preferred_language: language,
          });
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err: any) {
      const msg = err?.message || (mode === 'signup' ? t('signupError', language) : t('loginError', language));
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoClick(user: DemoUser) {
    enterDemoMode(user);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FBF9] via-[#FAF8F5] to-[#FFF9F2] flex flex-col justify-between">
      {/* Top Bar with Language Selector */}
      <header className="px-5 pt-5 pb-3 max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xs">
            <Heart size={20} className="text-white" fill="white" />
          </div>
          <div>
            <span className="text-xl font-black text-stone-900 tracking-tight">CareConnect</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Elder-Care MVP
            </span>
          </div>
        </div>

        {/* Global Visible Language Selector */}
        <div className="flex items-center gap-2">
          <LanguageDropdown current={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          {view === 'welcome' ? (
            /* ================= VIEW 1: WELCOME & ONBOARDING ================= */
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="text-center pt-2">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md ring-8 ring-teal-50">
                  <Heart size={40} className="text-white" fill="white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
                  {t('welcomeTitle', language)}
                </h1>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed px-2">
                  {t('welcomeSubtitle', language)}
                </p>
              </div>

              {/* Feature Highlights Pills */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                    <Volume2 size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-900 text-xs sm:text-sm">{t('featureVoice', language)}</p>
                    <p className="text-[11px] text-stone-500">English · ಕನ್ನಡ · മലയാളം · हिंदी</p>
                  </div>
                </div>

                <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-900 text-xs sm:text-sm">{t('featureCheckin', language)}</p>
                    <p className="text-[11px] text-stone-500">"I'm okay" · "I want to talk" · "I need help"</p>
                  </div>
                </div>

                <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-900 text-xs sm:text-sm">{t('featurePrivacy', language)}</p>
                    <p className="text-[11px] text-stone-500">Granular consent & trusted caregiver links</p>
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTION 1: TRY DEMO MODE (Prominent, zero-setup) */}
              <div className="bg-white border-2 border-teal-500/70 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-teal-600" />
                    <h2 className="font-black text-stone-900 text-base sm:text-lg">{t('tryDemoMode', language)}</h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    No Setup Needed
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('demoModeDesc', language)}
                </p>

                {/* Instant Launch Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDemoClick(DEMO_SENIOR_1)}
                    className="w-full flex items-center justify-between bg-teal-600 hover:bg-teal-700 text-white font-bold p-3.5 rounded-2xl shadow-xs transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👵</span>
                      <div className="text-left">
                        <div className="text-sm font-extrabold">{t('exploreAsSenior', language)}</div>
                        <div className="text-[11px] text-teal-100 font-medium">Daily check-in & multilingual voice assistant</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-teal-200" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoClick(DEMO_CAREGIVER_1)}
                    className="w-full flex items-center justify-between bg-stone-100 hover:bg-teal-50 hover:border-teal-300 border border-stone-200 text-stone-800 font-bold p-3.5 rounded-2xl transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👩‍⚕️</span>
                      <div className="text-left">
                        <div className="text-sm font-extrabold">{t('exploreAsCaregiver', language)}</div>
                        <div className="text-[11px] text-stone-500 font-medium">Monitor check-ins, health readings & requests</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-stone-400" />
                  </button>
                </div>

                {/* Additional Personas */}
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Additional Personas:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoClick(DEMO_SENIOR_2)}
                      className="px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 text-left transition-colors"
                    >
                      <span>👴 Rajan Nair</span>
                      <div className="text-[10px] text-stone-400">Senior · മലയാളം</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoClick(DEMO_CAREGIVER_2)}
                      className="px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 text-left transition-colors"
                    >
                      <span>👨‍⚕️ Arun Kumar</span>
                      <div className="text-[10px] text-stone-400">Caregiver · हिंदी</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECONDARY ACTION 2: SIGN IN WITH ACCOUNT */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setView('form')}
                  className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl text-stone-800 font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={16} className="text-stone-500" />
                  <span>{t('signInWithAccount', language)}</span>
                </button>
              </div>

              {/* Supabase Status Indicator Banner */}
              <div className="rounded-2xl p-3.5 text-xs border transition-all text-left bg-white/70 border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={14} className={isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'} />
                    <span className="font-semibold text-stone-800">
                      {isSupabaseConfigured ? t('supabaseStatusConnected', language) : t('supabaseStatusDemoOnly', language)}
                    </span>
                  </div>
                  {!isSupabaseConfigured && (
                    <button
                      type="button"
                      onClick={() => setShowSetupHelp(!showSetupHelp)}
                      className="text-teal-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <HelpCircle size={12} />
                      <span>{t('supabaseSetupGuide', language)}</span>
                    </button>
                  )}
                </div>

                {showSetupHelp && !isSupabaseConfigured && (
                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
                    <p className="font-bold text-stone-800">To connect your live Supabase project:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-1">
                      <li>Copy <code className="bg-stone-100 px-1 py-0.5 rounded">.env.example</code> to <code className="bg-stone-100 px-1 py-0.5 rounded">.env</code></li>
                      <li>Add your <code className="bg-stone-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-stone-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code></li>
                      <li>Run migrations from <code className="bg-stone-100 px-1 py-0.5 rounded">supabase/migrations</code></li>
                    </ol>
                    <p className="text-teal-800 font-medium">Demo Mode runs 100% in-browser without needing Supabase setup!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: AUTH FORM (Sign In / Sign Up) ================= */
            <div className="space-y-4">
              {/* Back to Welcome Button */}
              <button
                type="button"
                onClick={() => { setView('welcome'); setError(''); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 mb-2 px-1 py-0.5"
              >
                <ArrowLeft size={14} />
                <span>{t('backToWelcome', language)}</span>
              </button>

              {/* Supabase status warning if unconfigured */}
              {!isSupabaseConfigured && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertCircle size={16} className="text-amber-700 flex-shrink-0" />
                    <span>Supabase is not configured yet</span>
                  </div>
                  <p className="leading-relaxed">
                    Live email authentication requires active Supabase credentials in your <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> file.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDemoClick(DEMO_SENIOR_1)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-colors"
                  >
                    Launch Demo Mode Instead (No account needed)
                  </button>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-6 sm:p-7">
                {/* Tabs */}
                <div className="flex bg-stone-100 rounded-2xl p-1 mb-5">
                  {(['signin', 'signup'] as FormMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(''); }}
                      className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        mode === m ? 'bg-white text-teal-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {t(m === 'signin' ? 'signIn' : 'signUp', language)}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        {t('name', language)}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-stone-900 text-sm"
                        placeholder={t('name', language)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {t('email', language)}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-stone-900 text-sm"
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {t('password', language)}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-stone-900 text-sm"
                        placeholder="••••••••"
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                        {t('iAmA', language)}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['senior', 'caregiver'] as Role[]).map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              role === r
                                ? 'border-teal-500 bg-teal-50 text-teal-800'
                                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {t(r === 'senior' ? 'senior' : 'caregiver', language)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 px-3.5 py-2.5 rounded-xl text-xs font-medium leading-relaxed">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
                  >
                    {loading ? <Spinner size="sm" /> : null}
                    <span>{t(mode === 'signin' ? 'signIn' : 'createAccount', language)}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Emergency & Privacy Footers */}
          <div className="mt-6 space-y-2.5 text-center text-xs text-stone-500">
            <div className="flex items-center justify-center gap-1.5 text-teal-800 font-medium">
              <Shield size={14} />
              <span>{t('privacyTitle', language)}: {t('privacyBody', language)}</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 font-medium">
              <AlertCircle size={14} className="text-amber-700 flex-shrink-0" />
              <span>{t('emergencyDisclaimer', language)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400">
        CareConnect · Multilingual Elder-Care Support MVP
      </footer>
    </div>
  );
}
