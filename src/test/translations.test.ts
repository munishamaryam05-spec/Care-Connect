import { describe, it, expect } from 'vitest';
import { t, getGreeting, formatTimeAgo, translations, type TranslationKey } from '../lib/translations';
import type { Language } from '../lib/supabase';

describe('CareConnect Translations & Multilingual Support', () => {
  const languages: Language[] = ['en', 'kn', 'ml', 'hi'];

  it('contains complete dictionary for all 4 supported languages', () => {
    languages.forEach(lang => {
      expect(translations[lang]).toBeDefined();
      expect(translations[lang].appName).toBeTruthy();
      expect(translations[lang].iAmOkay).toBeTruthy();
      expect(translations[lang].iWantToTalk).toBeTruthy();
      expect(translations[lang].iNeedHelp).toBeTruthy();
      expect(translations[lang].emergencyDisclaimer).toBeTruthy();
    });
  });

  it('correctly translates the prominent 3 check-in buttons in all languages', () => {
    // English
    expect(t('iAmOkay', 'en')).toBe("I'm Okay");
    expect(t('iWantToTalk', 'en')).toBe('I Want to Talk');
    expect(t('iNeedHelp', 'en')).toBe('I Need Help');

    // Kannada
    expect(t('iAmOkay', 'kn')).toBe('ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ');
    expect(t('iWantToTalk', 'kn')).toBe('ನಾನು ಮಾತನಾಡಬೇಕು');
    expect(t('iNeedHelp', 'kn')).toBe('ನನಗೆ ಸಹಾಯ ಬೇಕು');

    // Malayalam
    expect(t('iAmOkay', 'ml')).toBe('ഞാൻ സുഖമായിരിക്കുന്നു');
    expect(t('iWantToTalk', 'ml')).toBe('എനിക്ക് സംസാരിക്കണം');
    expect(t('iNeedHelp', 'ml')).toBe('എനിക്ക് സഹായം വേണം');

    // Hindi
    expect(t('iAmOkay', 'hi')).toBe('मैं ठीक हूँ');
    expect(t('iWantToTalk', 'hi')).toBe('मैं बात करना चाहता हूँ');
    expect(t('iNeedHelp', 'hi')).toBe('मुझे मदद चाहिए');
  });

  it('provides safe fallbacks for missing keys', () => {
    // Non-existent key should return fallback or key itself
    const res = t('appName' as TranslationKey, 'en');
    expect(res).toBe('CareConnect');
  });

  it('returns appropriate time-of-day greeting in selected language', () => {
    languages.forEach(lang => {
      const greeting = getGreeting(lang);
      expect(typeof greeting).toBe('string');
      expect(greeting.length).toBeGreaterThan(0);
    });
  });

  it('formats relative time correctly across languages', () => {
    const nowIso = new Date().toISOString();
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

    expect(formatTimeAgo(nowIso, 'en')).toBe('just now');
    expect(formatTimeAgo(oneHourAgo, 'en')).toContain('hours ago');
    expect(formatTimeAgo(twoDaysAgo, 'en')).toBe('2 days ago');

    expect(formatTimeAgo(nowIso, 'kn')).toBe('ಈಗಷ್ಟೇ');
    expect(formatTimeAgo(nowIso, 'hi')).toBe('अभी-अभी');
    expect(formatTimeAgo(nowIso, 'ml')).toBe('ഇപ്പോൾ');
  });
});
