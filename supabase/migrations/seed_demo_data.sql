/*
# CareConnect Demo Data Seed

Creates clearly labelled DEMO accounts, reminders, health readings, and help requests.
These are fictional records and must never be mixed with real user data.
All demo users have the password: demo1234
*/

-- Create demo auth users (these emails must match what's shown in the UI)
-- We use Supabase's auth.users directly

DO $$
DECLARE
  senior1_id uuid := '11111111-1111-1111-1111-111111111101';
  senior2_id uuid := '11111111-1111-1111-1111-111111111102';
  caregiver1_id uuid := '11111111-1111-1111-1111-111111111201';
  caregiver2_id uuid := '11111111-1111-1111-1111-111111111202';
BEGIN
  -- Create auth users for demo accounts
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES
    (senior1_id, 'demo.senior@careconnect.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
    (senior2_id, 'demo.senior2@careconnect.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
    (caregiver1_id, 'demo.caregiver@careconnect.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
    (caregiver2_id, 'demo.caregiver2@careconnect.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, created_at, updated_at, last_sign_in_at)
  VALUES
    (gen_random_uuid(), senior1_id, 'demo.senior@careconnect.app', 'email', jsonb_build_object('sub', senior1_id::text, 'email', 'demo.senior@careconnect.app'), now(), now(), now()),
    (gen_random_uuid(), senior2_id, 'demo.senior2@careconnect.app', 'email', jsonb_build_object('sub', senior2_id::text, 'email', 'demo.senior2@careconnect.app'), now(), now(), now()),
    (gen_random_uuid(), caregiver1_id, 'demo.caregiver@careconnect.app', 'email', jsonb_build_object('sub', caregiver1_id::text, 'email', 'demo.caregiver@careconnect.app'), now(), now(), now()),
    (gen_random_uuid(), caregiver2_id, 'demo.caregiver2@careconnect.app', 'email', jsonb_build_object('sub', caregiver2_id::text, 'email', 'demo.caregiver2@careconnect.app'), now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- Demo profiles
  INSERT INTO profiles (id, display_name, role, preferred_language)
  VALUES
    (senior1_id, '[DEMO] Kamala Devi', 'senior', 'kn'),
    (senior2_id, '[DEMO] Rajan Nair', 'senior', 'ml'),
    (caregiver1_id, '[DEMO] Priya Sharma', 'caregiver', 'en'),
    (caregiver2_id, '[DEMO] Arun Kumar', 'caregiver', 'hi')
  ON CONFLICT (id) DO NOTHING;

  -- Caregiver links (accepted, with permissions)
  INSERT INTO caregiver_links (senior_id, caregiver_id, status, share_health_readings, share_checkins)
  VALUES
    (senior1_id, caregiver1_id, 'accepted', true, true),
    (senior2_id, caregiver1_id, 'accepted', false, true),
    (senior1_id, caregiver2_id, 'accepted', true, true)
  ON CONFLICT (senior_id, caregiver_id) DO NOTHING;

  -- Check-ins
  INSERT INTO check_ins (senior_id, response, note, created_at)
  VALUES
    (senior1_id, 'okay', 'Feeling well today!', now() - interval '2 hours'),
    (senior2_id, 'wants_call', NULL, now() - interval '5 hours')
  ON CONFLICT DO NOTHING;

  -- Help requests (one pending, one acknowledged)
  INSERT INTO help_requests (senior_id, request_type, summary, status, assigned_caregiver_id, created_at, acknowledged_at)
  VALUES
    (senior1_id, 'call_request', '[DEMO] Would like a check-in call this afternoon', 'pending', NULL, now() - interval '1 hour', NULL),
    (senior2_id, 'general_assistance', '[DEMO] Needs help with medication reminder setup', 'acknowledged', caregiver1_id, now() - interval '3 hours', now() - interval '1 hour')
  ON CONFLICT DO NOTHING;

  -- Health readings
  INSERT INTO health_readings (senior_id, reading_type, value, unit, recorded_at, source, notes)
  VALUES
    (senior1_id, 'blood_pressure', '125/82', 'mmHg', now() - interval '1 day', 'user_entered', '[DEMO] Morning reading'),
    (senior1_id, 'blood_glucose', '108', 'mg/dL', now() - interval '6 hours', 'user_entered', '[DEMO] After breakfast'),
    (senior1_id, 'weight', '62', 'kg', now() - interval '2 days', 'user_entered', NULL),
    (senior2_id, 'blood_pressure', '132/88', 'mmHg', now() - interval '12 hours', 'caregiver_entered', '[DEMO] Entered by caregiver during visit')
  ON CONFLICT DO NOTHING;

  -- Reminders
  INSERT INTO reminders (senior_id, title, reminder_type, scheduled_time, recurrence, active)
  VALUES
    (senior1_id, '[DEMO] Morning medicine', 'medicine', '08:00', 'daily', true),
    (senior1_id, '[DEMO] Evening walk reminder', 'other', '17:30', 'daily', true),
    (senior1_id, '[DEMO] Doctor appointment - Dr. Reddy', 'appointment', '10:00', 'once', true),
    (senior2_id, '[DEMO] Blood pressure medicine', 'medicine', '09:00', 'daily', true),
    (senior2_id, '[DEMO] Weekly check-up call', 'appointment', '11:00', 'weekly', true)
  ON CONFLICT DO NOTHING;

END $$;
