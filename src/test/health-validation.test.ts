import { describe, it, expect } from 'vitest';

describe('Health Reading Validation & Safeguards', () => {
  function validateBloodPressure(val: string): { valid: boolean; error?: string } {
    const trimmed = val.trim();
    if (!trimmed) return { valid: false, error: 'Required' };
    const match = trimmed.match(/^(\d{2,3})\/(\d{2,3})$/);
    if (!match) return { valid: false, error: 'Invalid format. Use 120/80' };
    const sys = parseInt(match[1], 10);
    const dia = parseInt(match[2], 10);
    if (sys < 60 || sys > 260 || dia < 30 || dia > 160) {
      return { valid: false, error: 'Plausible range error' };
    }
    return { valid: true };
  }

  function validateBloodGlucose(val: string): { valid: boolean; error?: string } {
    const trimmed = val.trim();
    if (!trimmed) return { valid: false, error: 'Required' };
    const num = parseFloat(trimmed);
    if (isNaN(num) || num <= 0 || num > 700) {
      return { valid: false, error: 'Invalid glucose number' };
    }
    return { valid: true };
  }

  it('validates blood pressure format correctly', () => {
    expect(validateBloodPressure('120/80').valid).toBe(true);
    expect(validateBloodPressure('135/85').valid).toBe(true);
    expect(validateBloodPressure('110/70').valid).toBe(true);

    expect(validateBloodPressure('120').valid).toBe(false);
    expect(validateBloodPressure('high').valid).toBe(false);
    expect(validateBloodPressure('120-80').valid).toBe(false);
    expect(validateBloodPressure('400/200').valid).toBe(false);
  });

  it('validates blood glucose numbers correctly', () => {
    expect(validateBloodGlucose('110').valid).toBe(true);
    expect(validateBloodGlucose('95.5').valid).toBe(true);
    expect(validateBloodGlucose('180').valid).toBe(true);

    expect(validateBloodGlucose('0').valid).toBe(false);
    expect(validateBloodGlucose('-5').valid).toBe(false);
    expect(validateBloodGlucose('normal').valid).toBe(false);
    expect(validateBloodGlucose('1000').valid).toBe(false);
  });
});
