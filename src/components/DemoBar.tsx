import { useState } from 'react';
import { Sparkles, RefreshCw, LogOut, ChevronDown, Check, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ALL_DEMO_USERS, demoStore } from '@/lib/demo-store';
import { showToast } from '@/components/ui/Toast';
import { t } from '@/lib/translations';
import type { Language } from '@/lib/supabase';

const LANGUAGE_OPTIONS: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', short: 'KN' },
  { code: 'ml', label: 'മലയാളം (Malayalam)', short: 'ML' },
  { code: 'hi', label: 'हिंदी (Hindi)', short: 'HI' },
];

export function DemoBar() {
  const { isDemo, user, profile, language, setLanguage, loginAsDemoUser, exitDemoMode } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  if (!isDemo || !user) return null;

  function handleReset() {
    demoStore.reset();
    showToast(
      language === 'kn'
        ? 'ಡೆಮೋ ಡೇಟಾ ಮರುಹೊಂದಿಸಲಾಗಿದೆ'
        : language === 'hi'
        ? 'डेमो डेटा रीसेट हो गया'
        : language === 'ml'
        ? 'ഡെമോ ഡാറ്റ പുനഃസജ്ജമാക്കി'
        : 'Demo data reset to default seed state',
      'success'
    );
  }

  return (
    <aside aria-label="Demo Mode Bar" className="bg-gradient-to-r from-amber-600 via-teal-700 to-teal-800 text-white text-xs px-3 py-1.5 shadow-md flex items-center justify-between sticky top-0 z-50">
      {/* Left: Demo badge & title */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-black tracking-wider uppercase bg-black/25 px-2.5 py-0.5 rounded-full text-[10px]">
          <Sparkles size={11} className="text-amber-200" />
          {t('demoMode', language)}
        </span>
        <span className="hidden xl:inline text-teal-100 opacity-90 truncate max-w-xs text-[11px]">
          {t('demoNotice', language)}
        </span>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 1. Desktop Persona Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-black/20 p-0.5 rounded-xl">
          {ALL_DEMO_USERS.map(u => {
            const isCurrent = user.id === u.id;
            const isSenior = u.role === 'senior';
            return (
              <button
                key={u.id}
                onClick={() => loginAsDemoUser(u)}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold flex items-center gap-1 text-[11px] ${
                  isCurrent
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to ${u.display_name} (${u.role})`}
              >
                <span>{isSenior ? '👵' : '👩‍⚕️'}</span>
                <span>{u.display_name.replace('[DEMO] ', '')}</span>
                <span className="text-[9px] opacity-70 uppercase font-semibold">({u.role === 'senior' ? 'Senior' : 'Caregiver'})</span>
                {isCurrent && <Check size={11} className="text-teal-700 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Mobile Persona Switcher Dropdown */}
        <div className="relative lg:hidden">
          <button
            onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); }}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg font-bold text-[11px]"
          >
            <span>{profile?.role === 'senior' ? '👵' : '👩‍⚕️'}</span>
            <span className="truncate max-w-[90px]">{profile?.display_name?.replace('[DEMO] ', '') || 'Demo User'}</span>
            <ChevronDown size={12} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white text-stone-900 rounded-2xl shadow-xl border border-stone-200 py-1.5 w-60 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-black text-stone-400 tracking-wider">
                {t('demoSwitcherTitle', language)}
              </div>
              {ALL_DEMO_USERS.map(u => {
                const isCurrent = user.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      loginAsDemoUser(u);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 ${
                      isCurrent ? 'bg-teal-50 text-teal-900 font-bold' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{u.role === 'senior' ? '👵' : '👩‍⚕️'}</span>
                      <div>
                        <div className="font-bold">{u.display_name.replace('[DEMO] ', '')}</div>
                        <div className="text-[10px] text-stone-400 capitalize">{u.role}</div>
                      </div>
                    </div>
                    {isCurrent && <Check size={14} className="text-teal-700 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. VISIBLE LANGUAGE SELECTOR IN DEMOBAR (Works independently of persona!) */}
        <div className="relative">
          <div className="hidden sm:flex items-center bg-black/20 p-0.5 rounded-xl">
            {LANGUAGE_OPTIONS.map(opt => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  onClick={() => setLanguage(opt.code)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={opt.label}
                >
                  {opt.short}
                </button>
              );
            })}
          </div>

          {/* Compact Mobile Language Dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setMenuOpen(false); }}
              className="flex items-center gap-1 bg-amber-400 text-stone-950 px-2 py-1 rounded-lg font-black text-[11px]"
              title="Change Language"
            >
              <Globe size={11} />
              <span className="uppercase">{language}</span>
              <ChevronDown size={10} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 py-1 w-44 z-50">
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      language === opt.code ? 'bg-teal-50 text-teal-800 font-bold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {language === opt.code && <Check size={12} className="text-teal-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-[11px] font-bold transition-all"
          title={t('resetDemoData', language)}
        >
          <RefreshCw size={11} />
          <span className="hidden md:inline">{t('resetDemoData', language)}</span>
        </button>

        {/* 4. Exit Demo Button (Returns to Welcome Page) */}
        <button
          onClick={exitDemoMode}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-600/90 hover:bg-red-600 active:scale-95 rounded-lg text-[11px] font-bold transition-all shadow-xs"
          title={t('exitDemo', language)}
        >
          <LogOut size={11} />
          <span>{t('exitDemo', language)}</span>
        </button>
      </div>
    </aside>
  );
}
