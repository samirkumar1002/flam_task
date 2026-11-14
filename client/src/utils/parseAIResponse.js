/**
 * Utility to safely extract and parse JSON responses from AI
 * Protects against code fences, preamble text, or malformed JSON
 */

export function extractJsonFromText(rawText) {
  if (typeof rawText !== 'string') {
    return { success: false, error: 'Input is not a string.' };
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = cleaned.match(codeBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  } else {
    // If surrounded by preamble/postamble, isolate outer JSON braces
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  try {
    const parsed = JSON.parse(cleaned);
    return { success: true, data: parsed };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[parseAIResponse] JSON.parse failed. Raw payload:', rawText);
      console.warn('[parseAIResponse] Parse error details:', err.message);
    }
    return {
      success: false,
      error: `Could not parse AI response as valid JSON: ${err.message}`,
      raw: rawText
    };
  }
}

