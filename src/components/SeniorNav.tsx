import { Home, MessageCircle, Heart, Bell } from 'lucide-react';
import { t } from '@/lib/translations';
import type { Language } from '@/lib/supabase';

type Tab = 'home' | 'chat' | 'health' | 'requests';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  lang: Language;
}

const tabs: { id: Tab; icon: typeof Home; labelKey: 'home' | 'chat' | 'health' | 'requests' }[] = [
  { id: 'home', icon: Home, labelKey: 'home' },
  { id: 'chat', icon: MessageCircle, labelKey: 'chat' },
  { id: 'health', icon: Heart, labelKey: 'health' },
  { id: 'requests', icon: Bell, labelKey: 'requests' },
];

export function SeniorNav({ active, onChange, lang }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200/80 shadow-lg safe-area-bottom z-40">
      <div className="max-w-md mx-auto flex">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 min-h-[58px] transition-all relative ${
                isActive ? 'text-teal-700 font-bold' : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-teal-50' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[11px] sm:text-xs mt-0.5 leading-none">{t(tab.labelKey, lang)}</span>
              {isActive && (
                <span className="absolute bottom-1 w-8 h-1 bg-teal-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
