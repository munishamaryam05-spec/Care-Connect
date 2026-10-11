import { useState, useEffect } from 'react';
import {
  Users, Bell, CheckCircle2, Clock, Check, ChevronRight, LogOut,
  Settings, Heart, AlertCircle, Activity, Shield, PhoneCall,
  Calendar, Pill, Filter, ShieldCheck, UserMinus, Phone
} from 'lucide-react';
import { supabase, isSupabaseConfigured, type HelpRequest, type CheckIn, type Profile, type HealthReading, type Reminder } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { demoStore, type DemoUser } from '@/lib/demo-store';
import { t, formatTimeAgo } from '@/lib/translations';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { LanguageDropdown } from '@/components/LanguageSelector';

interface SeniorSummary {
  profile: Profile;
  latestCheckin: CheckIn | null;
  pendingRequests: HelpRequest[];
  healthReadings: HealthReading[];
  reminders: Reminder[];
  permissions: {
    share_health_readings: boolean;
    share_checkins: boolean;
  };
}

type CaregiverTab = 'overview' | 'requests' | 'settings';

export function CaregiverApp() {
  const { profile, language, setLanguage, isDemo, signOut } = useAuth();
  const [tab, setTab] = useState<CaregiverTab>('overview');
  const [seniors, setSeniors] = useState<SeniorSummary[]>([]);
  const [allRequests, setAllRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'acknowledged' | 'handled'>('all');
  const [updating, setUpdating] = useState(false);
  const [selectedSeniorDetail, setSelectedSeniorDetail] = useState<SeniorSummary | null>(null);

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
    setLoading(true);

    if (isDemo) {
      const links = demoStore.getCaregiverLinks(profile.id).filter(l => l.status === 'accepted');
      const seniorIds = links.map(l => l.senior_id);
      const profiles = demoStore.getProfiles(seniorIds);
      const checkins = demoStore.getCheckInsForSeniors(seniorIds);
      const requests = demoStore.getHelpRequestsForSeniors(seniorIds);
      const readings = demoStore.getHealthReadingsForSeniors(seniorIds);

      const summaries: SeniorSummary[] = profiles.map(p => {
        const link = links.find(l => l.senior_id === p.id);
        const pCheckins = checkins.filter(c => c.senior_id === p.id);
        const pRequests = requests.filter(r => r.senior_id === p.id && r.status === 'pending');
        const pReadings = link?.share_health_readings
          ? readings.filter(r => r.senior_id === p.id)
          : [];
        const pReminders = demoStore.getReminders(p.id);

        return {
          profile: p,
          latestCheckin: pCheckins[0] || null,
          pendingRequests: pRequests,
          healthReadings: pReadings,
          reminders: pReminders,
          permissions: {
            share_health_readings: link?.share_health_readings ?? false,
            share_checkins: link?.share_checkins ?? true,
          },
        };
      });

      setSeniors(summaries);
      setAllRequests(requests);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data: links } = await supabase
        .from('caregiver_links')
        .select('*')
        .eq('caregiver_id', profile.id)
        .eq('status', 'accepted');

      if (!links || links.length === 0) {
        setSeniors([]);
        setAllRequests([]);
        setLoading(false);
        return;
      }

      const seniorIds = links.map((l: any) => l.senior_id);

      const [{ data: profiles }, { data: checkins }, { data: requests }, { data: readings }] = await Promise.all([
        supabase.from('profiles').select('*').in('id', seniorIds),
        supabase.from('check_ins').select('*').in('senior_id', seniorIds).order('created_at', { ascending: false }),
        supabase.from('help_requests').select('*').in('senior_id', seniorIds).order('created_at', { ascending: false }),
        supabase.from('health_readings').select('*').in('senior_id', seniorIds).order('recorded_at', { ascending: false }),
      ]);

      const summaries: SeniorSummary[] = (profiles || []).map((p: Profile) => {
        const link = links.find((l: any) => l.senior_id === p.id);
        return {
          profile: p,
          latestCheckin: (checkins || []).find((c: CheckIn) => c.senior_id === p.id) || null,
          pendingRequests: (requests || []).filter((r: HelpRequest) => r.senior_id === p.id && r.status === 'pending'),
          healthReadings: link?.share_health_readings
            ? (readings || []).filter((r: HealthReading) => r.senior_id === p.id)
            : [],
          reminders: [],
          permissions: {
            share_health_readings: link?.share_health_readings ?? false,
            share_checkins: link?.share_checkins ?? true,
          },
        };
      });

      setSeniors(summaries);
      setAllRequests(requests || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  async function updateRequestStatus(id: string, newStatus: 'acknowledged' | 'handled') {
    if (updating) return;
    setUpdating(true);

    const updates: Partial<HelpRequest> = {
      status: newStatus,
      assigned_caregiver_id: profile?.id || null,
    };
    if (newStatus === 'acknowledged') updates.acknowledged_at = new Date().toISOString();
    if (newStatus === 'handled') updates.handled_at = new Date().toISOString();

    try {
      if (isDemo) {
        demoStore.updateHelpRequest(id, updates);
        showToast(t('success', language), 'success');
        setSelectedRequest(null);
        loadData();
        return;
      }

      if (!isSupabaseConfigured) return;

      const { error } = await supabase.from('help_requests').update(updates).eq('id', id);
      if (error) throw error;

      showToast(t('success', language), 'success');
      setSelectedRequest(null);
      loadData();
    } catch {
      showToast(t('error', language), 'error');
    } finally {
      setUpdating(false);
    }
  }

  async function togglePermission(seniorId: string, field: 'share_health_readings' | 'share_checkins', currentVal: boolean) {
    if (isDemo) {
      const links = demoStore.getCaregiverLinks(profile?.id || '');
      const link = links.find(l => l.senior_id === seniorId);
      if (link) {
        demoStore.updateLink(link.id, { [field]: !currentVal });
        showToast(t('success', language), 'success');
        loadData();
      }
      return;
    }

    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('caregiver_links')
        .update({ [field]: !currentVal })
        .eq('caregiver_id', profile?.id)
        .eq('senior_id', seniorId);
      if (error) throw error;
      showToast(t('success', language), 'success');
      loadData();
    } catch {
      showToast(t('error', language), 'error');
    }
  }

  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-800 border-amber-300', label: t('pending', language), Icon: Clock },
    acknowledged: { color: 'bg-blue-100 text-blue-800 border-blue-300', label: t('acknowledged', language), Icon: CheckCircle2 },
    handled: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: t('handled', language), Icon: Check },
  };

  const checkinColor: Record<string, string> = {
    okay: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    wants_call: 'text-amber-700 bg-amber-50 border-amber-300',
    needs_help: 'text-red-700 bg-red-50 border-red-300',
  };

  const checkinLabel: Record<string, string> = {
    okay: t('checkInStatusOkay', language),
    wants_call: t('checkInStatusWantsCall', language),
    needs_help: t('checkInStatusNeedsHelp', language),
  };

  const pendingCount = allRequests.filter(r => r.status === 'pending').length;

  const filteredRequests = allRequests.filter(r => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-24">
      {/* Caregiver Top Header */}
      <div className="bg-white border-b border-stone-200/80 px-5 pt-8 pb-4 shadow-2xs">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-xs">
                  <Heart size={16} className="text-white" fill="white" />
                </div>
                <span className="font-extrabold text-stone-900 tracking-tight text-base">CareConnect</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('caregiverDashboard', language)}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                {profile?.display_name} · {seniors.length} {t('linkedSeniors', language).toLowerCase()}
              </p>
            </div>

            {/* Pending Requests Alert Badge */}
            {pendingCount > 0 && (
              <button
                onClick={() => setTab('requests')}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full font-bold text-xs transition-colors"
              >
                <AlertCircle size={15} />
                <span>{pendingCount} {t('pendingRequests', language)}</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1.5 mt-5 bg-stone-100 rounded-2xl p-1">
            {[
              { id: 'overview' as CaregiverTab, label: t('linkedSeniors', language), icon: Users },
              { id: 'requests' as CaregiverTab, label: `${t('allRequests', language)} (${allRequests.length})`, icon: Bell },
              { id: 'settings' as CaregiverTab, label: t('settings', language), icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  tab === id ? 'bg-white text-teal-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">{t('loading', language)}</div>
        ) : tab === 'overview' ? (
          /* TAB 1: SENIORS OVERVIEW */
          seniors.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8 max-w-md mx-auto">
              <Users size={48} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-700 text-lg font-bold">{t('noLinkedSeniors', language)}</p>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">{t('noLinkedSeniorsSub', language)}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Missed Check-in Transparent Note */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <Clock size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{t('missedCheckinNote', language)}</p>
              </div>

              {seniors.map(s => {
                const name = s.profile.display_name.replace('[DEMO] ', '');
                return (
                  <div key={s.profile.id} className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center font-black text-lg">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-lg font-bold text-stone-900">{name}</h2>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 rounded-full text-stone-600 uppercase">
                                {s.profile.preferred_language}
                              </span>
                            </div>
                            {/* Check-in status badge */}
                            <div className="mt-1">
                              {s.latestCheckin ? (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${checkinColor[s.latestCheckin.response]}`}>
                                  <CheckCircle2 size={13} />
                                  {checkinLabel[s.latestCheckin.response]} · {formatTimeAgo(s.latestCheckin.created_at, language)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-200 bg-stone-50 text-stone-500 text-xs font-semibold">
                                  <Clock size={13} />
                                  {t('noCheckinYet', language)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pending requests pill */}
                        {s.pendingRequests.length > 0 && (
                          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                            <AlertCircle size={13} />
                            {s.pendingRequests.length} {t('pending', language).toLowerCase()}
                          </span>
                        )}
                      </div>

                      {/* Pending requests alert box */}
                      {s.pendingRequests.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {s.pendingRequests.map(req => (
                            <div key={req.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-amber-900 capitalize">
                                  {req.request_type.replace(/_/g, ' ')}
                                </p>
                                <p className="text-[11px] text-amber-700 mt-0.5">
                                  {req.summary || 'Assistance requested'} · {formatTimeAgo(req.created_at, language)}
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="text-xs bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shadow-2xs"
                              >
                                {t('viewDetails', language)}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Shared health readings preview */}
                      {s.permissions.share_health_readings && s.healthReadings.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-stone-100">
                          <p className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                            <Activity size={13} className="text-teal-600" />
                            {t('healthReadings', language)} (Shared)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {s.healthReadings.slice(0, 3).map(r => (
                              <span key={r.id} className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-medium">
                                <span className="font-bold text-stone-900">{r.value}</span> {r.unit} · <span className="capitalize">{r.reading_type.replace(/_/g, ' ')}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action to view full senior detail drawer */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-400">
                          Permissions: {s.permissions.share_health_readings ? 'Readings Shared' : 'Readings Private'}
                        </span>
                        <button
                          onClick={() => setSelectedSeniorDetail(s)}
                          className="text-xs text-teal-700 font-bold hover:text-teal-900 flex items-center gap-1"
                        >
                          <span>{t('viewDetails', language)} & Permissions</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : tab === 'requests' ? (
          /* TAB 2: ALL REQUESTS QUEUE */
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(['all', 'pending', 'acknowledged', 'handled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRequestFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    requestFilter === f
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {f === 'all' ? t('allRequests', language) : t(f as any, language)}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8">
                <Bell size={40} className="mx-auto mb-2 opacity-30 text-stone-400" />
                <p className="text-stone-500 text-sm font-semibold">{t('noRequestsYet', language)}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map(req => {
                  const cfg = statusConfig[req.status];
                  const Icon = cfg.Icon;
                  const senior = seniors.find(s => s.profile.id === req.senior_id);

                  return (
                    <div key={req.id} className="bg-white border border-stone-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-stone-900 text-base">
                              {senior?.profile.display_name?.replace('[DEMO] ', '') || 'Older Adult'}
                            </span>
                            <span className="text-xs text-stone-500 font-medium capitalize">
                              ({req.request_type.replace(/_/g, ' ')})
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {formatTimeAgo(req.created_at, language)} · {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
                          <Icon size={13} />
                          {cfg.label}
                        </span>
                      </div>

                      {req.summary && (
                        <p className="bg-stone-50 rounded-xl p-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                          "{req.summary}"
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                        >
                          {t('viewDetails', language)}
                        </button>

                        {req.status === 'pending' && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'acknowledged')}
                            disabled={updating}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                          >
                            {t('acknowledgeRequest', language)}
                          </button>
                        )}

                        {req.status === 'acknowledged' && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'handled')}
                            disabled={updating}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                          >
                            {t('markHandled', language)}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* TAB 3: SETTINGS & PRIVACY */
          <div className="space-y-5 max-w-md mx-auto">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  {t('language', language)}
                </label>
                <LanguageDropdown current={language} onChange={setLanguage} />
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <ShieldCheck size={18} />
                  <h3>{t('privacyTitle', language)}</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t('privacyBody', language)}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t('consentBody', language)}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>{t('signOut', language)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal title={t('requestDetails', language)} onClose={() => setSelectedRequest(null)}>
          <div className="space-y-4 py-1">
            <div className="bg-stone-50 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">{t('requestFrom', language)}</span>
                <span className="font-bold text-stone-900">
                  {seniors.find(s => s.profile.id === selectedRequest.senior_id)?.profile.display_name?.replace('[DEMO] ', '') || 'Older Adult'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">{t('requestTypeLabel', language)}</span>
                <span className="font-bold text-stone-900 capitalize">
                  {selectedRequest.request_type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">{t('requestStatusLabel', language)}</span>
                <span className={`font-bold capitalize ${
                  selectedRequest.status === 'pending' ? 'text-amber-700' : selectedRequest.status === 'acknowledged' ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">{t('requestedAt', language)}</span>
                <span className="font-bold text-stone-900">
                  {formatTimeAgo(selectedRequest.created_at, language)} ({new Date(selectedRequest.created_at).toLocaleTimeString()})
                </span>
              </div>
              {selectedRequest.summary && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500 font-medium block mb-1">{t('requestSummaryLabel', language)}</span>
                  <p className="text-stone-900 font-semibold">{selectedRequest.summary}</p>
                </div>
              )}
            </div>

            {/* Actions in Modal */}
            <div className="space-y-2 pt-1">
              {selectedRequest.status === 'pending' && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, 'acknowledged')}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-xs transition-colors"
                >
                  {t('acknowledgeRequest', language)}
                </button>
              )}
              {(selectedRequest.status === 'pending' || selectedRequest.status === 'acknowledged') && (
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, 'handled')}
                  disabled={updating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-xs transition-colors"
                >
                  {t('markHandled', language)}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Senior Detail & Permissions Modal */}
      {selectedSeniorDetail && (
        <Modal
          title={selectedSeniorDetail.profile.display_name.replace('[DEMO] ', '')}
          onClose={() => setSelectedSeniorDetail(null)}
        >
          <div className="space-y-4 py-1 text-xs sm:text-sm">
            <div className="bg-stone-50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Preferred Language</span>
                <span className="font-bold text-stone-900 uppercase">{selectedSeniorDetail.profile.preferred_language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Latest Check-in</span>
                <span className="font-bold text-stone-900">
                  {selectedSeniorDetail.latestCheckin
                    ? `${checkinLabel[selectedSeniorDetail.latestCheckin.response]} (${formatTimeAgo(selectedSeniorDetail.latestCheckin.created_at, language)})`
                    : 'None today'}
                </span>
              </div>
            </div>

            {/* Granular Permission Toggles */}
            <div className="space-y-3 pt-1">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">{t('consentTitle', language)}</h4>
              
              <div className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                <div>
                  <p className="font-bold text-stone-900">{t('shareHealthReadings', language)}</p>
                  <p className="text-[11px] text-stone-500">Allow caregiver to monitor blood pressure & glucose readings</p>
                </div>
                <button
                  onClick={() => togglePermission(selectedSeniorDetail.profile.id, 'share_health_readings', selectedSeniorDetail.permissions.share_health_readings)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedSeniorDetail.permissions.share_health_readings
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {selectedSeniorDetail.permissions.share_health_readings ? 'Granted' : 'Private'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-stone-200 rounded-xl">
                <div>
                  <p className="font-bold text-stone-900">{t('shareCheckins', language)}</p>
                  <p className="text-[11px] text-stone-500">Allow caregiver to view wellbeing check-ins</p>
                </div>
                <button
                  onClick={() => togglePermission(selectedSeniorDetail.profile.id, 'share_checkins', selectedSeniorDetail.permissions.share_checkins)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedSeniorDetail.permissions.share_checkins
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {selectedSeniorDetail.permissions.share_checkins ? 'Granted' : 'Private'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
