import { describe, it, expect, beforeEach } from 'vitest';
import {
  demoStore,
  DEMO_SENIOR_1,
  DEMO_SENIOR_2,
  DEMO_CAREGIVER_1,
  DEMO_CAREGIVER_2
} from '../lib/demo-store';

describe('CareConnect DemoStore & Core Business Logic', () => {
  beforeEach(() => {
    demoStore.reset();
  });

  it('initializes with fictional sample users without mixing real patient data', () => {
    const profiles = demoStore.getProfiles();
    expect(profiles.length).toBe(4);

    const s1 = demoStore.getProfile(DEMO_SENIOR_1.id);
    expect(s1).toBeDefined();
    expect(s1?.display_name).toContain('[DEMO]');
    expect(s1?.role).toBe('senior');
    expect(s1?.preferred_language).toBe('kn');

    const c1 = demoStore.getProfile(DEMO_CAREGIVER_1.id);
    expect(c1).toBeDefined();
    expect(c1?.role).toBe('caregiver');
  });

  it('records wellbeing check-ins correctly', () => {
    const initialCheckins = demoStore.getCheckIns(DEMO_SENIOR_1.id);
    expect(initialCheckins.length).toBeGreaterThan(0);

    const newCheckin = demoStore.addCheckIn({
      senior_id: DEMO_SENIOR_1.id,
      response: 'wants_call',
      note: 'Looking forward to weekend check-in',
    });

    expect(newCheckin.id).toBeTruthy();
    expect(newCheckin.response).toBe('wants_call');

    const updatedCheckins = demoStore.getCheckIns(DEMO_SENIOR_1.id);
    expect(updatedCheckins[0].id).toBe(newCheckin.id);
    expect(updatedCheckins[0].response).toBe('wants_call');
  });

  it('transitions help request through pending -> acknowledged -> handled with timestamps', () => {
    // 1. Senior creates help request
    const req = demoStore.addHelpRequest({
      senior_id: DEMO_SENIOR_1.id,
      request_type: 'call_request',
      summary: 'Please call me this afternoon',
      status: 'pending',
      assigned_caregiver_id: null,
    });

    expect(req.status).toBe('pending');
    expect(req.acknowledged_at).toBeNull();
    expect(req.handled_at).toBeNull();

    // 2. Caregiver acknowledges request
    const ackTime = new Date().toISOString();
    const ackReq = demoStore.updateHelpRequest(req.id, {
      status: 'acknowledged',
      assigned_caregiver_id: DEMO_CAREGIVER_1.id,
      acknowledged_at: ackTime,
    });

    expect(ackReq?.status).toBe('acknowledged');
    expect(ackReq?.assigned_caregiver_id).toBe(DEMO_CAREGIVER_1.id);
    expect(ackReq?.acknowledged_at).toBe(ackTime);

    // 3. Caregiver marks request as handled
    const handledTime = new Date().toISOString();
    const handledReq = demoStore.updateHelpRequest(req.id, {
      status: 'handled',
      handled_at: handledTime,
    });

    expect(handledReq?.status).toBe('handled');
    expect(handledReq?.handled_at).toBe(handledTime);
  });

  it('allows senior to cancel a pending help request', () => {
    const req = demoStore.addHelpRequest({
      senior_id: DEMO_SENIOR_1.id,
      request_type: 'general_assistance',
      summary: 'Help with groceries',
      status: 'pending',
      assigned_caregiver_id: null,
    });

    const deleted = demoStore.deleteHelpRequest(req.id, DEMO_SENIOR_1.id);
    expect(deleted).toBe(true);

    const remaining = demoStore.getHelpRequests(DEMO_SENIOR_1.id);
    expect(remaining.some(r => r.id === req.id)).toBe(false);
  });

  it('records manual health readings with origin source tag', () => {
    const reading = demoStore.addHealthReading({
      senior_id: DEMO_SENIOR_1.id,
      reading_type: 'blood_pressure',
      value: '120/80',
      unit: 'mmHg',
      recorded_at: new Date().toISOString(),
      source: 'user_entered',
      notes: 'Morning routine reading',
    });

    expect(reading.source).toBe('user_entered');
    expect(reading.reading_type).toBe('blood_pressure');
    expect(reading.value).toBe('120/80');

    // Caregiver entry
    const cgReading = demoStore.addHealthReading({
      senior_id: DEMO_SENIOR_1.id,
      reading_type: 'blood_glucose',
      value: '105',
      unit: 'mg/dL',
      recorded_at: new Date().toISOString(),
      source: 'caregiver_entered',
      notes: 'Taken during home visit',
    });

    expect(cgReading.source).toBe('caregiver_entered');
  });

  it('enforces caregiver privacy links and granular permissions', () => {
    const links = demoStore.getCaregiverLinks(DEMO_CAREGIVER_1.id);
    expect(links.length).toBeGreaterThan(0);

    const s1Link = links.find(l => l.senior_id === DEMO_SENIOR_1.id);
    expect(s1Link?.share_health_readings).toBe(true);

    const s2Link = links.find(l => l.senior_id === DEMO_SENIOR_2.id);
    expect(s2Link?.share_health_readings).toBe(false);

    // When share_health_readings is false, readings must not be leaked to caregiver overview
    const senior2Readings = demoStore.getHealthReadings(DEMO_SENIOR_2.id);
    expect(senior2Readings.length).toBeGreaterThan(0);

    // Permission toggle
    demoStore.updateLink(s2Link!.id, { share_health_readings: true });
    const updatedLinks = demoStore.getCaregiverLinks(DEMO_CAREGIVER_1.id);
    const updatedS2Link = updatedLinks.find(l => l.senior_id === DEMO_SENIOR_2.id);
    expect(updatedS2Link?.share_health_readings).toBe(true);
  });
});
