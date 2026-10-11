import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('http') &&
  !rawUrl.includes('your_supabase_project_url')
);

// Fallback to dummy values so createClient never throws in Vite runtime
const fallbackUrl = 'https://careconnect-placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(
  isSupabaseConfigured ? rawUrl : fallbackUrl,
  isSupabaseConfigured ? rawKey : fallbackKey
);

export type Role = 'senior' | 'caregiver' | 'admin';
export type Language = 'en' | 'kn' | 'ml' | 'hi';

export interface Profile {
  id: string;
  display_name: string;
  role: Role;
  preferred_language: Language;
  created_at: string;
  phone?: string;
}

export interface CaregiverLink {
  id: string;
  senior_id: string;
  caregiver_id: string;
  status: 'pending' | 'accepted' | 'revoked';
  share_health_readings: boolean;
  share_checkins: boolean;
  created_at: string;
}

export interface CheckIn {
  id: string;
  senior_id: string;
  response: 'okay' | 'wants_call' | 'needs_help';
  note: string | null;
  created_at: string;
}

export interface HelpRequest {
  id: string;
  senior_id: string;
  request_type: string;
  summary: string | null;
  status: 'pending' | 'acknowledged' | 'handled';
  assigned_caregiver_id: string | null;
  created_at: string;
  acknowledged_at: string | null;
  handled_at: string | null;
  profiles?: { display_name: string };
}

export interface HealthReading {
  id: string;
  senior_id: string;
  reading_type: 'blood_pressure' | 'blood_glucose' | 'weight' | 'temperature' | 'other';
  value: string;
  unit: string;
  recorded_at: string;
  source: 'user_entered' | 'caregiver_entered';
  notes: string | null;
}

export interface Reminder {
  id: string;
  senior_id: string;
  title: string;
  reminder_type: 'medicine' | 'appointment' | 'checkin' | 'other';
  scheduled_time: string;
  recurrence: string | null;
  active: boolean;
  created_at: string;
}
