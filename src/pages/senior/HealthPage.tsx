import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit2, Activity, Pill, Calendar, Info, Clock,
  CheckCircle2, Heart, AlertCircle, X, ShieldAlert
} from 'lucide-react';
import { supabase, isSupabaseConfigured, type HealthReading, type Reminder } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { demoStore } from '@/lib/demo-store';
import { t, formatTimeAgo } from '@/lib/translations';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

type TabView = 'readings' | 'reminders';

const READING_TYPES = ['blood_pressure', 'blood_glucose', 'weight', 'temperature', 'other'] as const;
const REMINDER_TYPES = ['medicine', 'appointment', 'checkin', 'other'] as const;

export function HealthPage() {
  const { profile, language, isDemo } = useAuth();
  const [view, setView] = useState<TabView>('readings');
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddReading, setShowAddReading] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingReading, setEditingReading] = useState<HealthReading | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{ id: string; type: 'reading' | 'reminder' } | null>(null);

  // Reading form state
  const [rType, setRType] = useState<typeof READING_TYPES[number]>('blood_pressure');
  const [rValue, setRValue] = useState('');
  const [rUnit, setRUnit] = useState('mmHg');
  const [rNotes, setRNotes] = useState('');
  const [rDate, setRDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [rError, setRError] = useState('');
  const [saving, setSaving] = useState(false);

  // Reminder form state
  const [remTitle, setRemTitle] = useState('');
  const [remType, setRemType] = useState<typeof REMINDER_TYPES[number]>('medicine');
  const [remTime, setRemTime] = useState('08:30');
  const [remRecurrence, setRemRecurrence] = useState('daily');
  const [remError, setRemError] = useState('');

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
      const r = demoStore.getHealthReadings(profile.id);
      const rem = demoStore.getReminders(profile.id);
      setReadings(r);
      setReminders(rem);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const [{ data: rData }, { data: remData }] = await Promise.all([
        supabase
          .from('health_readings')
          .select('*')
          .eq('senior_id', profile.id)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('reminders')
          .select('*')
          .eq('senior_id', profile.id)
          .order('scheduled_time'),
      ]);
      setReadings(rData || []);
      setReminders(remData || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  // Update default units when type changes
  function handleTypeChange(type: typeof READING_TYPES[number]) {
    setRType(type);
    if (type === 'blood_pressure') setRUnit('mmHg');
    else if (type === 'blood_glucose') setRUnit('mg/dL');
    else if (type === 'weight') setRUnit('kg');
    else if (type === 'temperature') setRUnit('°C');
    else setRUnit('');
  }

  // Validate health reading
  function validateReading(): boolean {
    setRError('');
    if (!rValue.trim()) {
      setRError(t('requiredField', language));
      return false;
    }

    if (rType === 'blood_pressure') {
      const bpPattern = /^(\d{2,3})\/(\d{2,3})$/;
      const match = rValue.trim().match(bpPattern);
      if (!match) {
        setRError(language === 'kn' ? 'ಮಾದರಿ: 120/80 (ಸಿಸ್ಟೋಲಿಕ್/ಡಯಾಸ್ಟೋಲಿಕ್)' : language === 'hi' ? 'प्रारूप: 120/80 (सिस्टोलिक/डायस्टोलिक)' : language === 'ml' ? 'മാതൃക: 120/80' : 'Please enter valid blood pressure format (e.g. 120/80)');
        return false;
      }
      const sys = parseInt(match[1], 10);
      const dia = parseInt(match[2], 10);
      if (sys < 60 || sys > 260 || dia < 30 || dia > 160) {
        setRError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ರಕ್ತದೊತ್ತಡ ಮೌಲ್ಯ ನಮೂದಿಸಿ' : 'Please verify blood pressure values are within plausible limits');
        return false;
      }
    }

    if (rType === 'blood_glucose') {
      const val = parseFloat(rValue.trim());
      if (isNaN(val) || val <= 0 || val > 700) {
        setRError(language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಸಕ್ಕರೆ ಮಟ್ಟ ನಮೂದಿಸಿ (ಉದಾ. 110)' : 'Please enter a valid glucose number (e.g. 110)');
        return false;
      }
    }

    return true;
  }

  async function saveReading() {
    if (!profile || !validateReading()) return;
    setSaving(true);

    try {
      if (isDemo) {
        if (editingReading) {
          demoStore.updateHealthReading(editingReading.id, {
            reading_type: rType,
            value: rValue.trim(),
            unit: rUnit,
            notes: rNotes.trim() || null,
            recorded_at: new Date(rDate).toISOString(),
          });
          showToast(t('readingSaved', language), 'success');
        } else {
          demoStore.addHealthReading({
            senior_id: profile.id,
            reading_type: rType,
            value: rValue.trim(),
            unit: rUnit,
            recorded_at: new Date(rDate).toISOString(),
            source: 'user_entered',
            notes: rNotes.trim() || null,
          });
          showToast(t('readingSaved', language), 'success');
        }
        resetReadingForm();
        loadData();
        return;
      }

      if (!isSupabaseConfigured) return;

      if (editingReading) {
        const { error } = await supabase
          .from('health_readings')
          .update({
            reading_type: rType,
            value: rValue.trim(),
            unit: rUnit,
            notes: rNotes.trim() || null,
            recorded_at: new Date(rDate).toISOString(),
          })
          .eq('id', editingReading.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('health_readings').insert({
          senior_id: profile.id,
          reading_type: rType,
          value: rValue.trim(),
          unit: rUnit,
          recorded_at: new Date(rDate).toISOString(),
          source: 'user_entered',
          notes: rNotes.trim() || null,
        });
        if (error) throw error;
      }

      showToast(t('readingSaved', language), 'success');
      resetReadingForm();
      loadData();
    } catch {
      showToast(t('error', language), 'error');
    } finally {
      setSaving(false);
    }
  }

  function resetReadingForm() {
    setShowAddReading(false);
    setEditingReading(null);
    setRValue('');
    setRNotes('');
    setRError('');
    setRType('blood_pressure');
    setRUnit('mmHg');
    setRDate(new Date().toISOString().slice(0, 16));
  }

  function startEditReading(r: HealthReading) {
    setEditingReading(r);
    setRType(r.reading_type);
    setRValue(r.value);
    setRUnit(r.unit);
    setRNotes(r.notes || '');
    setRDate(new Date(r.recorded_at).toISOString().slice(0, 16));
    setShowAddReading(true);
  }

  async function saveReminder() {
    if (!profile) return;
    if (!remTitle.trim()) {
      setRemError(t('requiredField', language));
      return;
    }
    setSaving(true);

    try {
      if (isDemo) {
        demoStore.addReminder({
          senior_id: profile.id,
          title: remTitle.trim(),
          reminder_type: remType,
          scheduled_time: remTime,
          recurrence: remRecurrence,
          active: true,
        });
        showToast(t('reminderSaved', language), 'success');
        resetReminderForm();
        loadData();
        return;
      }

      if (!isSupabaseConfigured) return;

      const { error } = await supabase.from('reminders').insert({
        senior_id: profile.id,
        title: remTitle.trim(),
        reminder_type: remType,
        scheduled_time: remTime,
        recurrence: remRecurrence,
        active: true,
      });
      if (error) throw error;

      showToast(t('reminderSaved', language), 'success');
      resetReminderForm();
      loadData();
    } catch {
      showToast(t('error', language), 'error');
    } finally {
      setSaving(false);
    }
  }

  function resetReminderForm() {
    setShowAddReminder(false);
    setRemTitle('');
    setRemError('');
    setRemType('medicine');
    setRemTime('08:30');
    setRemRecurrence('daily');
  }

  async function toggleReminder(id: string, active: boolean) {
    if (isDemo) {
      demoStore.updateReminder(id, { active: !active });
      loadData();
      return;
    }
    if (isSupabaseConfigured) {
      await supabase.from('reminders').update({ active: !active }).eq('id', id);
      loadData();
    }
  }

  async function executeDelete() {
    if (!deleteConfirmId) return;

    if (deleteConfirmId.type === 'reading') {
      if (isDemo) demoStore.deleteHealthReading(deleteConfirmId.id);
      else if (isSupabaseConfigured) await supabase.from('health_readings').delete().eq('id', deleteConfirmId.id);
    } else {
      if (isDemo) demoStore.deleteReminder(deleteConfirmId.id);
      else if (isSupabaseConfigured) await supabase.from('reminders').delete().eq('id', deleteConfirmId.id);
    }

    setDeleteConfirmId(null);
    showToast(t('success', language), 'success');
    loadData();
  }

  const readingTypeLabel: Record<string, string> = {
    blood_pressure: t('bloodPressure', language),
    blood_glucose: t('bloodGlucose', language),
    weight: t('weight', language),
    temperature: t('temperature', language),
    other: t('other', language),
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/70 px-4 pt-8 pb-4 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {t('healthReminders', language)}
            </h1>
            <button
              onClick={() => (view === 'readings' ? setShowAddReading(true) : setShowAddReminder(true))}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>{view === 'readings' ? t('addReading', language) : t('addReminder', language)}</span>
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-stone-100 rounded-2xl p-1">
            <button
              onClick={() => setView('readings')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                view === 'readings' ? 'bg-white text-teal-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t('healthReadings', language)} ({readings.length})
            </button>
            <button
              onClick={() => setView('reminders')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                view === 'reminders' ? 'bg-white text-teal-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t('todayReminders', language)} ({reminders.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Transparent Manual Entry Disclaimer */}
        <div className="bg-blue-50/80 border border-blue-200/70 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
          <Info size={16} className="text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">{t('manualEntryNotice', language)}</p>
        </div>

        {/* View 1: Health Readings */}
        {view === 'readings' ? (
          <div>
            {loading ? (
              <div className="text-center py-12 text-stone-400 text-sm">{t('loading', language)}</div>
            ) : readings.length === 0 ? (
              <div className="text-center py-16 text-stone-400 bg-white border border-stone-200 rounded-3xl p-6">
                <Activity size={40} className="mx-auto mb-2 opacity-30 text-teal-600" />
                <p className="font-medium text-stone-600 text-sm">{t('noReadings', language)}</p>
                <button
                  onClick={() => setShowAddReading(true)}
                  className="mt-3 px-4 py-2 bg-teal-50 text-teal-700 font-semibold rounded-xl text-xs hover:bg-teal-100"
                >
                  {t('addReading', language)}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {readings.map(r => (
                  <div key={r.id} className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base">
                            {readingTypeLabel[r.reading_type] || r.reading_type}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.source === 'user_entered' ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {r.source === 'user_entered' ? t('enteredByUser', language) : t('enteredByCaregiver', language)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-stone-900 tracking-tight">{r.value}</span>
                          <span className="text-xs font-semibold text-stone-500">{r.unit}</span>
                        </div>
                        {r.notes && (
                          <p className="text-xs text-stone-600 mt-1 italic">"{r.notes}"</p>
                        )}
                        <p className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(r.recorded_at).toLocaleDateString()} · {formatTimeAgo(r.recorded_at, language)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditReading(r)}
                          className="w-8 h-8 rounded-lg text-stone-400 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors"
                          title={t('edit', language)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId({ id: r.id, type: 'reading' })}
                          className="w-8 h-8 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                          title={t('delete', language)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* View 2: Reminders */
          <div>
            {loading ? (
              <div className="text-center py-12 text-stone-400 text-sm">{t('loading', language)}</div>
            ) : reminders.length === 0 ? (
              <div className="text-center py-16 text-stone-400 bg-white border border-stone-200 rounded-3xl p-6">
                <Calendar size={40} className="mx-auto mb-2 opacity-30 text-blue-600" />
                <p className="font-medium text-stone-600 text-sm">{t('noReminders', language)}</p>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-xl text-xs hover:bg-blue-100"
                >
                  {t('addReminder', language)}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map(rem => (
                  <div key={rem.id} className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        rem.reminder_type === 'medicine' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {rem.reminder_type === 'medicine' ? <Pill size={22} /> : <Calendar size={22} />}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-bold text-stone-900 text-sm sm:text-base truncate ${!rem.active ? 'line-through text-stone-400' : ''}`}>
                          {rem.title}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {rem.scheduled_time} · {rem.recurrence || 'Daily'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(rem.id, rem.active)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          rem.active ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {rem.active ? t('active', language) : t('inactive', language)}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ id: rem.id, type: 'reminder' })}
                        className="w-8 h-8 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title={t('delete', language)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Reading Modal */}
      {showAddReading && (
        <Modal
          title={editingReading ? t('editReading', language) : t('addReading', language)}
          onClose={resetReadingForm}
        >
          <div className="space-y-4 py-1">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">{t('type', language)}</label>
              <div className="grid grid-cols-2 gap-2">
                {READING_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      rType === type
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {readingTypeLabel[type] || type}
                  </button>
                ))}
              </div>
            </div>

            {/* Value & Unit */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('value', language)}</label>
                <input
                  type="text"
                  value={rValue}
                  onChange={e => setRValue(e.target.value)}
                  placeholder={rType === 'blood_pressure' ? '120/80' : '110'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-300 focus:outline-none text-stone-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('unit', language)}</label>
                <input
                  type="text"
                  value={rUnit}
                  onChange={e => setRUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium"
                />
              </div>
            </div>

            {/* Helper label */}
            <p className="text-[11px] text-stone-500">
              {rType === 'blood_pressure' ? t('bpHelp', language) : t('glucoseHelp', language)}
            </p>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('date', language)}</label>
              <input
                type="datetime-local"
                value={rDate}
                onChange={e => setRDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('notes', language)}</label>
              <input
                type="text"
                value={rNotes}
                onChange={e => setRNotes(e.target.value)}
                placeholder="e.g. After morning tea"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-800 text-sm"
              />
            </div>

            {rError && (
              <p className="text-xs text-red-600 font-medium">{rError}</p>
            )}

            {/* Submit */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={resetReadingForm}
                className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-bold text-sm"
              >
                {t('cancel', language)}
              </button>
              <button
                type="button"
                onClick={saveReading}
                disabled={saving}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors"
              >
                {t('save', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <Modal title={t('addReminder', language)} onClose={resetReminderForm}>
          <div className="space-y-4 py-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('title', language)}</label>
              <input
                type="text"
                value={remTitle}
                onChange={e => setRemTitle(e.target.value)}
                placeholder="e.g. Morning Blood Pressure Medication"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-300 focus:outline-none text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('type', language)}</label>
                <select
                  value={remType}
                  onChange={e => setRemType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm"
                >
                  <option value="medicine">{t('medicine', language)}</option>
                  <option value="appointment">{t('appointment', language)}</option>
                  <option value="checkin">{t('dailyCheckin', language)}</option>
                  <option value="other">{t('other', language)}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('time', language)}</label>
                <input
                  type="time"
                  value={remTime}
                  onChange={e => setRemTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('recurrence', language)}</label>
              <div className="grid grid-cols-3 gap-2">
                {['daily', 'weekly', 'once'].map(rec => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRemRecurrence(rec)}
                    className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                      remRecurrence === rec
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    {t(rec as any, language)}
                  </button>
                ))}
              </div>
            </div>

            {remError && <p className="text-xs text-red-600 font-medium">{remError}</p>}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={resetReminderForm}
                className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-bold text-sm"
              >
                {t('cancel', language)}
              </button>
              <button
                type="button"
                onClick={saveReminder}
                disabled={saving}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors"
              >
                {t('save', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal title={t('confirmDeleteTitle', language)} onClose={() => setDeleteConfirmId(null)}>
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <p className="text-stone-700 text-sm">{t('confirmDeleteBody', language)}</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 border border-stone-300 rounded-xl text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                {t('cancel', language)}
              </button>
              <button
                onClick={executeDelete}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-xs"
              >
                {t('delete', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
