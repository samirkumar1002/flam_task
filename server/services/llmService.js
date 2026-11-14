/**
 * Unified LLM Service for StudySpark
 * Handles communication with Gemini, Groq, OpenAI, or the fallback Mock provider.
 * Never leaks API keys to the client.
 */

import { buildSystemPrompt, buildUserPrompt } from '../utils/promptBuilder.js';
import { generateMockContent } from './mockGenerator.js';

export async function generateStudyMaterial({ input, mode, difficulty, count }) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const configuredModel = process.env.AI_MODEL;

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({ input, mode, difficulty, count });

  // If mock mode is explicitly chosen or if no API key is provided, use the intelligent mock generator
  if (provider === 'mock' || !apiKey || apiKey === 'your_api_key_here') {
    console.log(`[LLM Service] Using intelligent fallback mock engine (Provider: ${provider}, Key: ${apiKey ? 'Set' : 'Unset'})`);
    // Simulate slight natural latency (350ms) for realism
    await new Promise((resolve) => setTimeout(resolve, 350));
    return generateMockContent({ input, mode, difficulty, count });
  }

  console.log(`[LLM Service] Requesting content from provider: ${provider}`);

  if (provider === 'gemini') {
    return callGemini({ apiKey, model: configuredModel || 'gemini-1.5-flash', systemPrompt, userPrompt });
  } else if (provider === 'groq') {
    return callGroq({ apiKey, model: configuredModel || 'llama-3.3-70b-versatile', systemPrompt, userPrompt });
  } else if (provider === 'openai') {
    return callOpenAI({ apiKey, model: configuredModel || 'gpt-4o-mini', systemPrompt, userPrompt });
  } else {
    throw new Error(`Unsupported AI_PROVIDER: "${provider}". Must be one of: gemini, groq, openai, mock.`);
  }
}

/**
 * Calls Google Gemini API via REST
 */
async function callGemini({ apiKey, model, systemPrompt, userPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `Gemini API returned status ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error && parsed.error.message) {
        errorMessage = `Gemini: ${parsed.error.message}`;
      }
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }

  const jsonResponse = await response.json();
  const textOutput = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Gemini API returned an empty response candidate.');
  }

  return textOutput;
}

/**
 * Calls Groq API via REST (OpenAI-compatible)
 */
async function callGroq({ apiKey, model, systemPrompt, userPrompt }) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `Groq API returned status ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error && parsed.error.message) {
        errorMessage = `Groq: ${parsed.error.message}`;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMessage);
  }

  const jsonResponse = await response.json();
  const textOutput = jsonResponse?.choices?.[0]?.message?.content;

  if (!textOutput) {
    throw new Error('Groq API returned an empty message.');
  }

  return textOutput;
}

/**
 * Calls OpenAI API via REST
 */
async function callOpenAI({ apiKey, model, systemPrompt, userPrompt }) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `OpenAI API returned status ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error && parsed.error.message) {
        errorMessage = `OpenAI: ${parsed.error.message}`;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMessage);
  }

  const jsonResponse = await response.json();
  const textOutput = jsonResponse?.choices?.[0]?.message?.content;

  if (!textOutput) {
    throw new Error('OpenAI API returned an empty message.');
  }

  return textOutput;
}

