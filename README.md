# StudySpark ⚡ — AI-Powered Active Learning Assistant

> **Frontend Internship Assignment**  
> Turn free-form study notes, lecture outlines, or topics into curriculum-grade, interactive **Flashcards** and **Quizzes** using zero-trust structured AI output.

---

## 1. Project Overview

**StudySpark** is a production-quality educational web application designed to solve passive studying. Rather than forcing students to passively re-read notes, StudySpark transforms raw text or topics into active retrieval systems:

- **Interactive 3D Flashcards** with spaced recall tracking ("Know it" / "Review again") and dedicated review mode.
- **Pedagogical Multiple-Choice Quizzes** with instant feedback, deep pedagogical explanations, and an intelligent "Retry Missed Questions" mode.

### Why It's Not a Chatbot
StudySpark intentionally avoids conversational chatbot interfaces. Instead, the AI serves as a background curriculum compiler that outputs **strictly validated, structured JSON schemas**. The frontend ingests this data into a stateful, interactive learning interface designed for desktop and mobile devices.

---

## 2. Key Features

### 🗂️ Interactive Flashcard System
- **Single-Card Focus**: Displays one card at a time with clear progress indicators (`Card 3 of 10`).
- **Smooth 3D Flip Animation**: Hardware-accelerated CSS 3D transform (`perspective`, `rotateY(180deg)`).
- **Active Recall Self-Grading**: Mark cards as **"Know it"** (mastered) or **"Review again"** (needs practice).
- **Dedicated Review Mode**: Filter and test only cards flagged for review. If all cards are cleared, displays a positive empty celebration state.
- **Keyboard Navigation**:
  - `Space`: Flip active card
  - `Right Arrow (→)`: Next card
  - `Left Arrow (←)`: Previous card
  - *Intelligently disengaged when typing in inputs or textareas*.
- **Deck Controls**: Instant deck restart and "Generate New Study Set".

### 📝 Comprehensive Quiz System
- **Step-by-Step Quizzing**: Shows one question at a time with 4 distinct options ($A, B, C, D$).
- **Instant Pedagogical Feedback**:
  - Correct choice highlighted in green with checkmark.
  - Incorrect selection highlighted in red with cross.
  - Explanatory rationale displayed immediately upon submission.
- **Answer Locking & Navigation**: Prevents altering answers once submitted, while previous navigation preserves your recorded selections.
- **Scored Results Screen**:
  - Score fraction ($8/10$) and accuracy percentage ($80\%$).
  - Correct and incorrect counters.
  - Dynamic performance feedback tiers ($90\%+$: Outstanding, $70–89\%$: Great work, $50–69\%$: Good effort, $<50\%$: Review & retry).
  - Expandable question-by-question review with explanations.
- **Targeted "Retry Incorrect Answers" Mode**: Creates a focused quiz session containing *only* the questions answered incorrectly.

### 🛡️ Defensive AI Architecture & Stale Response Protection
- **Zero-Trust Validation**: Both the backend proxy and frontend client strictly validate JSON schemas before rendering.
- **Stale Response Protection**: Uses `AbortController` to cancel in-flight HTTP requests when a user re-submits, coupled with monotonic request IDs to guarantee older, delayed responses never overwrite newer state.
- **Graceful Error Handling**: Dedicated, user-friendly error views with retry triggers, note edit links, and collapsible technical diagnostics.
- **Built-in Offline / Zero-Key Mock Engine**: Instant evaluation out-of-the-box without requiring an API key, plus simulated test presets (`[test:malformed]`, `[test:wrong-shape]`, `[test:empty]`).
- **Dark & Light Mode**: Accessible contrast ratios, persistent theme storage, and clean educational SaaS styling.

---

## 3. Tech Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18 (Functional Components, Custom Hooks), Vite, Modern CSS (CSS Variables, Flexbox, Grid, 3D Transforms) |
| **Backend** | Node.js, Express, CORS, Dotenv, Native `fetch` (Node 18+) |
| **AI Providers** | **Google Gemini** (`gemini-1.5-flash`), **Groq** (`llama-3.3-70b-versatile`), **OpenAI** (`gpt-4o-mini`), and **Intelligent Mock Fallback** |
| **State & Control**| React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`), `AbortController` |

---

## 4. Project Architecture

```
samir_flam/
├── client/                     # Frontend React + Vite Application
│   ├── index.html              # Entry HTML with meta tags & Google Fonts
│   ├── vite.config.js          # Vite config with backend proxy
│   ├── package.json            # Client dependencies (React 18, Vite)
│   └── src/
│       ├── main.jsx            # React root mount
│       ├── App.jsx             # Top-level orchestration & state routing
│       ├── index.css           # Design system tokens, light/dark themes, 3D animations
│       ├── components/
│       │   ├── Header.jsx              # Brand bar, back-to-notes button, theme toggle
│       │   ├── ThemeToggle.jsx         # Accessible Dark/Light mode toggle
│       │   ├── StudyInput.jsx          # Free-form notes textarea, quick presets, test triggers
│       │   ├── ModeSelector.jsx        # Segmented selector for Flashcards vs Quiz
│       │   ├── DifficultySelector.jsx  # Difficulty (Easy/Med/Hard) & Count (5/10/15)
│       │   ├── FlashcardDeck.jsx       # Deck orchestrator, review mode, progress bar
│       │   ├── Flashcard.jsx           # Individual card with 3D flip mechanics
│       │   ├── Quiz.jsx                # Quiz session manager & retry logic
│       │   ├── QuizQuestion.jsx        # 4-option question layout with feedback
│       │   ├── QuizResults.jsx         # Performance summary, stats, retry missed
│       │   ├── LoadingState.jsx        # Polished loading animation & status messages
│       │   ├── ErrorState.jsx          # Friendly error view with retry & technical log
│       │   ├── EmptyState.jsx          # Informational feature onboarding cards
│       │   └── Icons.jsx               # Pixel-perfect zero-dependency SVG icons
│       ├── hooks/
│       │   ├── useStudyGenerator.js    # API lifecycle, AbortController, monotonic ID race protection
│       │   ├── useKeyboardNavigation.js# Space & Arrow keys handler with input isolation
│       │   └── useTheme.js             # Theme persistence with localStorage
│       ├── services/
│       │   └── api.js                  # Frontend HTTP client with AbortSignal forwarding
│       └── utils/
│           ├── parseAIResponse.js      # Markdown fence stripper & safe JSON parser
│           ├── validateResponse.js     # Strict client-side schema validator
│           └── sampleNotes.js          # High-yield note presets & assignment test cases
│
├── server/                     # Backend Express Proxy
│   ├── index.js                # Express app, middleware, CORS, logging, healthcheck
│   ├── package.json            # Server dependencies (Express, CORS, Dotenv)
│   ├── routes/
│   │   └── generate.js         # POST /api/generate & GET /api/health
│   ├── services/
│   │   ├── llmService.js       # Unified provider adapter (Gemini, Groq, OpenAI, Mock)
│   │   └── mockGenerator.js    # Dynamic contextual mock & error simulation generator
│   └── utils/
│       ├── promptBuilder.js    # Strict system and user prompts requesting raw JSON
│       └── validateStudyData.js# Server-side schema validator & sanitizer
│
├── .env.example                # Sample environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Root package with concurrent run scripts
└── README.md                   # Complete documentation
```

---

## 5. Setup Instructions

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

### 1. Clone or Open the Workspace
```bash
cd samir_flam
```

### 2. Install Dependencies
You can install dependencies across both client and server in one command:
```bash
npm run install:all
```
*(Or individually: `npm install --prefix server` and `npm install --prefix client`)*

### 3. Configure Environment Variables
Copy the example environment configuration into the root or `server` directory:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

---

## 6. Environment Variables

Edit `.env` to configure your preferred AI provider:

```ini
# Server Port
PORT=5000

# Provider options: "gemini" | "groq" | "openai" | "mock"
AI_PROVIDER=gemini

# Your API Key:
# - Gemini: https://aistudio.google.com/app/apikey (Free tier available)
# - Groq: https://console.groq.com/keys (Fast, free tier available)
# - OpenAI: https://platform.openai.com/api-keys
AI_API_KEY=your_api_key_here

# Model name:
# - Gemini: gemini-1.5-flash
# - Groq: llama-3.3-70b-versatile
# - OpenAI: gpt-4o-mini
AI_MODEL=gemini-1.5-flash

# Client URL whitelist for CORS
CLIENT_URL=http://localhost:5173
```

> 💡 **Reviewer Tip (Zero-Key Testing)**:  
> If you leave `AI_API_KEY` blank or set `AI_PROVIDER=mock`, the application automatically uses the built-in intelligent educational generator. You can evaluate the entire application immediately without registering for any API keys!

---

## 7. How to Run Frontend & Backend

### Run Both Concurrently (Recommended)
From the project root:
```bash
npm run dev
```
This boots:
- **Backend API**: `http://localhost:5000`
- **Frontend Vite**: `http://localhost:5173`

### Run Individually
In terminal 1 (Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 8. How the AI Integration Works

To adhere to security best practices, **API keys are NEVER exposed to the frontend browser**.

```
┌─────────────────────────────────┐
│     Client (React App)          │
│ - AbortController request guard │
│ - Schema validation layer 2     │
└───────────────▲─────────────────┘
                │ HTTP POST /api/generate
                │ (input, mode, difficulty, count)
┌───────────────▼─────────────────┐
│     Server (Express Proxy)      │
│ - Validates input bounds        │
│ - Injects strict JSON prompt    │
│ - Queries LLM via private key   │
│ - Strips markdown code blocks   │
│ - Schema validation layer 1     │
└───────────────▲─────────────────┘
                │ REST API call
                │ (with Authorization header)
┌───────────────▼─────────────────┐
│   LLM Provider (Gemini/Groq)    │
│ Returns raw JSON string         │
└─────────────────────────────────┘
```

1. The client sends `{ input, mode, difficulty, count }` to `/api/generate`.
2. The server builds a system prompt enforcing schema output and instructs the LLM not to wrap responses in markdown or conversational greetings.
3. The server forwards the request to Google Gemini (using native `responseMimeType: "application/json"`), Groq, or OpenAI.
4. If the model accidentally wraps output in ` ```json `, the server extracts the inner JSON payload.
5. The server validates the structure with `validateStudyData.js`.
6. The client receives clean data and performs a secondary validation with `validateStudyResponse.js` before updating React state.

---

## 9. Structured Output and Validation

### Flashcard Schema
```json
{
  "type": "flashcards",
  "title": "React Architecture & Lifecycle",
  "items": [
    {
      "id": "1",
      "question": "What is the Virtual DOM?",
      "answer": "An in-memory representation of real DOM elements that React reconciles using diffing algorithms to batch minimal browser DOM updates."
    }
  ]
}
```

### Quiz Schema
```json
{
  "type": "quiz",
  "title": "Quiz: Cellular Respiration",
  "items": [
    {
      "id": "1",
      "question": "Where does the Calvin Cycle occur inside a plant cell?",
      "options": [
        "Thylakoid Membrane",
        "Chloroplast Stroma",
        "Mitochondrial Matrix",
        "Outer Cell Wall"
      ],
      "correctAnswer": 1,
      "explanation": "The Calvin Cycle occurs in the stroma of the chloroplast, utilizing ATP and NADPH from light reactions to fix CO2."
    }
  ]
}
```

### Validation Checklist
Both client and server verify:
- Response is a non-null JSON object.
- `type` strictly equals the requested mode (`flashcards` or `quiz`).
- `title` is a non-empty string.
- `items` is an array with length $> 0$.
- **Flashcards**: Every card has a valid `id`, non-empty `question`, and non-empty `answer`.
- **Quiz**: Every question has a valid `id`, non-empty `question`, **exactly 4 non-empty choices**, a `correctAnswer` integer in range $[0, 3]$, and an educational `explanation`.

---

## 10. Error Handling & Stale Response Strategy

### Handling Bad AI Output
The application handles five failure scenarios without crashing:
1. **Malformed JSON**: Strips extraneous characters and handles syntax errors with HTTP 422.
2. **Schema Mismatch**: Detects missing fields or improper option arrays, displaying a user-friendly error with a "Retry" button.
3. **Empty Responses**: Rejects empty payloads before they reach UI components.
4. **Provider Errors / Timeouts**: Surfaces a clean message and technical details drawer.
5. **Slow Responses / Race Conditions**: Protected via `AbortController` and request IDs.

### Stale Response Protection Code Pattern
```javascript
// Inside useStudyGenerator.js:
// 1. Abort existing in-flight request
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}

// 2. Increment request ID
latestRequestIdRef.current += 1;
const currentRequestId = latestRequestIdRef.current;
const controller = new AbortController();
abortControllerRef.current = controller;

try {
  const result = await generateStudyContent({ ..., signal: controller.signal });
  
  // 3. Stale check: discard if superseded
  if (currentRequestId !== latestRequestIdRef.current) return;
  
  setGeneratedData(result);
} catch (err) {
  if (err.name === 'AbortError') return; // Silently ignore cancelled requests
  if (currentRequestId !== latestRequestIdRef.current) return;
  setError(err.message);
}
```

### Testing Error Triggers
Click **"🧪 Assignment Test Cases"** on the home screen to test:
- `[test:malformed]` — Simulates malformed, cut-off JSON.
- `[test:wrong-shape]` — Simulates unexpected object keys.
- `[test:empty]` — Simulates an empty item array.
- `[test:error]` — Simulates an upstream 500 error.

---

## 11. AI Tools Used During Development

- **Google Gemini 1.5 Flash / Pro** (via Google AI Studio): Used for prompt engineering iterations and testing native `responseMimeType: "application/json"` parameters.
- **Antigravity Assistant**: Used for architecting the project layout, implementing defensive validation pipelines, and ensuring comprehensive coverage of the assignment requirements.

---

## 12. Known Limitations

1. **Model Hallucinations**: While schema validation prevents structural crashes, the factual accuracy of AI content relies on the underlying LLM's training data.
2. **Stateless Persistence**: Cards and quizzes are held in memory during the active session; refreshing the page returns to the input editor.
3. **Provider Rate Limits**: Free-tier provider keys (e.g. Gemini or Groq) may encounter rate limits during rapid consecutive requests.

---

## 13. Future Improvements

- [ ] **Export to Anki / Quizlet**: Allow exporting generated flashcard decks to `.apkg` or CSV format.
- [ ] **Spaced Repetition Scheduling**: Integrate SuperMemo SM-2 algorithm to schedule review intervals over days.
- [ ] **PDF / Document Upload**: Add drag-and-drop support for parsing slides, PDFs, and `.docx` notes.
- [ ] **Audio Pronunciation**: Text-to-speech support for language learning flashcards.

---

## 14. Approximate Time Spent

| Phase | Time Spent | Key Deliverables |
| :--- | :--- | :--- |
| **Requirements Analysis & Architecture** | 45 mins | System prompt design, schema specification, stale response protection plan |
| **Backend Implementation** | 1.5 hours | Express server, provider abstraction (Gemini, Groq, OpenAI, Mock), schema validation |
| **Frontend Core & State Logic** | 2.5 hours | Custom hooks (`useStudyGenerator`, `useKeyboardNavigation`, `useTheme`), API layer |
| **Flashcard & Quiz UI/UX** | 2 hours | 3D flip animation, quiz feedback, results screen, retry missed questions |
| **Defensive Hardening & Testing** | 1.5 hours | Malformed JSON simulations, AbortController stress tests, error views, documentation |
| **Total** | **~8 hours** | Production-ready, fully validated application |

---

## 15. License

MIT License — Developed for the Frontend Internship Assignment.

#   f l a m _ t a s k  
 