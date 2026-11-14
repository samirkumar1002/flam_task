/**
 * Contextual Mock AI Generator for StudySpark
 * Provides intelligent, instant responses when no API key is supplied,
 * or allows simulating bad AI output (malformed JSON, wrong shape, server errors)
 * for testing assignment evaluation requirements.
 */

export function generateMockContent({ input, mode, difficulty = 'medium', count = 5 }) {
  const countNum = parseInt(count, 10) || 5;
  const inputLower = (input || '').toLowerCase();

  // Test simulation hooks for grading/demonstration:
  if (inputLower.includes('[test:malformed]')) {
    return '{ "type": "' + mode + '", "title": "Malformed Test", "items": [ { "id": 1, "question": ';
  }
  if (inputLower.includes('[test:wrong-shape]')) {
    return JSON.stringify({
      status: "unexpected_shape",
      content: "This output does not follow the required schema."
    });
  }
  if (inputLower.includes('[test:empty]')) {
    return JSON.stringify({
      type: mode,
      title: "Empty Study Set",
      items: []
    });
  }
  if (inputLower.includes('[test:error]')) {
    throw new Error('Simulated upstream AI provider 500 error.');
  }

  // Determine subject from input keywords
  let subject = 'General Concepts';
  let title = 'Study Set: ' + (input.slice(0, 30).trim() || 'Study Notes');

  if (inputLower.includes('react') || inputLower.includes('hook') || inputLower.includes('component')) {
    subject = 'React Fundamentals & Architecture';
    title = 'React Core Concepts & Modern Hooks';
  } else if (inputLower.includes('photosynthesis') || inputLower.includes('biology') || inputLower.includes('cell')) {
    subject = 'Cellular Biology & Photosynthesis';
    title = 'Biology: Photosynthesis & Cellular Respiration';
  } else if (inputLower.includes('history') || inputLower.includes('war') || inputLower.includes('treaty')) {
    subject = 'World War II & Historical Turning Points';
    title = 'History: Major Turning Points of World War II';
  } else if (inputLower.includes('algorithm') || inputLower.includes('data structure') || inputLower.includes('tree')) {
    subject = 'Computer Science: Data Structures';
    title = 'Data Structures: Trees, Graphs & Complexity';
  }

  if (mode === 'flashcards') {
    const pool = getFlashcardPool(subject, difficulty);
    // Slice to countNum or repeat with numbered variations if requested count > pool
    const items = [];
    for (let i = 0; i < countNum; i++) {
      const template = pool[i % pool.length];
      items.push({
        id: String(i + 1),
        question: i >= pool.length ? `${template.question} (Variation ${Math.floor(i / pool.length) + 1})` : template.question,
        answer: template.answer
      });
    }

    return JSON.stringify({
      type: 'flashcards',
      title,
      items
    });
  }

  // Quiz mode
  const pool = getQuizPool(subject, difficulty);
  const items = [];
  for (let i = 0; i < countNum; i++) {
    const template = pool[i % pool.length];
    items.push({
      id: String(i + 1),
      question: i >= pool.length ? `${template.question} (Part ${Math.floor(i / pool.length) + 1})` : template.question,
      options: [...template.options],
      correctAnswer: template.correctAnswer,
      explanation: template.explanation
    });
  }

  return JSON.stringify({
    type: 'quiz',
    title: `Quiz: ${title}`,
    items
  });
}

function getFlashcardPool(subject, difficulty) {
  if (subject.includes('React')) {
    return [
      {
        question: 'What is the Virtual DOM and how does React use it?',
        answer: 'The Virtual DOM is an in-memory representation of real DOM elements. React uses reconciliation and diffing algorithms to identify changes and batch minimal updates to the real browser DOM for high rendering performance.'
      },
      {
        question: 'What are the primary rules of React Hooks?',
        answer: '1. Only call hooks at the top level of functional components or custom hooks (never inside loops, conditions, or nested functions). 2. Only call hooks from React function components or custom hooks.'
      },
      {
        question: 'What is the purpose of useEffect dependency arrays?',
        answer: 'The dependency array tells React when to re-execute the effect. If omitted, it runs after every render. If empty ([]), it runs once on mount and unmount. If populated ([a, b]), it runs when any listed value changes.'
      },
      {
        question: 'How does useMemo differ from useCallback?',
        answer: 'useMemo caches the result of a computed calculation, whereas useCallback caches a function definition itself across renders to prevent unnecessary re-creations.'
      },
      {
        question: 'What is React Context and when should it be used?',
        answer: 'React Context provides a way to pass data through the component tree without manually passing props at every level ("prop drilling"). It is ideal for global state like current authenticated user, theme, or locale.'
      },
      {
        question: 'What is an AbortController and how does it prevent race conditions in useEffect?',
        answer: 'AbortController allows canceling in-flight HTTP requests when a component unmounts or before a new request is dispatched, preventing stale responses from overwriting newer state.'
      },
      {
        question: 'What is the significance of the key prop in React lists?',
        answer: 'Keys provide a stable identity for list items across renders, allowing React to track which items were added, removed, or reordered efficiently without re-rendering every sibling node.'
      }
    ];
  }

  if (subject.includes('Biology')) {
    return [
      {
        question: 'What is the primary chemical equation for oxygenic photosynthesis?',
        answer: '6CO2 + 6H2O + light energy -> C6H12O6 (glucose) + 6O2. Plants convert atmospheric carbon dioxide and water into chemical energy stored in glucose.'
      },
      {
        question: 'Where do the light-dependent reactions occur within a plant cell?',
        answer: 'They take place across the thylakoid membrane inside chloroplasts, where chlorophyll pigments absorb photons to generate ATP and NADPH.'
      },
      {
        question: 'What is the Calvin Cycle and what enzyme catalyzes its primary carbon-fixing step?',
        answer: 'The Calvin Cycle (light-independent reaction) takes place in the chloroplast stroma to synthesize G3P sugars from CO2. The key enzyme catalyzing the fixation of CO2 to RuBP is RuBisCO.'
      },
      {
        question: 'How do cellular respiration and photosynthesis complement one another?',
        answer: 'Photosynthesis produces glucose and oxygen which are utilized as reactants in aerobic cellular respiration, while respiration releases CO2 and H2O which are used by plants for photosynthesis.'
      },
      {
        question: 'What role does ATP synthase play during phosphorylation?',
        answer: 'ATP synthase is a membrane-bound protein motor driven by a proton gradient (chemiosmosis), synthesizing ATP from ADP and inorganic phosphate.'
      }
    ];
  }

  // General default pool
  return [
    {
      question: 'What is active recall and why is it effective for retention?',
      answer: 'Active recall involves actively stimulating memory retrieval during the learning process (e.g. testing yourself with flashcards) rather than passively re-reading. It reinforces neural pathways and long-term retention.'
    },
    {
      question: 'How does spaced repetition prevent the "forgetting curve"?',
      answer: 'Spaced repetition schedules reviews at increasing intervals right when a concept is about to be forgotten, systematically flattening Ebbinghaus’s forgetting curve and transferring knowledge into long-term memory.'
    },
    {
      question: 'What is the Feynman Technique for mastering complex concepts?',
      answer: '1. Choose a concept. 2. Teach it to a sixth grader using simple language and analogies. 3. Identify knowledge gaps when explanations become convoluted. 4. Review source material and simplify.'
    },
    {
      question: 'What is the difference between procedural and declarative knowledge?',
      answer: 'Declarative knowledge involves facts, events, and static data ("knowing that"), while procedural knowledge involves knowing how to perform actions, procedures, and skills ("knowing how").'
    },
    {
      question: 'Why does chunking improve working memory capacity?',
      answer: 'Working memory can hold roughly 4–7 independent items at a time. Chunking organizes individual bits of information into coherent semantic groups, vastly increasing effective storage capacity.'
    }
  ];
}

function getQuizPool(subject, difficulty) {
  if (subject.includes('React')) {
    return [
      {
        question: 'Which React hook is designed to manage local component state across renders?',
        options: ['useState', 'useEffect', 'useMemo', 'useRef'],
        correctAnswer: 0,
        explanation: 'useState declares a state variable and provides a setter function that triggers a component re-render when called.'
      },
      {
        question: 'What happens if you omit the dependency array in a useEffect hook call?',
        options: [
          'The effect only runs once when the component mounts',
          'The effect runs after every single render of the component',
          'The effect is queued and never executes',
          'React throws a compile-time syntax error'
        ],
        correctAnswer: 1,
        explanation: 'When no dependency array is passed to useEffect, React executes the effect function after the initial mount and after every subsequent update/render.'
      },
      {
        question: 'Why should you avoid mutating state directly in React (e.g., state.count = 5)?',
        options: [
          'JavaScript throws a read-only variable assignment error',
          'Direct mutation does not trigger reconciliation or re-render, leading to desynced UI',
          'Direct mutation breaks the browser DOM event loop',
          'React only supports immutable primitive types'
        ],
        correctAnswer: 1,
        explanation: 'React relies on shallow equality comparison (Object.is) of state references. Directly mutating the object does not change its reference, so React assumes no change occurred and skips re-rendering.'
      },
      {
        question: 'Which hook should you use to preserve a mutable value across renders without triggering a re-render when updated?',
        options: ['useCallback', 'useState', 'useRef', 'useId'],
        correctAnswer: 2,
        explanation: 'useRef returns a mutable object with a .current property. Modifying .current does not cause a re-render, making it ideal for DOM nodes, timers, and previous state tracking.'
      },
      {
        question: 'How can you protect a frontend application from race conditions caused by slow network responses?',
        options: [
          'Use synchronous XMLHttpRequests to block execution',
          'Use AbortController to cancel previous in-flight requests or track request IDs/timestamps',
          'Disable HTTP caching headers on all endpoints',
          'Increase the server response timeout to 60 seconds'
        ],
        correctAnswer: 1,
        explanation: 'AbortController signals the browser to abort pending fetch requests when a new request is dispatched. Pairing this with a monotonic request counter or timestamp ensures stale responses are discarded.'
      }
    ];
  }

  // General default quiz pool
  return [
    {
      question: 'Which study method leverages the psychological spacing effect to maximize long-term retention?',
      options: ['Cramming', 'Spaced Repetition', 'Passive Highlighting', 'Continuous Re-reading'],
      correctAnswer: 1,
      explanation: 'Spaced repetition strategically spaces out review sessions over time, forcing active retrieval right before forgetting occurs.'
    },
    {
      question: 'In cognitive psychology, what is the term for grouping related pieces of information into a single unit?',
      options: ['Priming', 'Chunking', 'Rehearsal', 'Encoding specificity'],
      correctAnswer: 1,
      explanation: 'Chunking aggregates individual items into meaningful groups (like grouping digits into phone number segments), optimizing working memory.'
    },
    {
      question: 'Which practice has been proven by cognitive science to be more effective than passive review?',
      options: ['Active Recall through self-testing', 'Color-coded highlighting', 'Re-reading chapters three times', 'Listening to lectures while sleeping'],
      correctAnswer: 0,
      explanation: 'Active retrieval practice forces the brain to retrieve facts from memory, strengthening associative neural pathways significantly more than passive exposure.'
    },
    {
      question: 'What is Bloom’s Taxonomy primarily used for in education?',
      options: [
        'Calculating standardized test percentiles',
        'Classifying educational learning objectives by levels of complexity and specificity',
        'Diagnosing attention deficit disorders',
        'Measuring physical classroom ergonomics'
      ],
      correctAnswer: 1,
      explanation: 'Bloom’s Taxonomy classifies cognitive objectives from Remember and Understand through Apply, Analyze, Evaluate, and Create.'
    },
    {
      question: 'What is the primary benefit of metacognition in self-directed study?',
      options: [
        'It speeds up typing speed on digital notes',
        'It enables learners to monitor, evaluate, and adapt their own learning strategies',
        'It replaces the need for factual memorization',
        'It guarantees 100% test accuracy'
      ],
      correctAnswer: 1,
      explanation: 'Metacognition is "thinking about thinking" — recognizing what you understand versus where your comprehension gaps lie so you can allocate study time effectively.'
    }
  ];
}

