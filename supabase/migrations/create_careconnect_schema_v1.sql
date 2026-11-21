/*
# CareConnect Schema - Core Tables

Creates all tables first, then applies all RLS policies in the correct order.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'senior' CHECK (role IN ('senior', 'caregiver', 'admin')),
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'ml', 'hi')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- CAREGIVER_LINKS
CREATE TABLE IF NOT EXISTS caregiver_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  share_health_readings boolean NOT NULL DEFAULT false,
  share_checkins boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(senior_id, caregiver_id)
);

CREATE INDEX IF NOT EXISTS idx_caregiver_links_senior ON caregiver_links(senior_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_links_caregiver ON caregiver_links(caregiver_id);

ALTER TABLE caregiver_links ENABLE ROW LEVEL SECURITY;

-- CHECK_INS
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  response text NOT NULL CHECK (response IN ('okay', 'wants_call', 'needs_help')),
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkins_senior_created ON check_ins(senior_id, created_at DESC);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- HELP_REQUESTS
CREATE TABLE IF NOT EXISTS help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  summary text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'handled')),
  assigned_caregiver_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz,
  handled_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_help_requests_senior ON help_requests(senior_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);

ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

-- HEALTH_READINGS
CREATE TABLE IF NOT EXISTS health_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  reading_type text NOT NULL CHECK (reading_type IN ('blood_pressure', 'blood_glucose', 'weight', 'temperature', 'other')),
  value text NOT NULL,
  unit text NOT NULL DEFAULT '',
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'user_entered' CHECK (source IN ('user_entered', 'caregiver_entered')),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_readings_senior_recorded ON health_readings(senior_id, recorded_at DESC);

ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;

-- REMINDERS
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  reminder_type text NOT NULL DEFAULT 'other' CHECK (reminder_type IN ('medicine', 'appointment', 'checkin', 'other')),
  scheduled_time text NOT NULL,
  recurrence text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_senior ON reminders(senior_id);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES (all tables exist now)
-- ============================================================

-- PROFILES policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own_safe" ON profiles;
CREATE POLICY "profiles_update_own_safe" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_caregiver_read_linked" ON profiles;
CREATE POLICY "profiles_caregiver_read_linked" ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = profiles.id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
    )
  );

-- CAREGIVER_LINKS policies
DROP POLICY IF EXISTS "links_select_participant" ON caregiver_links;
CREATE POLICY "links_select_participant" ON caregiver_links FOR SELECT TO authenticated
  USING (auth.uid() = senior_id OR auth.uid() = caregiver_id);

DROP POLICY IF EXISTS "links_insert_caregiver" ON caregiver_links;
CREATE POLICY "links_insert_caregiver" ON caregiver_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = caregiver_id);

DROP POLICY IF EXISTS "links_update_participant" ON caregiver_links;
CREATE POLICY "links_update_participant" ON caregiver_links FOR UPDATE TO authenticated
  USING (auth.uid() = senior_id OR auth.uid() = caregiver_id)
  WITH CHECK (auth.uid() = senior_id OR auth.uid() = caregiver_id);

DROP POLICY IF EXISTS "links_delete_participant" ON caregiver_links;
CREATE POLICY "links_delete_participant" ON caregiver_links FOR DELETE TO authenticated
  USING (auth.uid() = senior_id OR auth.uid() = caregiver_id);

-- CHECK_INS policies
DROP POLICY IF EXISTS "checkins_select_own" ON check_ins;
CREATE POLICY "checkins_select_own" ON check_ins FOR SELECT TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "checkins_insert_own" ON check_ins;
CREATE POLICY "checkins_insert_own" ON check_ins FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = senior_id);

DROP POLICY IF EXISTS "checkins_delete_own" ON check_ins;
CREATE POLICY "checkins_delete_own" ON check_ins FOR DELETE TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "checkins_caregiver_read" ON check_ins;
CREATE POLICY "checkins_caregiver_read" ON check_ins FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = check_ins.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
        AND caregiver_links.share_checkins = true
    )
  );

-- HELP_REQUESTS policies
DROP POLICY IF EXISTS "requests_select_own_senior" ON help_requests;
CREATE POLICY "requests_select_own_senior" ON help_requests FOR SELECT TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "requests_insert_own" ON help_requests;
CREATE POLICY "requests_insert_own" ON help_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = senior_id);

DROP POLICY IF EXISTS "requests_delete_own" ON help_requests;
CREATE POLICY "requests_delete_own" ON help_requests FOR DELETE TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "requests_caregiver_read" ON help_requests;
CREATE POLICY "requests_caregiver_read" ON help_requests FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = help_requests.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "requests_caregiver_update" ON help_requests;
CREATE POLICY "requests_caregiver_update" ON help_requests FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = help_requests.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = help_requests.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
    )
  );

-- HEALTH_READINGS policies
DROP POLICY IF EXISTS "readings_select_own" ON health_readings;
CREATE POLICY "readings_select_own" ON health_readings FOR SELECT TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "readings_insert_own" ON health_readings;
CREATE POLICY "readings_insert_own" ON health_readings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = senior_id);

DROP POLICY IF EXISTS "readings_delete_own" ON health_readings;
CREATE POLICY "readings_delete_own" ON health_readings FOR DELETE TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "readings_caregiver_read" ON health_readings;
CREATE POLICY "readings_caregiver_read" ON health_readings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = health_readings.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
        AND caregiver_links.share_health_readings = true
    )
  );

DROP POLICY IF EXISTS "readings_caregiver_insert" ON health_readings;
CREATE POLICY "readings_caregiver_insert" ON health_readings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM caregiver_links
      WHERE caregiver_links.senior_id = health_readings.senior_id
        AND caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.status = 'accepted'
    )
  );

-- REMINDERS policies
DROP POLICY IF EXISTS "reminders_select_own" ON reminders;
CREATE POLICY "reminders_select_own" ON reminders FOR SELECT TO authenticated
  USING (auth.uid() = senior_id);

DROP POLICY IF EXISTS "reminders_insert_own" ON reminders;
CREATE POLICY "reminders_insert_own" ON reminders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = senior_id);

DROP POLICY IF EXISTS "reminders_update_own" ON reminders;
CREATE POLICY "reminders_update_own" ON reminders FOR UPDATE TO authenticated
  USING (auth.uid() = senior_id)
  WITH CHECK (auth.uid() = senior_id);

DROP POLICY IF EXISTS "reminders_delete_own" ON reminders;
CREATE POLICY "reminders_delete_own" ON reminders FOR DELETE TO authenticated
  USING (auth.uid() = senior_id);
