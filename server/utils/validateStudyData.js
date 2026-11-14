/**
 * Server-side study data parsing and validation utility
 * Enforces strict schemas and protects the application from malformed LLM responses
 */

/**
 * Strips markdown code fences or conversational text wrapper around JSON
 * @param {string} text
 * @returns {string}
 */
export function extractCleanJsonString(text) {
  if (typeof text !== 'string') return '';

  let cleaned = text.trim();

  // Remove markdown code fences like ```json ... ``` or ``` ... ```
  const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = cleaned.match(codeBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  } else {
    // If there's preamble or postamble, locate the first '{' and last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  return cleaned;
}

/**
 * Validates flashcard data structure
 * @param {object} data
 * @returns {{ isValid: boolean, error?: string, sanitizedData?: object }}
 */
function validateFlashcards(data) {
  if (data.type !== 'flashcards') {
    return {
      isValid: false,
      error: `Expected response type 'flashcards' but received '${data.type || 'undefined'}'.`
    };
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return {
      isValid: false,
      error: 'Invalid or missing "title" in flashcards response.'
    };
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return {
      isValid: false,
      error: 'Flashcards "items" must be a non-empty array.'
    };
  }

  const sanitizedItems = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const indexLabel = `Flashcard #${i + 1}`;

    if (!item || typeof item !== 'object') {
      return { isValid: false, error: `${indexLabel} is not a valid object.` };
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const answer = typeof item.answer === 'string' ? item.answer.trim() : '';

    if (!question) {
      return { isValid: false, error: `${indexLabel} is missing a valid 'question'.` };
    }

    if (!answer) {
      return { isValid: false, error: `${indexLabel} is missing a valid 'answer'.` };
    }

    sanitizedItems.push({
      id: item.id ? String(item.id) : String(i + 1),
      question,
      answer
    });
  }

  return {
    isValid: true,
    sanitizedData: {
      type: 'flashcards',
      title: data.title.trim(),
      items: sanitizedItems
    }
  };
}

/**
 * Validates quiz data structure
 * @param {object} data
 * @returns {{ isValid: boolean, error?: string, sanitizedData?: object }}
 */
function validateQuiz(data) {
  if (data.type !== 'quiz') {
    return {
      isValid: false,
      error: `Expected response type 'quiz' but received '${data.type || 'undefined'}'.`
    };
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return {
      isValid: false,
      error: 'Invalid or missing "title" in quiz response.'
    };
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return {
      isValid: false,
      error: 'Quiz "items" must be a non-empty array.'
    };
  }

  const sanitizedItems = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const indexLabel = `Quiz Question #${i + 1}`;

    if (!item || typeof item !== 'object') {
      return { isValid: false, error: `${indexLabel} is not a valid object.` };
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    if (!question) {
      return { isValid: false, error: `${indexLabel} is missing a valid 'question'.` };
    }

    if (!Array.isArray(item.options) || item.options.length !== 4) {
      return {
        isValid: false,
        error: `${indexLabel} must have exactly 4 choices in 'options', got ${Array.isArray(item.options) ? item.options.length : 'non-array'}.`
      };
    }

    const sanitizedOptions = item.options.map((opt) => (typeof opt === 'string' ? opt.trim() : String(opt || '')));
    if (sanitizedOptions.some((opt) => !opt)) {
      return {
        isValid: false,
        error: `${indexLabel} contains empty option text.`
      };
    }

    // Validate correctAnswer index (0 to 3)
    const correctAnswerNum = Number(item.correctAnswer);
    if (!Number.isInteger(correctAnswerNum) || correctAnswerNum < 0 || correctAnswerNum > 3) {
      return {
        isValid: false,
        error: `${indexLabel} has invalid 'correctAnswer' index (${item.correctAnswer}). Must be an integer 0-3.`
      };
    }

    const explanation = typeof item.explanation === 'string' && item.explanation.trim()
      ? item.explanation.trim()
      : `Option ${correctAnswerNum + 1} (${sanitizedOptions[correctAnswerNum]}) is the correct answer.`;

    sanitizedItems.push({
      id: item.id ? String(item.id) : String(i + 1),
      question,
      options: sanitizedOptions,
      correctAnswer: correctAnswerNum,
      explanation
    });
  }

  return {
    isValid: true,
    sanitizedData: {
      type: 'quiz',
      title: data.title.trim(),
      items: sanitizedItems
    }
  };
}

/**
 * Validates parsed study data according to expected mode
 * @param {object} rawJson
 * @param {'flashcards' | 'quiz'} expectedMode
 */
export function validateStudyData(rawJson, expectedMode) {
  if (!rawJson || typeof rawJson !== 'object') {
    return {
      isValid: false,
      error: 'The AI output could not be parsed into a structured object.'
    };
  }

  if (expectedMode === 'flashcards') {
    return validateFlashcards(rawJson);
  } else if (expectedMode === 'quiz') {
    return validateQuiz(rawJson);
  }

  return {
    isValid: false,
    error: `Unknown study mode: ${expectedMode}. Expected 'flashcards' or 'quiz'.`
  };
}

