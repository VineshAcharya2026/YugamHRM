import { GoogleGenAI } from '@google/genai';

/**
 * Try in order: widely available Developer API (AI Studio) models.
 * @see https://ai.google.dev/gemini-api/docs/models/gemini
 */
const MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
] as const;

const YUGA_SYSTEM = `You are "Yuga", the Elite Career Counselor at YugamCloud.ai.
Your goal is to guide students and professionals into high-paying IT roles.

OFFERED COURSES:
- Snowflake Data Cloud (Architecture to Analytics)
- Agentic AI & LLMs (Autonomous Agents, LangChain)
- SAP ABAP on HANA (RICEFW, OData)
- Java Full Stack (Spring Boot, React, Microservices)
- DevOps & AWS (CI/CD, Kubernetes)
- Python & Data Science (Predictive Modeling)
- Digital Marketing Pro (SEO, Analytics)

CORE STRENGTHS:
- 13+ years of training excellence.
- 100% Placement Guarantee.
- Based in Marathahalli, Bengaluru.
- HR Contact: HR@yugamcloud.online.
- 20,000+ success stories.

BEHAVIOR:
- Be professional, encouraging, and knowledgeable about IT trends.
- If asked about non-IT topics, politely redirect to IT career paths.
- For specific batch dates or fees, suggest "Connecting via WhatsApp" for the latest schedule.
- Keep responses concise (under 3 sentences unless explaining a curriculum).
- Use bullet points for curriculum summaries.`;

type GenContentResponse = {
  text?: string;
  promptFeedback?: { blockReason?: string };
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
};

/** Pull plain text from @google/genai GenerateContentResponse (getter + candidates fallback). */
export function extractGeminiText(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null;
  const r = response as GenContentResponse;
  const viaGetter = r.text;
  if (typeof viaGetter === 'string' && viaGetter.trim()) return viaGetter.trim();
  const parts = r.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const joined = parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .join('')
    .trim();
  return joined || null;
}

function blockedOrEmptyUserHint(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null;
  const r = response as GenContentResponse;
  const reason = r.promptFeedback?.blockReason;
  if (reason) {
    return 'That message could not be processed by the assistant. Try a shorter, neutral question, or reach us on WhatsApp for admissions.';
  }
  const c0 = r.candidates?.[0];
  if (c0?.finishReason === 'SAFETY' || c0?.finishReason === 'RECITATION') {
    return 'The assistant could not answer that in full. Please rephrase, or contact admissions on WhatsApp for details.';
  }
  return null;
}

export function formatGeminiErrorForLog(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/** Safe short message for the chat UI (no raw key / stack). */
export function userFacingGeminiError(err: unknown): string {
  const raw = formatGeminiErrorForLog(err).toLowerCase();
  if (
    raw.includes('api_key') ||
    raw.includes('api key') ||
    raw.includes('invalid api') ||
    raw.includes('permission_denied') ||
    raw.includes('403')
  ) {
    return 'The AI service rejected the request (invalid or restricted API key). Check NEXT_PUBLIC_GEMINI_API_KEY / GEMINI_API_KEY, rebuild the site, and confirm the key is allowed for the Gemini API in Google AI Studio.';
  }
  if (raw.includes('quota') || raw.includes('resource_exhausted') || raw.includes('429')) {
    return 'The AI quota was exceeded. Try again in a few minutes, or message admissions on WhatsApp.';
  }
  if (raw.includes('404') || raw.includes('not found') || raw.includes('not_found')) {
    return 'The configured AI model is not available for this key. The site maintainers may need to update model names in yugaGemini.ts.';
  }
  if (raw.includes('fetch') || raw.includes('network') || raw.includes('failed to fetch')) {
    return 'Network error talking to the AI service. Check your connection, disable strict blockers, and try again.';
  }
  return "We couldn't reach the AI service just now. Try again shortly, or message our admissions desk on WhatsApp for a human counselor.";
}

export async function generateYugaReply(ai: GoogleGenAI, userText: string): Promise<string> {
  let lastError: unknown;
  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userText,
        config: { systemInstruction: YUGA_SYSTEM },
      });
      const text = extractGeminiText(response);
      if (text) return text;
      const blockedHint = blockedOrEmptyUserHint(response);
      if (blockedHint) return blockedHint;
      lastError = new Error(`Empty response from ${model}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error('All Gemini models failed');
}
