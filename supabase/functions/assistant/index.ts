import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SYSTEM_PROMPT = `You are a compassionate, multilingual assistant for CareConnect, a wellbeing app for older adults.

Your core rules:
1. Communicate kindly, clearly and briefly in the user's selected language.
2. Respect the user's independence and dignity at all times.
3. If a request is ambiguous, ask ONE clear follow-up question.
4. NEVER invent health measurements, appointment times, or caregiver actions.
5. NEVER claim an alert was sent unless the backend confirmed it.
6. NEVER diagnose medical conditions or recommend medication changes.
7. For urgent or potentially dangerous symptoms, always advise seeking emergency medical help.
8. Ask permission before sharing any personal details.
9. Collect minimum necessary information only.
10. Keep responses brief and easy to understand — avoid medical jargon.
11. If the user wants to request help, confirm their intention first.

Supported intents you can signal:
- general_question: answering questions
- explain_reminder: explaining a scheduled reminder
- contact_caregiver: user wants to reach their caregiver
- create_help_request: user explicitly wants to send a help request (confirmed)

Respond in the same language the user writes in. If they write in Kannada, respond in Kannada. Same for Malayalam, Hindi, or English.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { message, language, seniorId } = body;

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate that the seniorId matches the authenticated user (server-side check)
    if (seniorId && seniorId !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      // Fallback response when OpenAI is not configured
      const fallback = language === 'kn'
        ? 'ಕ್ಷಮಿಸಿ, ಸಹಾಯಕ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ನಿಮ್ಮ ಆರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
        : language === 'ml'
        ? 'ക്ഷമിക്കൂ, സഹായി ഇപ്പോൾ ലഭ്യമല്ല. നേരിട്ട് നിങ്ങളുടെ പരിചരിക്കുന്ന ആളെ ബന്ധപ്പെടൂ.'
        : language === 'hi'
        ? 'क्षमा करें, सहायक अभी उपलब्ध नहीं है। कृपया अपने देखभालकर्ता से सीधे संपर्क करें।'
        : "I'm sorry, I'm temporarily unavailable. Please contact your caregiver directly or use the Help Requests section.";

      return new Response(JSON.stringify({ reply: fallback, action: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const langName = language === 'kn' ? 'Kannada' : language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English';

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT + `\n\nThe user's preferred language is: ${langName}. Always respond in ${langName}.`,
          },
          { role: 'user', content: message },
        ],
      }),
    });

    if (!resp.ok) {
      throw new Error(`OpenAI error: ${resp.status}`);
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) throw new Error('Empty response from AI');

    // Detect action intent from message keywords (server-side, not AI-driven)
    const lower = message.toLowerCase();
    const wantsHelp = lower.includes('help') || lower.includes('sos') || lower.includes('urgent')
      || lower.includes('ಸಹಾಯ') || lower.includes('സഹായം') || lower.includes('मदद');
    const action = wantsHelp ? 'create_help_request' : null;

    return new Response(JSON.stringify({ reply, action }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Assistant error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', reply: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
