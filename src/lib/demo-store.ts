import type { Profile, CaregiverLink, CheckIn, HelpRequest, HealthReading, Reminder, Language, Role } from './supabase';

const DEMO_STORAGE_KEY = 'careconnect_demo_data_v1';

export interface DemoUser {
  id: string;
  email: string;
  display_name: string;
  role: Role;
  preferred_language: Language;
  phone: string;
}

export const DEMO_SENIOR_1: DemoUser = {
  id: '11111111-1111-1111-1111-111111111101',
  email: 'demo.senior@careconnect.app',
  display_name: '[DEMO] Kamala Devi',
  role: 'senior',
  preferred_language: 'en',
  phone: '+91 98765 43210',
};

export const DEMO_SENIOR_2: DemoUser = {
  id: '11111111-1111-1111-1111-111111111102',
  email: 'demo.senior2@careconnect.app',
  display_name: '[DEMO] Rajan Nair',
  role: 'senior',
  preferred_language: 'ml',
  phone: '+91 98765 43211',
};

export const DEMO_CAREGIVER_1: DemoUser = {
  id: '11111111-1111-1111-1111-111111111201',
  email: 'demo.caregiver@careconnect.app',
  display_name: '[DEMO] Priya Sharma',
  role: 'caregiver',
  preferred_language: 'en',
  phone: '+91 98765 43212',
};

export const DEMO_CAREGIVER_2: DemoUser = {
  id: '11111111-1111-1111-1111-111111111202',
  email: 'demo.caregiver2@careconnect.app',
  display_name: '[DEMO] Arun Kumar',
  role: 'caregiver',
  preferred_language: 'hi',
  phone: '+91 98765 43213',
};

export const ALL_DEMO_USERS = [DEMO_SENIOR_1, DEMO_SENIOR_2, DEMO_CAREGIVER_1, DEMO_CAREGIVER_2];

export interface DemoState {
  profiles: Profile[];
  caregiver_links: CaregiverLink[];
  check_ins: CheckIn[];
  help_requests: HelpRequest[];
  health_readings: HealthReading[];
  reminders: Reminder[];
}

function getInitialDemoState(): DemoState {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  return {
    profiles: ALL_DEMO_USERS.map(u => ({
      id: u.id,
      display_name: u.display_name,
      role: u.role,
      preferred_language: u.preferred_language,
      created_at: daysAgo(30),
    })),
    caregiver_links: [
      {
        id: 'link-1',
        senior_id: DEMO_SENIOR_1.id,
        caregiver_id: DEMO_CAREGIVER_1.id,
        status: 'accepted',
        share_health_readings: true,
        share_checkins: true,
        created_at: daysAgo(30),
      },
      {
        id: 'link-2',
        senior_id: DEMO_SENIOR_2.id,
        caregiver_id: DEMO_CAREGIVER_1.id,
        status: 'accepted',
        share_health_readings: false,
        share_checkins: true,
        created_at: daysAgo(20),
      },
      {
        id: 'link-3',
        senior_id: DEMO_SENIOR_1.id,
        caregiver_id: DEMO_CAREGIVER_2.id,
        status: 'accepted',
        share_health_readings: true,
        share_checkins: true,
        created_at: daysAgo(15),
      },
    ],
    check_ins: [
      {
        id: 'checkin-1',
        senior_id: DEMO_SENIOR_1.id,
        response: 'okay',
        note: 'Feeling peaceful today, had morning tea',
        created_at: hoursAgo(2),
      },
      {
        id: 'checkin-2',
        senior_id: DEMO_SENIOR_2.id,
        response: 'wants_call',
        note: 'Would like to speak about weekend plans',
        created_at: hoursAgo(5),
      },
    ],
    help_requests: [
      {
        id: 'req-1',
        senior_id: DEMO_SENIOR_1.id,
        request_type: 'call_request',
        summary: '[DEMO] Would appreciate a check-in call this afternoon',
        status: 'pending',
        assigned_caregiver_id: null,
        created_at: hoursAgo(1),
        acknowledged_at: null,
        handled_at: null,
      },
      {
        id: 'req-2',
        senior_id: DEMO_SENIOR_2.id,
        request_type: 'general_assistance',
        summary: '[DEMO] Needs help reviewing medication schedule',
        status: 'acknowledged',
        assigned_caregiver_id: DEMO_CAREGIVER_1.id,
        created_at: hoursAgo(4),
        acknowledged_at: hoursAgo(1.5),
        handled_at: null,
      },
    ],
    health_readings: [
      {
        id: 'reading-1',
        senior_id: DEMO_SENIOR_1.id,
        reading_type: 'blood_pressure',
        value: '124/82',
        unit: 'mmHg',
        recorded_at: daysAgo(1),
        source: 'user_entered',
        notes: '[DEMO] Morning reading after breakfast',
      },
      {
        id: 'reading-2',
        senior_id: DEMO_SENIOR_1.id,
        reading_type: 'blood_glucose',
        value: '110',
        unit: 'mg/dL',
        recorded_at: hoursAgo(6),
        source: 'user_entered',
        notes: '[DEMO] Fasting reading',
      },
      {
        id: 'reading-3',
        senior_id: DEMO_SENIOR_1.id,
        reading_type: 'weight',
        value: '62.5',
        unit: 'kg',
        recorded_at: daysAgo(3),
        source: 'user_entered',
        notes: null,
      },
      {
        id: 'reading-4',
        senior_id: DEMO_SENIOR_2.id,
        reading_type: 'blood_pressure',
        value: '130/85',
        unit: 'mmHg',
        recorded_at: hoursAgo(12),
        source: 'caregiver_entered',
        notes: '[DEMO] Entered by caregiver during home visit',
      },
    ],
    reminders: [
      {
        id: 'rem-1',
        senior_id: DEMO_SENIOR_1.id,
        title: '[DEMO] Morning Blood Pressure Pill (Amlodipine 5mg)',
        reminder_type: 'medicine',
        scheduled_time: '08:30',
        recurrence: 'daily',
        active: true,
        created_at: daysAgo(20),
      },
      {
        id: 'rem-2',
        senior_id: DEMO_SENIOR_1.id,
        title: '[DEMO] Evening Garden Walk',
        reminder_type: 'other',
        scheduled_time: '17:30',
        recurrence: 'daily',
        active: true,
        created_at: daysAgo(20),
      },
      {
        id: 'rem-3',
        senior_id: DEMO_SENIOR_1.id,
        title: '[DEMO] Dr. Reddy Routine Check-up',
        reminder_type: 'appointment',
        scheduled_time: '11:00',
        recurrence: 'once',
        active: true,
        created_at: daysAgo(5),
      },
      {
        id: 'rem-4',
        senior_id: DEMO_SENIOR_2.id,
        title: '[DEMO] Morning Multivitamin',
        reminder_type: 'medicine',
        scheduled_time: '09:00',
        recurrence: 'daily',
        active: true,
        created_at: daysAgo(10),
      },
      {
        id: 'rem-5',
        senior_id: DEMO_SENIOR_2.id,
        title: '[DEMO] Weekly Wellbeing Call with Priya',
        reminder_type: 'appointment',
        scheduled_time: '16:00',
        recurrence: 'weekly',
        active: true,
        created_at: daysAgo(10),
      },
    ],
  };
}

class DemoStore {
  private state: DemoState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DemoState {
    try {
      const data = localStorage.getItem(DEMO_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    const fresh = getInitialDemoState();
    this.saveToStorage(fresh);
    return fresh;
  }

  private saveToStorage(state: DemoState) {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  private notify() {
    this.saveToStorage(this.state);
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public reset() {
    this.state = getInitialDemoState();
    this.notify();
  }

  // Profiles
  public getProfile(id: string): Profile | null {
    return this.state.profiles.find(p => p.id === id) || null;
  }

  public getProfiles(ids?: string[]): Profile[] {
    if (!ids) return [...this.state.profiles];
    return this.state.profiles.filter(p => ids.includes(p.id));
  }

  public updateProfile(id: string, updates: Partial<Profile>): Profile | null {
    const idx = this.state.profiles.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.state.profiles[idx] = { ...this.state.profiles[idx], ...updates };
      this.notify();
      return this.state.profiles[idx];
    }
    return null;
  }

  // Caregiver Links
  public getCaregiverLinks(caregiverId: string): CaregiverLink[] {
    return this.state.caregiver_links.filter(l => l.caregiver_id === caregiverId);
  }

  public getSeniorCaregiverLinks(seniorId: string): CaregiverLink[] {
    return this.state.caregiver_links.filter(l => l.senior_id === seniorId);
  }

  public updateLink(id: string, updates: Partial<CaregiverLink>) {
    const idx = this.state.caregiver_links.findIndex(l => l.id === id);
    if (idx >= 0) {
      this.state.caregiver_links[idx] = { ...this.state.caregiver_links[idx], ...updates };
      this.notify();
    }
  }

  // Check-ins
  public getCheckIns(seniorId: string): CheckIn[] {
    return this.state.check_ins
      .filter(c => c.senior_id === seniorId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getCheckInsForSeniors(seniorIds: string[]): CheckIn[] {
    return this.state.check_ins
      .filter(c => seniorIds.includes(c.senior_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addCheckIn(checkIn: Omit<CheckIn, 'id' | 'created_at'>): CheckIn {
    const newRecord: CheckIn = {
      ...checkIn,
      id: 'checkin-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.state.check_ins.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  // Help Requests
  public getHelpRequests(seniorId?: string): HelpRequest[] {
    let list = this.state.help_requests;
    if (seniorId) {
      list = list.filter(r => r.senior_id === seniorId);
    }
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getHelpRequestsForSeniors(seniorIds: string[]): HelpRequest[] {
    return this.state.help_requests
      .filter(r => seniorIds.includes(r.senior_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addHelpRequest(req: Omit<HelpRequest, 'id' | 'created_at' | 'acknowledged_at' | 'handled_at'>): HelpRequest {
    const newRecord: HelpRequest = {
      ...req,
      id: 'req-' + Date.now(),
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      handled_at: null,
    };
    this.state.help_requests.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  public updateHelpRequest(id: string, updates: Partial<HelpRequest>): HelpRequest | null {
    const idx = this.state.help_requests.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.state.help_requests[idx] = { ...this.state.help_requests[idx], ...updates };
      this.notify();
      return this.state.help_requests[idx];
    }
    return null;
  }

  public deleteHelpRequest(id: string, seniorId?: string): boolean {
    const prevLen = this.state.help_requests.length;
    this.state.help_requests = this.state.help_requests.filter(r => {
      if (r.id !== id) return true;
      if (seniorId && r.senior_id !== seniorId) return true;
      return false;
    });
    const deleted = this.state.help_requests.length < prevLen;
    if (deleted) this.notify();
    return deleted;
  }

  // Health Readings
  public getHealthReadings(seniorId: string): HealthReading[] {
    return this.state.health_readings
      .filter(r => r.senior_id === seniorId)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  }

  public getHealthReadingsForSeniors(seniorIds: string[]): HealthReading[] {
    return this.state.health_readings
      .filter(r => seniorIds.includes(r.senior_id))
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  }

  public addHealthReading(reading: Omit<HealthReading, 'id'>): HealthReading {
    const newRecord: HealthReading = {
      ...reading,
      id: 'reading-' + Date.now(),
    };
    this.state.health_readings.unshift(newRecord);
    this.notify();
    return newRecord;
  }

  public updateHealthReading(id: string, updates: Partial<HealthReading>): HealthReading | null {
    const idx = this.state.health_readings.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.state.health_readings[idx] = { ...this.state.health_readings[idx], ...updates };
      this.notify();
      return this.state.health_readings[idx];
    }
    return null;
  }

  public deleteHealthReading(id: string): boolean {
    const prevLen = this.state.health_readings.length;
    this.state.health_readings = this.state.health_readings.filter(r => r.id !== id);
    const deleted = this.state.health_readings.length < prevLen;
    if (deleted) this.notify();
    return deleted;
  }

  // Reminders
  public getReminders(seniorId: string): Reminder[] {
    return this.state.reminders
      .filter(r => r.senior_id === seniorId)
      .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));
  }

  public addReminder(rem: Omit<Reminder, 'id' | 'created_at'>): Reminder {
    const newRecord: Reminder = {
      ...rem,
      id: 'rem-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.state.reminders.push(newRecord);
    this.notify();
    return newRecord;
  }

  public updateReminder(id: string, updates: Partial<Reminder>): Reminder | null {
    const idx = this.state.reminders.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.state.reminders[idx] = { ...this.state.reminders[idx], ...updates };
      this.notify();
      return this.state.reminders[idx];
    }
    return null;
  }

  public deleteReminder(id: string): boolean {
    const prevLen = this.state.reminders.length;
    this.state.reminders = this.state.reminders.filter(r => r.id !== id);
    const deleted = this.state.reminders.length < prevLen;
    if (deleted) this.notify();
    return deleted;
  }
}

export const demoStore = new DemoStore();
