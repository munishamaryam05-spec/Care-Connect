import { Language } from '@/lib/supabase';
import { t } from '@/lib/translations';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export function LanguageSelector({ current, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            current === lang.code
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
}

export function LanguageDropdown({ current, onChange }: Props) {
  return (
    <select
      value={current}
      onChange={e => onChange(e.target.value as Language)}
      className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.native}
        </option>
      ))}
    </select>
  );
}
