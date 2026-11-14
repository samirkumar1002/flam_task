import { Router } from 'express';
import { generateStudyMaterial } from '../services/llmService.js';
import { extractCleanJsonString, validateStudyData } from '../utils/validateStudyData.js';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const hasKey = Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your_api_key_here');

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiProvider: provider,
    hasApiKey: hasKey,
    model: process.env.AI_MODEL || 'default'
  });
});

/**
 * Main generation endpoint
 * POST /api/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { input, mode = 'flashcards', difficulty = 'medium', count = 5 } = req.body || {};

    // 1. Validate Input
    if (!input || typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide study notes, a topic, or concepts to generate materials.',
        code: 'MISSING_INPUT'
      });
    }

    if (input.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Study material input is too brief. Please provide at least a few words or a complete topic.',
        code: 'INPUT_TOO_SHORT'
      });
    }

    if (input.length > 25000) {
      return res.status(400).json({
        success: false,
        error: 'Input exceeds maximum allowed length (25,000 characters). Please condense your notes.',
        code: 'INPUT_TOO_LONG'
      });
    }

    // 2. Validate Mode
    const validModes = ['flashcards', 'quiz'];
    const normalizedMode = String(mode).toLowerCase().trim();
    if (!validModes.includes(normalizedMode)) {
      return res.status(400).json({
        success: false,
        error: `Invalid mode "${mode}". Supported modes are 'flashcards' and 'quiz'.`,
        code: 'INVALID_MODE'
      });
    }

    // 3. Validate Difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    const normalizedDifficulty = String(difficulty).toLowerCase().trim();
    if (!validDifficulties.includes(normalizedDifficulty)) {
      return res.status(400).json({
        success: false,
        error: `Invalid difficulty "${difficulty}". Supported values: 'easy', 'medium', 'hard'.`,
        code: 'INVALID_DIFFICULTY'
      });
    }

    // 4. Validate Count
    const parsedCount = parseInt(count, 10);
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 30) {
      return res.status(400).json({
        success: false,
        error: 'Item count must be a number between 1 and 30.',
        code: 'INVALID_COUNT'
      });
    }

    // 5. Invoke LLM Service
    let rawOutputText;
    try {
      rawOutputText = await generateStudyMaterial({
        input: input.trim(),
        mode: normalizedMode,
        difficulty: normalizedDifficulty,
        count: parsedCount
      });
    } catch (llmError) {
      console.error('[Generate Route] LLM provider error:', llmError);
      return res.status(502).json({
        success: false,
        error: llmError.message || 'Failed to communicate with the AI provider.',
        code: 'LLM_PROVIDER_ERROR'
      });
    }

    if (!rawOutputText || typeof rawOutputText !== 'string' || !rawOutputText.trim()) {
      return res.status(502).json({
        success: false,
        error: 'The AI provider returned an empty response. Please try again.',
        code: 'EMPTY_AI_RESPONSE'
      });
    }

    // 6. Clean and Parse JSON
    const cleanedJsonStr = extractCleanJsonString(rawOutputText);
    let parsedJson;

    try {
      parsedJson = JSON.parse(cleanedJsonStr);
    } catch (parseError) {
      console.error('[Generate Route] Malformed JSON from AI:', cleanedJsonStr);
      return res.status(422).json({
        success: false,
        error: 'The AI generated an invalid JSON response structure. Please retry.',
        code: 'MALFORMED_AI_JSON',
        details: parseError.message
      });
    }

    // 7. Validate Structure & Schema
    const validationResult = validateStudyData(parsedJson, normalizedMode);
    if (!validationResult.isValid) {
      console.error('[Generate Route] Schema validation failed:', validationResult.error);
      return res.status(422).json({
        success: false,
        error: `AI output schema mismatch: ${validationResult.error}`,
        code: 'INVALID_AI_SCHEMA'
      });
    }

    // 8. Return Validated & Sanitized Data
    return res.status(200).json({
      success: true,
      data: validationResult.sanitizedData
    });
  } catch (error) {
    console.error('[Generate Route] Unhandled exception:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your study material.',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;

