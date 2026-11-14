# StudySpark — AI-Powered Active Learning Assistant

> **Frontend Internship Assignment Submission**  
> An interactive educational platform that compiles unstructured study notes and topics into curriculum-grade **Active Recall Flashcards** and **Pedagogical Quizzes** through zero-trust structured AI outputs and defensive frontend architecture.

---

## Table of Contents
1. [Core Philosophy & Why Not a Chatbot](#1-core-philosophy--why-not-a-chatbot)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [Key Features & State Mechanics](#3-key-features--state-mechanics)
4. [Structured Output & Dual-Layer Validation Pipeline](#4-structured-output--dual-layer-validation-pipeline)
5. [Stale Response & Race Condition Mitigation](#5-stale-response--race-condition-mitigation)
6. [Resilience & Error Handling Matrix](#6-resilience--error-handling-matrix)
7. [Tech Stack & Engineering Rationale](#7-tech-stack--engineering-rationale)
8. [Setup, Environment & Zero-Key Evaluation](#8-setup-environment--zero-key-evaluation)
9. [Built-in Assignment Robustness Triggers](#9-built-in-assignment-robustness-triggers)
10. [Accessibility & UX Considerations](#10-accessibility--ux-considerations)
11. [Live Interview Discussion Guide](#11-live-interview-discussion-guide)
12. [Known Limitations & Future Roadmap](#12-known-limitations--future-roadmap)
13. [Time Spent & Development Methodology](#13-time-spent--development-methodology)

---

## 1. Core Philosophy & Why Not a Chatbot

### The Flaw with Chatbots in Education
Most generative AI applications for education force users into a chat interface. Cognitive psychology demonstrates that conversational chat leads to **passive reading**, illusions of competence, and fragmented context. 

### The StudySpark Paradigm
StudySpark treats the Large Language Model not as a conversationalist, but as a **deterministic curriculum compiler**. 
- **Input**: Free-form lecture transcripts, textbook excerpts, or topic prompts.
- **Processing**: The backend forces the LLM to output pure, unformatted JSON adhering to a strict pedagogical schema.
- **Output**: The frontend ingests this validated schema into a **stateful, interactive active recall system**—featuring 3D flashcards, self-grading mastery metrics, and multiple-choice quizzes with targeted mistake-retry sessions.

---

## 2. End-to-End System Architecture

To ensure strict security and prevent leaking API credentials in client-side bundles, all requests are routed through a dedicated Node/Express proxy.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER / FRONTEND (Vite + React)               │
│                                                                        │
│  [StudyInput View] ──> [useStudyGenerator Hook]                        │
│                              │                                         │
│                              ├── AbortController.abort() (cancels old) │
│                              ├── Monotonic RequestID: latestId++       │
│                              └── Dispatches fetch('/api/generate')     │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ POST (input, mode, difficulty, count)
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND PROXY (Node.js + Express)               │
│                                                                        │
│  1. Input Boundary Check (Length 3-25,000 chars, valid mode/diff)      │
│  2. Strict Prompt Formulation (Enforces JSON, forbids markdown fences) │
│  3. Upstream LLM Dispatch (Gemini / Groq / OpenAI / Mock Engine)       │
│  4. Extraction & Stripping (Regex cleaning of stray markdown wrappers) │
│  5. Layer 1 Schema Validation (Type assertions, required fields)       │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ Clean, Validated JSON Payload
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DEFENSIVE CLIENT INGESTION                      │
│                                                                        │
│  1. Stale Response Check: (currentRequestId === latestRequestIdRef)   │
│  2. Layer 2 Schema Validation: validateStudyResponse()                 │
│  3. Stateful Render: <FlashcardDeck /> or <Quiz />                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Features & State Mechanics

### Interactive 3D Flashcards
- **Focus Mode**: Renders exactly one card at a time with real-time index counters (`Card 3 of 10`) and animated progress bars.
- **3D Flip Mechanics**: Utilizes hardware-accelerated CSS perspective (`perspective: 1200px`, `transform-style: preserve-3d`, `rotateY(180deg)`) for a fluid 60fps card flip without external animation bundle overhead.
- **Active Recall Self-Grading**: Users tag cards as **"Know it"** (mastered) or **"Review again"** (needs work).
- **Targeted "Review Again" Mode**: Dynamically slices the deck to show *only* cards marked for review. If all cards are cleared, it transitions to a positive celebration empty state.
- **Accessible Keyboard Navigation**:
  - `Space` → Flips the card.
  - `Right Arrow (→)` → Advances to next card.
  - `Left Arrow (←)` → Moves to previous card.
  - *Isolated from inputs*: The custom hook `useKeyboardNavigation` checks active DOM elements and automatically disables shortcuts when the user is typing in the textarea or input fields.

###  Comprehensive Pedagogical Quiz
- **Discrete Question Progression**: Questions are answered sequentially, preserving cognitive focus.
- **Instant Pedagogical Feedback**:
  - Selecting an answer locks the question to prevent post-hoc changes.
  - Correct answer highlights green with checkmark badge.
  - Incorrect selection highlights red with cross badge.
  - An explanatory rationale appears immediately below the question explaining *why* the choice is correct.
- **Answer Preservation**: Users can navigate backwards using "Previous" to review prior explanations without losing recorded answers.
- **Comprehensive Results Screen**:
  - Final score fraction ($8/10$) and percentage ($80\%$).
  - Correct and incorrect totals.
  - Performance tier feedback brackets ($90\%+$: Outstanding, $70–89\%$: Great work, $50–69\%$: Keep practicing, $<50\%$: Review material).
  - Expandable question-by-question review breakdown.
- **Targeted "Retry Incorrect Answers" Mode**: Spawns a new targeted quiz session containing *exclusively* the questions the user got wrong.

---

## 4. Structured Output & Dual-Layer Validation Pipeline

### Zero-Trust Principle
LLMs are probabilistic by nature and can output malformed JSON, preamble pleasantries, or unexpected schemas. StudySpark applies a **dual-layer zero-trust validation pipeline**:
1. **Server-Side Sanitization** (`server/utils/validateStudyData.js`)
2. **Client-Side Schema Verification** (`client/src/utils/validateResponse.js`)

### Strict JSON Schemas

#### Flashcards Schema
```json
{
  "type": "flashcards",
  "title": "React Architecture & Modern Hooks",
  "items": [
    {
      "id": "1",
      "question": "What is the primary purpose of the Virtual DOM?",
      "answer": "An in-memory lightweight representation of real DOM elements that React reconciles using diffing algorithms to calculate minimal DOM mutations."
    }
  ]
}
```

#### Quiz Schema
```json
{
  "type": "quiz",
  "title": "Quiz: Cellular Respiration & Photosynthesis",
  "items": [
    {
      "id": "1",
      "question": "Where do the light-dependent reactions take place inside a plant cell?",
      "options": [
        "Chloroplast Stroma",
        "Thylakoid Membrane",
        "Mitochondrial Matrix",
        "Outer Cell Wall"
      ],
      "correctAnswer": 1,
      "explanation": "Light-dependent reactions occur across the thylakoid membranes where chlorophyll absorbs photons to drive ATP and NADPH synthesis."
    }
  ]
}
```

### Exact Validation Criteria
- `type` must strictly match the requested mode (`'flashcards'` or `'quiz'`).
- `title` must be a non-empty string.
- `items` must be a non-empty array (`length > 0`).
- **Flashcard Items**: Each item must have a valid `id`, a non-empty `question`, and a non-empty `answer`.
- **Quiz Items**: Each item must have a non-empty `question`, **an array of exactly 4 non-empty string options**, an integer `correctAnswer` strictly between `0` and `3`, and an informative `explanation`.

---

## 5. Stale Response & Race Condition Mitigation

### The Problem
When a user submits notes, regrets a setting (e.g. wants 10 items instead of 5), and immediately clicks "Generate" again, network latency can cause the **first (slower) request to resolve after the second (faster) request**, overwriting newer state with stale data.

### The Solution: AbortController + Monotonic Request IDs
StudySpark implements a two-fold mitigation in `useStudyGenerator.js`:

```javascript
// 1. In-flight cancellation
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}

// 2. Monotonic Request Counter
latestRequestIdRef.current += 1;
const currentRequestId = latestRequestIdRef.current;

const controller = new AbortController();
abortControllerRef.current = controller;

try {
  const result = await generateStudyContent({ ..., signal: controller.signal });

  // 3. Race condition verification
  if (currentRequestId !== latestRequestIdRef.current) {
    return; // Discard superseded response silently
  }

  setGeneratedData(result);
} catch (err) {
  if (err.name === 'AbortError') return; // Cancelled as intended
  if (currentRequestId !== latestRequestIdRef.current) return;
  setError(err.message);
}
```

---

## 6. Resilience & Error Handling Matrix

The application provides dedicated, non-crashing UI states for every conceivable failure scenario:

| Failure Scenario | Upstream Cause | Detection Point | User Experience |
| :--- | :--- | :--- | :--- |
| **Malformed JSON** | Model outputs incomplete or truncated JSON | `extractCleanJsonString()` + `JSON.parse` | Friendly error banner with "Retry" button and collapsible technical diagnostics. |
| **Schema Mismatch** | Model returns unexpected object keys or wrong mode | `validateStudyData()` | App displays clear message explaining schema deviation without crashing. |
| **Incomplete Choices** | Quiz question has $<4$ options | Array length validation | Rejected with HTTP 422; user prompted to retry with one click. |
| **Empty Items Array** | Model produces `[]` | `items.length === 0` check | Explains notes were insufficient; offers one-click sample note insertion. |
| **Slow / Stalled Call** | Network latency or model load | Request lifecycle | Polished loading spinner with rotating status steps and a manual **Cancel** button. |
| **Network Disconnect** | Offline or dropped Wi-Fi | `navigator.onLine` check | "You appear to be offline. Please check your internet connection." |

---

## 7. Tech Stack & Engineering Rationale

### Frontend
- **React 18**: Functional components and custom hooks.
- **Vite**: Rapid HMR and optimized tree-shaken production bundles.
- **Modern CSS (Custom Design System)**: Built with CSS Variables for seamless Dark/Light mode switching. Avoided heavy component frameworks (Tailwind, MUI) to keep dependencies minimal, performance optimal, and bundle sizes lightweight.

### Backend
- **Node.js & Express**: Minimalist server-side proxy.
- **CORS & Dotenv**: Environment isolation and cross-origin security.
- **Native Fetch (Node 18+)**: Eliminates redundant HTTP client libraries like Axios.

---

## 8. Setup, Environment & Zero-Key Evaluation

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 1. Clone & Install
```bash
# Install dependencies across root, server, and client in one step
npm run install:all
```

### 2. Environment Configuration
Create a `.env` file in the root or `server` directory:
```bash
# Copy template
cp .env.example .env
```

```ini
PORT=5000
AI_PROVIDER=gemini        # Options: gemini | groq | openai | mock
AI_API_KEY=your_key_here  # Leave blank for Instant Mock Mode
AI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
```

> **Zero-Key Evaluation Mode**:  
> If `AI_API_KEY` is omitted or set to `your_api_key_here`, StudySpark automatically boots with its **built-in contextual educational generator**. You can run, test, and evaluate the entire application immediately without signing up for any API keys!

### 3. Start Both Servers Concurrently
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server API**: `http://localhost:5000`

---

## 9. Built-in Assignment Robustness Triggers

To make evaluation seamless for interviewers, StudySpark includes built-in test triggers directly on the home screen under **"🧪 Assignment Test Cases"**:

- `[test:malformed]` → Simulates a broken, cut-off JSON payload from the AI.
- `[test:wrong-shape]` → Simulates an AI payload with missing fields and wrong keys.
- `[test:empty]` → Simulates an empty `items: []` payload.
- `[test:error]` → Simulates an upstream 500 server crash.

*Clicking any trigger demonstrates the defensive error handling, collapsible diagnostic logs, and retry mechanisms instantly.*

---

## 10. Accessibility & UX Considerations

- **WCAG Contrast Compliant**: Color tokens tested for readable contrast in both Light and Dark themes.
- **Keyboard Traps Eliminated**: Global navigation shortcuts (`Space`, `←`, `→`) listen to active element tags and bypass execution if focus is inside `TEXTAREA`, `INPUT`, or `SELECT`.
- **Focus Rings**: Dedicated `:focus-visible` styling provides visual indicators for keyboard-only navigation.
- **Semantic HTML**: Buttons, landmarks (`header`, `main`, `footer`), and radio groups have correct ARIA roles (`role="radiogroup"`, `aria-checked`).

---

## 11. Live Interview Discussion Guide

When discussing this project during an engineering interview, here are the key technical talking points:

1. **Why route requests through Express instead of calling LLMs directly from React?**  
   *Answer*: Calling LLMs directly from the browser leaks private API keys in client-side bundles and network tabs. Routing through Express allows server-side input sanitization, rate limiting, and keeping keys safe in server environment variables.

2. **How does StudySpark guarantee it won't crash on bad LLM output?**  
   *Answer*: Through dual-layer validation. The server strips markdown fences and validates schemas before responding. The client validates the payload again through `validateStudyResponse.js` before updating React state. Any schema failure triggers an `ErrorState` with retry options instead of throwing unhandled component exceptions.

3. **How are race conditions handled if the user rapidly generates materials?**  
   *Answer*: We combine `AbortController.abort()` to cancel pending network requests with a monotonic `latestRequestIdRef` check. Even if a cancelled promise resolves late, the hook compares its request ID against the latest ID and silently ignores stale responses.

4. **Why use native React Hooks instead of Redux or Zustand?**  
   *Answer*: The state scope is localized to the study lifecycle (input → generation → deck/quiz interaction). Using custom hooks (`useStudyGenerator`, `useKeyboardNavigation`, `useTheme`) encapsulates logic, eliminates boilerplate, and avoids unnecessary bundle bloat.

---

## 12. Known Limitations & Future Roadmap

- **Model Hallucinations**: While schema validation guarantees the *structure* of output, the *factual correctness* depends on the selected model. Grounding with user-provided text minimizes this.
- **Session Persistence**: Generated materials are currently kept in React state. Future iterations will support local storage caching or cloud persistence (PostgreSQL/Supabase).
- **Export Capabilities**: Planned support for exporting flashcards directly to `.apkg` (Anki) and `.csv` (Quizlet).

---

## 13. Time Spent & Development Methodology

| Phase | Allocation | Focus |
| :--- | :--- | :--- |
| **Architecture & System Prompt Design** | ~1 hour | Strict JSON schema definitions, prompt constraints, error handling strategy |
| **Backend & Provider Integrations** | ~1.5 hours | Express proxy, Gemini/Groq/OpenAI adapters, server-side validator, mock engine |
| **Frontend Custom Hooks & API Layer** | ~2 hours | `useStudyGenerator` race condition guard, keyboard shortcuts hook, theme hook |
| **Flashcard & Quiz UI Components** | ~2 hours | 3D flip transform, review mode, quiz feedback, results screen, retry missed |
| **Defensive Hardening & Testing** | ~1.5 hours | Malformed JSON simulations, AbortController stress tests, comprehensive documentation |
| **Total** | **~8 hours** | Production-ready, fully documented application |

---

## 14. License

MIT License — Created for the Frontend Internship Assignment.
