import { useState, useEffect } from 'react';
import {
  CheckCircle, PhoneCall, AlertCircle, ChevronRight, Clock,
  Pill, Calendar, LogOut, Settings, Phone, UserCheck, Shield, HeartHandshake
} from 'lucide-react';
import { supabase, isSupabaseConfigured, type CheckIn, type Reminder, type Profile } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { demoStore, DEMO_CAREGIVER_1, DEMO_CAREGIVER_2 } from '@/lib/demo-store';
import { t, getGreeting, formatTimeAgo } from '@/lib/translations';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { LanguageDropdown } from '@/components/LanguageSelector';

interface Props {
  onRequestHelp: () => void;
}

export function HomePage({ onRequestHelp }: Props) {
  const { profile, language, setLanguage, isDemo, signOut } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lastCheckin, setLastCheckin] = useState<CheckIn | null>(null);
  const [caregiver, setCaregiver] = useState<{ name: string; phone: string } | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    loadData();
    if (isDemo) {
      const unsub = demoStore.subscribe(() => {
        loadData();
      });
      return unsub;
    }
  }, [profile, isDemo]);

  async function loadData() {
    if (!profile) return;

    if (isDemo) {
      const rems = demoStore.getReminders(profile.id);
      const checkins = demoStore.getCheckIns(profile.id);
      setReminders(rems);
      setLastCheckin(checkins[0] || null);

      // Caregiver details for senior
      const links = demoStore.getSeniorCaregiverLinks(profile.id);
      if (links.length > 0) {
        const cgUser = [DEMO_CAREGIVER_1, DEMO_CAREGIVER_2].find(c => c.id === links[0].caregiver_id);
        if (cgUser) {
          setCaregiver({ name: cgUser.display_name.replace('[DEMO] ', ''), phone: cgUser.phone });
        }
      }
      return;
    }

    if (!isSupabaseConfigured) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [{ data: remData }, { data: checkinData }, { data: linksData }] = await Promise.all([
        supabase
          .from('reminders')
          .select('*')
          .eq('senior_id', profile.id)
          .eq('active', true)
          .order('scheduled_time'),
        supabase
          .from('check_ins')
          .select('*')
          .eq('senior_id', profile.id)
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('caregiver_links')
          .select('caregiver_id')
          .eq('senior_id', profile.id)
          .eq('status', 'accepted')
          .limit(1),
      ]);

      setReminders(remData || []);
      setLastCheckin(checkinData?.[0] || null);

      if (linksData && linksData.length > 0) {
        const { data: cgProfile } = await supabase
          .from('profiles')
          .select('display_name, phone')
          .eq('id', linksData[0].caregiver_id)
          .maybeSingle();
        if (cgProfile) {
          setCaregiver({
            name: cgProfile.display_name,
            phone: (cgProfile as any).phone || '+91 98765 43210',
          });
        }
      }
    } catch {
      // error handling
    }
  }

  async function doCheckIn(response: CheckIn['response']) {
    if (!profile || checkingIn) return;
    setCheckingIn(true);

    try {
      if (isDemo) {
        demoStore.addCheckIn({
          senior_id: profile.id,
          response,
          note: null,
        });

        if (response === 'needs_help') {
          demoStore.addHelpRequest({
            senior_id: profile.id,
            request_type: 'check_in_help',
            summary: '[Check-in] Senior selected "I Need Help"',
            status: 'pending',
            assigned_caregiver_id: null,
          });
        }

        showToast(t('checkinSaved', language), 'success');
        await loadData();
        if (response === 'needs_help') onRequestHelp();
        return;
      }

      if (!isSupabaseConfigured) return;

      const { error } = await supabase.from('check_ins').insert({
        senior_id: profile.id,
        response,
      });
      if (error) throw error;

      if (response === 'needs_help') {
        await supabase.from('help_requests').insert({
          senior_id: profile.id,
          request_type: 'check_in_help',
          summary: 'Senior triggered help from daily check-in',
          status: 'pending',
        });
      }

      showToast(t('checkinSaved', language), 'success');
      await loadData();
      if (response === 'needs_help') onRequestHelp();
    } catch {
      showToast(t('error', language), 'error');
    } finally {
      setCheckingIn(false);
    }
  }

  const greeting = getGreeting(language);
  const name = profile?.display_name?.replace('[DEMO] ', '').split(' ')[0] || '';
  const todayReminders = reminders.filter(r => r.active).slice(0, 3);

  const checkInStatusColor = {
    okay: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    wants_call: 'bg-amber-100 text-amber-800 border-amber-300',
    needs_help: 'bg-red-100 text-red-800 border-red-300',
  };

  const checkInStatusText = {
    okay: t('checkInStatusOkay', language),
    wants_call: t('checkInStatusWantsCall', language),
    needs_help: t('checkInStatusNeedsHelp', language),
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-28">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/70 px-5 pt-8 pb-5 shadow-xs">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-700 font-semibold text-base sm:text-lg">{greeting},</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {name} 👋
              </h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 bg-stone-100 hover:bg-stone-200 rounded-2xl flex items-center justify-center text-stone-700 transition-colors"
              aria-label={t('settings', language)}
            >
              <Settings size={22} />
            </button>
          </div>

          {/* Today's check-in status pill */}
          <div className="mt-3.5">
            {lastCheckin ? (
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold ${checkInStatusColor[lastCheckin.response]}`}>
                <CheckCircle size={15} />
                <span>{checkInStatusText[lastCheckin.response]} · {formatTimeAgo(lastCheckin.created_at, language)}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-stone-600 text-xs sm:text-sm font-medium">
                <Clock size={15} className="text-stone-400" />
                <span>{t('noCheckinYet', language)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* BIG 3 ACTIONS (Prominent, High Contrast, Large Touch Targets) */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-stone-800 mb-2.5">
            {t('howAreYouToday', language)}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {/* 1. I'm Okay */}
            <button
              onClick={() => doCheckIn('okay')}
              disabled={checkingIn}
              className="flex items-center gap-4 bg-white border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50 active:scale-[0.99] rounded-2xl p-4.5 text-left transition-all shadow-sm min-h-[76px]"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckCircle size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {t('iAmOkay', language)}
                </div>
                <div className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-snug">
                  {t('letCaregiverKnowFine', language)}
                </div>
              </div>
            </button>

            {/* 2. I Want to Talk */}
            <button
              onClick={() => doCheckIn('wants_call')}
              disabled={checkingIn}
              className="flex items-center gap-4 bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 active:scale-[0.99] rounded-2xl p-4.5 text-left transition-all shadow-sm min-h-[76px]"
            >
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
                <PhoneCall size={30} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {t('iWantToTalk', language)}
                </div>
                <div className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-snug">
                  {t('requestCallFromCaregiver', language)}
                </div>
              </div>
            </button>

            {/* 3. I Need Help */}
            <button
              onClick={() => doCheckIn('needs_help')}
              disabled={checkingIn}
              className="flex items-center gap-4 bg-white border-2 border-red-300 hover:border-red-500 hover:bg-red-50/50 active:scale-[0.99] rounded-2xl p-4.5 text-left transition-all shadow-sm min-h-[76px]"
            >
              <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
                <AlertCircle size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {t('iNeedHelp', language)}
                </div>
                <div className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-snug">
                  {t('sendHelpRequestToCaregiver', language)}
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Contact Trusted Person Card */}
        <section className="bg-gradient-to-br from-teal-50 to-emerald-50/80 border border-teal-200/80 rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {t('contactTrustedPerson', language)}
                </h3>
                <p className="text-xs text-teal-800 font-medium">
                  {caregiver ? caregiver.name : 'Linked Caregiver'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
            >
              <Phone size={14} />
              <span>{t('contactCaregiverDirectly', language)}</span>
            </button>
          </div>
        </section>

        {/* Emergency Disclaimer Banner */}
        <section className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle size={17} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">{t('notAnEmergencyService', language)}</p>
            <p className="leading-relaxed opacity-90">{t('emergencyDisclaimer', language)}</p>
            <div className="flex flex-wrap gap-2 pt-1 font-bold text-[11px] text-amber-900">
              <span className="bg-amber-200/70 px-2 py-0.5 rounded-md">{t('nationalEmergency', language)}</span>
              <span className="bg-amber-200/70 px-2 py-0.5 rounded-md">{t('seniorHelpline', language)}</span>
            </div>
          </div>
        </section>

        {/* Today's Reminders Preview */}
        {todayReminders.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-base sm:text-lg font-bold text-stone-800">
                {t('todayReminders', language)}
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
              {todayReminders.map(r => (
                <div key={r.id} className="flex items-center gap-3.5 p-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    r.reminder_type === 'medicine' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {r.reminder_type === 'medicine' ? <Pill size={20} /> : <Calendar size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate text-sm sm:text-base">{r.title}</p>
                    <p className="text-xs text-stone-500 font-medium">{r.scheduled_time} · {r.recurrence || 'Daily'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Contact Caregiver Modal */}
      {showContactModal && (
        <Modal title={t('contactTrustedPerson', language)} onClose={() => setShowContactModal(false)}>
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-3xl flex items-center justify-center mx-auto">
              <Phone size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">{caregiver?.name || 'Your Trusted Caregiver'}</h3>
              <p className="text-stone-500 text-sm mt-0.5">{caregiver?.phone || '+91 98765 43210'}</p>
            </div>
            <div className="pt-2 space-y-2">
              <a
                href={`tel:${caregiver?.phone || '9876543210'}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-base shadow-sm transition-all"
              >
                <Phone size={18} />
                <span>{t('openDialer', language)}</span>
              </a>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  doCheckIn('wants_call');
                }}
                className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-semibold text-sm transition-colors"
              >
                {t('requestCallFromCaregiver', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Modal title={t('settings', language)} onClose={() => setShowSettings(false)}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                {t('language', language)}
              </label>
              <LanguageDropdown current={language} onChange={setLanguage} />
            </div>

            <div className="pt-3 border-t border-stone-200/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <Shield size={16} />
                <span>{t('privacyTitle', language)}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t('privacyBody', language)}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  signOut();
                  setShowSettings(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors text-sm"
              >
                <LogOut size={16} />
                <span>{t('signOut', language)}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
