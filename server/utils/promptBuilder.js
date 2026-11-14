/**
 * Prompt builder utility for StudySpark
 * Generates strict, structured system and user prompts for LLMs
 */

export function buildSystemPrompt() {
  return `You are an expert educational content generator and pedagogical curriculum designer.
Your task is to transform provided study notes or topics into high-quality, accurate learning materials (Flashcards or Quizzes).

CRITICAL FORMATTING RULES:
1. Return ONLY valid, raw, unadorned JSON.
2. Do NOT wrap your output in markdown code fences like \`\`\`json or \`\`\`.
3. Do NOT include any conversational preamble, pleasantries, intro, or concluding remarks.
4. Follow the exact requested JSON schema with zero deviation.
5. Every field must be populated with meaningful content. Never return null, undefined, or empty values.
6. IDs must be sequential strings ("1", "2", "3", etc.).`;
}

export function buildUserPrompt({ input, mode, difficulty, count }) {
  const countNum = parseInt(count, 10) || 5;
  const targetDifficulty = difficulty || 'medium';

  const difficultyInstructions = {
    easy: 'Focus on direct recall, foundational definitions, key terminology, and core concepts.',
    medium: 'Focus on conceptual understanding, relationships between ideas, and practical application.',
    hard: 'Focus on in-depth analytical questions, edge cases, nuances, synthesis, and problem-solving scenarios.'
  };

  const difficultyGuide = difficultyInstructions[targetDifficulty.toLowerCase()] || difficultyInstructions.medium;

  if (mode === 'flashcards') {
    return `Generate exactly ${countNum} high-yield study flashcards based on the provided material.
Difficulty: ${targetDifficulty.toUpperCase()} (${difficultyGuide})

JSON Schema for flashcards:
{
  "type": "flashcards",
  "title": "Concise descriptive title of the topic",
  "items": [
    {
      "id": "1",
      "question": "Clear, specific question or concept prompt",
      "answer": "Accurate, concise, and educational explanation or definition"
    }
  ]
}

Specific rules for flashcards:
- Generate EXACTLY ${countNum} cards in the "items" array.
- "id" must be a string ("1", "2", ...).
- Keep questions focused on one main concept per card.
- Answers should be self-contained, high-yield, and easy to memorize.
- Base everything directly on the provided study material whenever relevant.

Study Material / Topic:
"""
${input.trim()}
"""`;
  }

  // Quiz mode
  return `Generate an interactive multiple-choice quiz with exactly ${countNum} questions based on the provided material.
Difficulty: ${targetDifficulty.toUpperCase()} (${difficultyGuide})

JSON Schema for quiz:
{
  "type": "quiz",
  "title": "Quiz: Concise descriptive title of the topic",
  "items": [
    {
      "id": "1",
      "question": "Clear, challenging multiple-choice question",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": 0,
      "explanation": "Clear explanation of why this answer is correct and why other options are incorrect."
    }
  ]
}

Specific rules for quizzes:
- Generate EXACTLY ${countNum} items in the "items" array.
- Each item MUST contain an "options" array with EXACTLY 4 distinct, plausible choices.
- "correctAnswer" MUST be an integer between 0 and 3 representing the zero-based index of the correct choice in "options".
- "explanation" MUST be informative and explain the pedagogical reasoning.
- Vary the index of the correct answer across the questions (do not always make 0 or 1 the correct answer).
- Base all questions and answers directly on the provided study material.

Study Material / Topic:
"""
${input.trim()}
"""`;
}

