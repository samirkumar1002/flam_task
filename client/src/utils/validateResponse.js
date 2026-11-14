/**
 * Client-side Schema Validator for StudySpark
 * Enforces strict zero-trust validation on all incoming AI payloads.
 * Prevents the application from crashing when receiving unexpected shapes.
 */

export function validateStudyResponse(data, expectedMode) {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      error: 'The AI response is not a valid structured object.'
    };
  }

  // 1. Verify Mode Match
  if (data.type !== expectedMode) {
    const error = `Schema mismatch: Expected content of type "${expectedMode}", but received "${data.type || 'undefined'}".`;
    if (import.meta.env.DEV) console.error('[validateResponse]', error, data);
    return { isValid: false, error };
  }

  // 2. Verify Title
  if (typeof data.title !== 'string' || !data.title.trim()) {
    const error = 'The generated material is missing a valid title.';
    if (import.meta.env.DEV) console.error('[validateResponse]', error, data);
    return { isValid: false, error };
  }

  // 3. Verify Items Array
  if (!Array.isArray(data.items) || data.items.length === 0) {
    const error = 'The AI generated an empty list of study items.';
    if (import.meta.env.DEV) console.error('[validateResponse]', error, data);
    return { isValid: false, error };
  }

  if (expectedMode === 'flashcards') {
    return validateFlashcardItems(data);
  }

  if (expectedMode === 'quiz') {
    return validateQuizItems(data);
  }

  return {
    isValid: false,
    error: `Unsupported study mode: "${expectedMode}".`
  };
}

function validateFlashcardItems(data) {
  const sanitizedItems = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const cardNum = i + 1;

    if (!item || typeof item !== 'object') {
      return {
        isValid: false,
        error: `Flashcard #${cardNum} is improperly structured.`
      };
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const answer = typeof item.answer === 'string' ? item.answer.trim() : '';

    if (!question) {
      return {
        isValid: false,
        error: `Flashcard #${cardNum} is missing a question prompt.`
      };
    }

    if (!answer) {
      return {
        isValid: false,
        error: `Flashcard #${cardNum} is missing an answer explanation.`
      };
    }

    sanitizedItems.push({
      id: item.id ? String(item.id) : String(cardNum),
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

function validateQuizItems(data) {
  const sanitizedItems = [];

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const qNum = i + 1;

    if (!item || typeof item !== 'object') {
      return {
        isValid: false,
        error: `Quiz question #${qNum} is not a valid object.`
      };
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    if (!question) {
      return {
        isValid: false,
        error: `Quiz question #${qNum} is missing question text.`
      };
    }

    if (!Array.isArray(item.options) || item.options.length !== 4) {
      return {
        isValid: false,
        error: `Quiz question #${qNum} must provide exactly 4 options. Found: ${Array.isArray(item.options) ? item.options.length : 'none'}.`
      };
    }

    const options = item.options.map((opt) => (typeof opt === 'string' ? opt.trim() : String(opt || '')));
    if (options.some((opt) => !opt)) {
      return {
        isValid: false,
        error: `Quiz question #${qNum} has one or more empty answer options.`
      };
    }

    const correctAnswer = Number(item.correctAnswer);
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      return {
        isValid: false,
        error: `Quiz question #${qNum} has an invalid correct answer index (${item.correctAnswer}). Must be 0, 1, 2, or 3.`
      };
    }

    const explanation = typeof item.explanation === 'string' && item.explanation.trim()
      ? item.explanation.trim()
      : `Option ${correctAnswer + 1} (${options[correctAnswer]}) is the correct answer.`;

    sanitizedItems.push({
      id: item.id ? String(item.id) : String(qNum),
      question,
      options,
      correctAnswer,
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

