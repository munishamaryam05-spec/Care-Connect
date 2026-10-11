import { useState, useRef, useEffect } from 'react';
import {
  Send, Mic, MicOff, Volume2, Loader2, Sparkles, AlertCircle,
  HelpCircle, Calendar, PhoneCall, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/translations';
import { supabase, isSupabaseConfigured, type Language } from '@/lib/supabase';
import { demoStore } from '@/lib/demo-store';
import { showToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: 'create_help_request' | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function AssistantPage() {
  const { profile, language, session, isDemo } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingHelpText, setPendingHelpText] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check speech recognition support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Initial greeting in user's selected language
  useEffect(() => {
    if (profile) {
      const name = profile.display_name.replace('[DEMO] ', '').split(' ')[0];
      const greetings: Record<Language, string> = {
        kn: `ನಮಸ್ಕಾರ ${name}! ನಾನು ನಿಮ್ಮ ಕೇರ್‌ಕನೆಕ್ಟ್ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ನಿಮ್ಮ ಜ್ಞಾಪಕಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು, ಕುಟುಂಬದವರನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು ಅಥವಾ ಸಹಾಯ ಪಡೆಯಬಹುದು.`,
        ml: `നമസ്കാരം ${name}! ഞാൻ നിങ്ങളുടെ കെയർകണക്ട് സഹായിയാണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം? ഓർമ്മപ്പെടുത്തലുകളെക്കുറിച്ച് ചോദിക്കാം, അല്ലെങ്കിൽ സഹായം അഭ്യർത്ഥിക്കാം.`,
        hi: `नमस्ते ${name}! मैं आपका केयरकनेक्ट सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? आप अनुस्मारक के बारे में पूछ सकते हैं, या सहायता का अनुरोध कर सकते हैं।`,
        en: `Hello ${name}! I'm your CareConnect assistant. How may I support you today? You can ask me to explain your reminders, reach your family, or send a help request.`,
      };

      setMessages([{
        role: 'assistant',
        content: greetings[language] || greetings.en,
        timestamp: new Date(),
      }]);
    }
  }, [profile, language]);

  // Fallback assistant logic that generates safe, multilingual responses
  function generateFallbackReply(userText: string, lang: Language): { reply: string; action: 'create_help_request' | null } {
    const lower = userText.toLowerCase();

    // Urgent / medical symptoms safety check
    const urgentWords = ['chest pain', 'heart attack', 'breathing', 'faint', 'bleed', 'ಎದೆ ನೋವು', 'ಉಸಿರಾಟ', 'നെഞ്ചുവേദന', 'ശ്വാസം', 'सीने में दर्द', 'सांस'];
    if (urgentWords.some(w => lower.includes(w))) {
      const responses: Record<Language, string> = {
        kn: 'ಗಂಭೀರ ಆರೋಗ್ಯ ಲಕ್ಷಣಗಳಿದ್ದಲ್ಲಿ ದಯವಿಟ್ಟು ತಕ್ಷಣ 112 ಗೆ ಅಥವಾ ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ. ನಾನು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',
        ml: 'ഗുരുതരമായ ആരോഗ്യ ലക്ഷണങ്ങൾക്ക് ദയവായി ഉടൻ 112 ലേക്ക് അല്ലെങ്കിൽ ഡോക്ടറെ ബന്ധപ്പെടുക. ഞാൻ ഒരു ഡോക്ടറല്ല.',
        hi: 'यदि आपको गंभीर स्वास्थ्य लक्षण हैं, तो कृपया तुरंत 112 पर या डॉक्टर को कॉल करें। मैं चिकित्सीय सलाह नहीं दे सकता।',
        en: 'For urgent medical symptoms, please call emergency services (112) or contact your doctor immediately. I cannot provide medical diagnosis or treatment.',
      };
      return { reply: responses[lang], action: 'create_help_request' };
    }

    // Help request trigger
    const helpWords = ['help', 'sos', 'assist', 'urgent', 'ಸಹಾಯ', 'ಸಹಾಯ ಬೇಕು', 'സഹായം', 'मदद'];
    if (helpWords.some(w => lower.includes(w))) {
      const responses: Record<Language, string> = {
        kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ಈಗಲೇ ಸಹಾಯದ ವಿನಂತಿ ಕಳುಹಿಸಲು ನೀವು ದೃಢೀಕರಿಸಲು ಬಯಸುವಿರಾ?',
        ml: 'സഹായം ആവശ്യമുള്ളതായി മനസ്സിലാക്കുന്നു. നിങ്ങളുടെ പരിചാരകന് ഇപ്പോൾ സഹായ അഭ്യർത്ഥന അയക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?',
        hi: 'मैं समझ गया। क्या आप अपने देखभालकर्ता को तुरंत सहायता अनुरोध भेजना चाहते हैं?',
        en: 'I understand you need assistance. Would you like me to send an official help request to your caregiver right now?',
      };
      return { reply: responses[lang], action: 'create_help_request' };
    }

    // Reminders
    const reminderWords = ['reminder', 'medicine', 'pill', 'appointment', 'ಮಾತ್ರೆ', 'ಔಷಧ', 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್', 'മരുന്ന്', 'ദിവസം', 'दवा', 'अनुस्मारक'];
    if (reminderWords.some(w => lower.includes(w))) {
      const responses: Record<Language, string> = {
        kn: 'ನಿಮ್ಮ ಇಂದಿನ ಜ್ಞಾಪಕಗಳು: ಬೆಳಿಗ್ಗೆ ರಕ್ತದೊತ್ತಡ ಮಾತ್ರೆ (08:30) ಮತ್ತು ಸಂಜೆ ತೋಟದ ನಡಿಗೆ (17:30). ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ನೀರು ಕುಡಿಯಲು ಮರೆಯಬೇಡಿ.',
        ml: 'ഇന്നത്തെ ഓർമ്മപ്പെടുത്തലുകൾ: രാവിലെ രക്തസമ്മർദ്ദത്തിനുള്ള മരുന്ന്, വൈകുന്നേരത്തെ നടത്തം. മരുന്നുകൾ കൃത്യസമയത്ത് കഴിക്കാൻ ഓർക്കുക.',
        hi: 'आज के आपके अनुस्मारक: सुबह रक्तचाप की दवा और शाम को टहलना। कृपया समय पर दवा लें और पर्याप्त पानी पिएं।',
        en: "Here are your scheduled reminders: Morning blood pressure pill at 8:30 AM and an evening walk at 5:30 PM. Remember to stay hydrated!",
      };
      return { reply: responses[lang], action: null };
    }

    // Contact family / caregiver
    const familyWords = ['family', 'call', 'talk', 'caregiver', 'ಕುಟುಂಬ', 'ಕರೆ', 'സംസാരിക്കുക', 'വിളിക്കുക', 'बात', 'परिवार'];
    if (familyWords.some(w => lower.includes(w))) {
      const responses: Record<Language, string> = {
        kn: 'ಖಂಡಿತ! ನೀವು ಮುಖಪುಟದಲ್ಲಿ "ನಾನು ಮಾತನಾಡಬೇಕು" ಒತ್ತಬಹುದು ಅಥವಾ ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಬಹುದು.',
        ml: 'തീർച്ചയായും! ഹോം സ്ക്രീനിൽ "എനിക്ക് സംസാരിക്കണം" തിരഞ്ഞെടുക്കുകയോ നേരിട്ട് വിളിക്കുകയോ ചെയ്യാം.',
        hi: 'अवश्य! आप होम स्क्रीन पर "मैं बात करना चाहता हूँ" चुन सकते हैं या सीधे देखभालकर्ता को फ़ोन कर सकते हैं।',
        en: 'Certainly! You can tap "I Want to Talk" on your home screen or contact your linked caregiver directly from the trusted contact card.',
      };
      return { reply: responses[lang], action: null };
    }

    // Default conversational reply
    const defaultReplies: Record<Language, string> = {
      kn: 'ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನಿಮ್ಮ ಜ್ಞಾಪಕಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು ಅಥವಾ ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಬಹುದು.',
      ml: 'ഞാൻ ഇവിടെയുണ്ട്. ഓർമ്മപ്പെടുത്തലുകൾ അറിയാനോ പരിചാരകന് സന്ദേശം അയക്കാനോ എന്നോട് ചോദിക്കാം.',
      hi: 'मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे अनुस्मारक या परिवार से संपर्क के बारे में पूछ सकते हैं।',
      en: "I am here to support you. You can ask about your reminders, request a call, or let me know if you need any assistance.",
    };
    return { reply: defaultReplies[lang], action: null };
  }

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      let reply = '';
      let action: 'create_help_request' | null = null;

      // Try backend Edge Function if configured and not offline demo
      if (isSupabaseConfigured && !isDemo && session?.access_token) {
        try {
          const resp = await fetch(`${SUPABASE_URL}/functions/v1/assistant`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
              Apikey: SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              message: text.trim(),
              language,
              seniorId: profile?.id,
            }),
          });

          if (resp.ok) {
            const data = await resp.json();
            if (data.reply) {
              reply = data.reply;
              action = data.action;
            }
          }
        } catch {
          // fallback to client logic
        }
      }

      // If backend was not reached or in demo mode, use safe multilingual fallback engine
      if (!reply) {
        // simulate natural response delay
        await new Promise(r => setTimeout(r, 600));
        const fb = generateFallbackReply(text.trim(), language);
        reply = fb.reply;
        action = fb.action;
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
        action,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If action is help request, show explicit confirmation modal before creating request
      if (action === 'create_help_request') {
        setPendingHelpText(text.trim());
        setShowConfirmModal(true);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('aiUnavailable', language),
        timestamp: new Date(),
      }]);
    } finally {
      setSending(false);
    }
  }

  async function handleConfirmHelpRequest() {
    if (!profile) return;
    setShowConfirmModal(false);

    try {
      if (isDemo) {
        demoStore.addHelpRequest({
          senior_id: profile.id,
          request_type: 'assistant_request',
          summary: `[Assistant] ${pendingHelpText || 'Assistance requested via Assistant'}`,
          status: 'pending',
          assigned_caregiver_id: null,
        });
        showToast(t('requestCreated', language), 'success');
        return;
      }

      if (isSupabaseConfigured) {
        await supabase.from('help_requests').insert({
          senior_id: profile.id,
          request_type: 'assistant_request',
          summary: pendingHelpText || 'Requested via assistant',
          status: 'pending',
        });
        showToast(t('requestCreated', language), 'success');
      }
    } catch {
      showToast(t('error', language), 'error');
    }
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    try {
      const recognition = new SR();
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'ml' ? 'ml-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function speakText(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = language === 'kn' ? 'kn-IN' : language === 'ml' ? 'ml-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }

  const promptSuggestions = [
    { text: t('explainReminder', language), icon: Calendar },
    { text: t('contactFamily', language), icon: PhoneCall },
    { text: t('requestHelp', language), icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/70 px-4 pt-8 pb-4 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 text-lg sm:text-xl tracking-tight">
                {t('assistant', language)}
              </h1>
              <p className="text-[11px] text-teal-800 font-medium flex items-center gap-1">
                <ShieldCheck size={12} /> Privacy-First · Multilingual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4">
        {/* Safety & Non-Medical Notice */}
        <div className="bg-teal-50/70 border border-teal-200/60 rounded-2xl p-3 flex items-start gap-2 text-xs text-teal-900">
          <AlertCircle size={15} className="text-teal-700 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">{t('aiMedicalDisclaimer', language)}</p>
        </div>

        {/* Suggested Prompt Pills */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t('suggestedPrompts', language)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {promptSuggestions.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(p.text)}
                  className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 rounded-xl text-xs font-semibold text-stone-800 transition-all flex items-center gap-1.5 shadow-2xs active:scale-[0.98]"
                >
                  <Icon size={13} className="text-teal-600" />
                  <span>{p.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-sm sm:text-base leading-relaxed shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white rounded-br-xs'
                  : 'bg-white border border-stone-200/80 text-stone-900 rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>

            {/* Read Aloud Button for Assistant Responses */}
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-2 mt-1 ml-1">
                <button
                  onClick={() => speakText(msg.content)}
                  className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 font-medium px-2 py-0.5 rounded-md hover:bg-stone-100 transition-colors"
                  title={t('readAloud', language)}
                >
                  <Volume2 size={13} />
                  <span>{t('readAloud', language)}</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-stone-500 text-xs py-2">
            <Loader2 size={16} className="animate-spin text-teal-600" />
            <span>{t('aiThinking', language)}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Dock */}
      <div className="sticky bottom-14 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 z-20">
        <div className="max-w-md mx-auto">
          {/* Voice status or fallback message */}
          {listening && (
            <div className="flex items-center justify-between bg-red-50 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold mb-2 animate-pulse">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Listening in {language.toUpperCase()}...
              </span>
              <button onClick={stopListening} className="underline text-[11px]">
                {t('stopListening', language)}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Optional Microphone Button */}
            {speechSupported ? (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  listening
                    ? 'bg-red-600 text-white animate-pulse shadow-md'
                    : 'bg-stone-100 hover:bg-teal-50 text-stone-700 hover:text-teal-700'
                }`}
                aria-label={listening ? t('stopListening', language) : t('speak', language)}
              >
                {listening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            ) : null}

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder={t('typeMessage', language)}
              className="flex-1 bg-stone-100 focus:bg-white text-stone-900 border border-stone-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-2xl px-4 py-2.5 text-sm sm:text-base outline-none transition-all placeholder-stone-400"
            />

            {/* Send Button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              className="w-11 h-11 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all shadow-xs"
              aria-label={t('send', language)}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before creating Help Request */}
      {showConfirmModal && (
        <Modal title={t('confirmHelpRequest', language)} onClose={() => setShowConfirmModal(false)}>
          <div className="space-y-4 py-2">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <p className="text-stone-800 text-sm sm:text-base text-center leading-relaxed font-medium">
              {t('confirmHelpBody', language)}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
              >
                {t('no', language)}
              </button>
              <button
                onClick={handleConfirmHelpRequest}
                className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-xs transition-colors"
              >
                {t('yes', language)}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
