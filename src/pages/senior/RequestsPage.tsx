import { useState, useEffect } from 'react';
import {
  PhoneCall, PlusCircle, AlertCircle, Clock, CheckCircle2, Check,
  X, ShieldAlert, Phone
} from 'lucide-react';
import { supabase, isSupabaseConfigured, type HelpRequest } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { demoStore } from '@/lib/demo-store';
import { t, formatTimeAgo } from '@/lib/translations';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export function RequestsPage() {
  const { profile, language, isDemo } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [requestType, setRequestType] = useState<'call_request' | 'general_assistance'>('call_request');
  const [customNote, setCustomNote] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadRequests();
    if (isDemo) {
      const unsub = demoStore.subscribe(() => {
        loadRequests();
      });
      return unsub;
    }
  }, [profile, isDemo]);

  async function loadRequests() {
    if (!profile) return;
    setLoading(true);

    if (isDemo) {
      const list = demoStore.getHelpRequests(profile.id);
      setRequests(list);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('help_requests')
        .select('*')
        .eq('senior_id', profile.id)
        .order('created_at', { ascending: false });
      setRequests(data || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  function openConfirm(type: 'call_request' | 'general_assistance') {
    setRequestType(type);
    setCustomNote('');
    setShowConfirm(true);
  }

  async function createRequest() {
    if (!profile || creating) return;
    setCreating(true);

    const summaryText = customNote.trim()
      ? customNote.trim()
      : requestType === 'call_request'
      ? (language === 'kn' ? 'ಕರೆಯ ವಿನಂತಿ' : language === 'hi' ? 'फ़ोन कॉल का अनुरोध' : language === 'ml' ? 'കോൾ അഭ്യർത്ഥന' : 'Check-in call request')
      : (language === 'kn' ? 'ಸಾಮಾನ್ಯ ಸಹಾಯದ ವಿನಂತಿ' : language === 'hi' ? 'सामान्य सहायता अनुरोध' : language === 'ml' ? 'സഹായ അഭ്യർത്ഥന' : 'General care assistance request');

    try {
      if (isDemo) {
        demoStore.addHelpRequest({
          senior_id: profile.id,
          request_type: requestType,
          summary: summaryText,
          status: 'pending',
          assigned_caregiver_id: null,
        });
        showToast(t('requestCreated', language), 'success');
        setShowConfirm(false);
        loadRequests();
        return;
      }

      if (!isSupabaseConfigured) return;

      const { error } = await supabase.from('help_requests').insert({
        senior_id: profile.id,
        request_type: requestType,
        summary: summaryText,
        status: 'pending',
      });
      if (error) throw error;

      showToast(t('requestCreated', language), 'success');
      setShowConfirm(false);
      loadRequests();
    } catch {
      showToast(t('error', language), 'error');
    } finally {
      setCreating(false);
    }
  }

  async function cancelRequest(id: string) {
    if (!profile) return;

    if (isDemo) {
      demoStore.deleteHelpRequest(id, profile.id);
      showToast(t('cancelRequest', language) + ' ✓', 'success');
      loadRequests();
      return;
    }

    if (!isSupabaseConfigured) return;

    try {
      await supabase
        .from('help_requests')
        .delete()
        .eq('id', id)
        .eq('senior_id', profile.id);
      showToast(t('cancelRequest', language) + ' ✓', 'success');
      loadRequests();
    } catch {
      showToast(t('error', language), 'error');
    }
  }

  const statusConfig = {
    pending: {
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock,
      label: t('pending', language),
    },
    acknowledged: {
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle2,
      label: t('acknowledged', language),
    },
    handled: {
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Check,
      label: t('handled', language),
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/70 px-4 pt-8 pb-4 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            {t('helpRequests', language)}
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Prominent Emergency Disclaimer with 112 / Helpline */}
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-900">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-950">{t('notAnEmergencyService', language)}</p>
            <p className="text-xs text-red-800 leading-relaxed">{t('emergencyDisclaimer', language)}</p>
            <div className="flex flex-wrap gap-2 pt-1.5 font-bold text-xs text-red-900">
              <a
                href="tel:112"
                className="bg-red-200/80 hover:bg-red-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Phone size={11} /> {t('nationalEmergency', language)}
              </a>
              <a
                href="tel:14567"
                className="bg-red-200/80 hover:bg-red-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Phone size={11} /> {t('seniorHelpline', language)}
              </a>
            </div>
          </div>
        </div>

        {/* Big Request Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Request a Call */}
          <button
            onClick={() => openConfirm('call_request')}
            className="bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 active:scale-[0.98] rounded-2xl p-4.5 text-left transition-all shadow-2xs"
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-2.5">
              <PhoneCall size={24} />
            </div>
            <p className="font-extrabold text-stone-900 text-base leading-snug">
              {t('requestACall', language)}
            </p>
            <p className="text-xs text-stone-500 mt-1">Friendly phone check-in</p>
          </button>

          {/* 2. Ask for Assistance */}
          <button
            onClick={() => openConfirm('general_assistance')}
            className="bg-white border-2 border-teal-300 hover:border-teal-500 hover:bg-teal-50/50 active:scale-[0.98] rounded-2xl p-4.5 text-left transition-all shadow-2xs"
          >
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-2.5">
              <PlusCircle size={24} />
            </div>
            <p className="font-extrabold text-stone-900 text-base leading-snug">
              {t('askForAssistance', language)}
            </p>
            <p className="text-xs text-stone-500 mt-1">Everyday support</p>
          </button>
        </div>

        {/* Request History Section */}
        <div className="pt-2">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
            {t('helpRequests', language)} ({requests.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-stone-400 text-sm">{t('loading', language)}</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-6 text-stone-400">
              <CheckCircle2 size={40} className="mx-auto mb-2 opacity-30 text-teal-600" />
              <p className="font-medium text-stone-600 text-sm">{t('noRequestsYet', language)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(req => {
                const cfg = statusConfig[req.status];
                const Icon = cfg.icon;

                return (
                  <div key={req.id} className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-stone-900 text-base capitalize">
                          {req.request_type.replace(/_/g, ' ')}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {t('requestedAt', language)}: {formatTimeAgo(req.created_at, language)}
                        </p>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
                        <Icon size={13} />
                        {cfg.label}
                      </span>
                    </div>

                    {req.summary && (
                      <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700 font-medium">
                        "{req.summary}"
                      </div>
                    )}

                    {/* Status Transitions Detail */}
                    <div className="space-y-0.5 pt-1 text-[11px] text-stone-500">
                      {req.acknowledged_at && (
                        <p className="text-blue-700 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} /> Acknowledged by caregiver {formatTimeAgo(req.acknowledged_at, language)}
                        </p>
                      )}
                      {req.handled_at && (
                        <p className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check size={12} strokeWidth={2.5} /> Marked handled {formatTimeAgo(req.handled_at, language)}
                        </p>
                      )}
                    </div>

                    {/* Option to cancel pending request */}
                    {req.status === 'pending' && (
                      <div className="pt-2 border-t border-stone-100 flex justify-end">
                        <button
                          onClick={() => cancelRequest(req.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                          {t('cancelRequest', language)}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Modal title={t('confirmHelpRequest', language)} onClose={() => setShowConfirm(false)}>
          <div className="space-y-4 py-1">
            <p className="text-sm text-stone-700 leading-relaxed">
              {t('confirmHelpBody', language)}
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {t('notes', language)}
              </label>
              <textarea
                value={customNote}
                onChange={e => setCustomNote(e.target.value)}
                placeholder="Optional details for your caregiver..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-300 focus:outline-none text-stone-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
              >
                {t('cancel', language)}
              </button>
              <button
                type="button"
                onClick={createRequest}
                disabled={creating}
                className="py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors"
              >
                {t('confirm', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
