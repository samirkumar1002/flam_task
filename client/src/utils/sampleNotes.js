/**
 * Curated preset study notes to facilitate testing and interactive evaluation
 */

export const SAMPLE_TOPICS = [
  {
    id: 'react',
    label: '⚛️ React Hooks & Architecture',
    badge: 'Frontend',
    text: `React is a declarative, component-based JavaScript library for building user interfaces.
Key Concepts:
- Virtual DOM: Lightweight in-memory abstraction of the actual DOM. React uses a diffing algorithm (reconciliation) to batch minimal updates to the real DOM.
- Hooks Rules: Only call hooks at the top level (never inside loops, conditions, or nested functions), and only from React functional components or custom hooks.
- useState: Provides local component state. Updating it schedules a re-render.
- useEffect: Handles side effects (data fetching, subscriptions, DOM mutation). Its dependency array controls when it re-executes.
- useMemo & useCallback: Performance optimization primitives that memoize values and callback functions respectively across renders.
- Race conditions: Handled using AbortController or monotonically increasing request IDs to prevent stale async responses from overwriting current state.
- React Context: Provides dependency injection and prevents prop-drilling across deeply nested component trees.`
  },
  {
    id: 'biology',
    label: '🌿 Photosynthesis & Cellular Energy',
    badge: 'Biology',
    text: `Photosynthesis is the biochemical process by which photoautotrophs convert solar energy into chemical energy stored in glucose.
Key Concepts:
- Chemical Formula: 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2.
- Light-Dependent Reactions: Take place in the thylakoid membranes of chloroplasts. Photons strike Photosystem II and I, exciting electrons along the electron transport chain, generating ATP (via ATP synthase chemiosmosis) and NADPH. Water is split (photolysis), releasing oxygen.
- Calvin Cycle (Light-Independent): Occurs in the stroma. Carbon fixation is catalyzed by the enzyme RuBisCO, converting RuBP and CO2 into 3-PGA, which is reduced to G3P sugars using ATP and NADPH.
- Cellular Respiration Relationship: Respiration occurs in the mitochondria (Glycolysis -> Krebs Cycle -> Oxidative Phosphorylation), consuming glucose and oxygen to produce ATP, while releasing CO2 and H2O.`
  },
  {
    id: 'history',
    label: '🌍 Turning Points of World War II',
    badge: 'History',
    text: `World War II (1939–1945) was a global conflict between the Allied powers and the Axis powers.
Pivotal Events & Turning Points:
- Battle of Britain (1940): Royal Air Force successfully defended the United Kingdom against massive air attacks by the German Luftwaffe, preventing Operation Sea Lion.
- Operation Barbarossa (1941): Nazi Germany invaded the Soviet Union, breaking the Molotov-Ribbentrop Pact and opening the Eastern Front.
- Attack on Pearl Harbor (Dec 7, 1941): Imperial Japanese strike on the US naval base in Hawaii prompted the United States to formally enter WWII.
- Battle of Midway (1942): Decisive US naval victory in the Pacific that permanently crippled Japanese aircraft carrier strength.
- Battle of Stalingrad (1942-1943): Fierce urban warfare resulting in the destruction of the German 6th Army, marking the irreversible turning point on the Eastern Front.
- D-Day / Operation Overlord (June 6, 1944): Allied amphibious invasion of Normandy, establishing a major Western Front in Europe.`
  },
  {
    id: 'cs',
    label: '💻 Data Structures & Algorithms',
    badge: 'Computer Science',
    text: `Fundamental data structures organize and store data for efficient access and modification.
Core Concepts:
- Arrays vs Linked Lists: Arrays offer O(1) random access by index but O(N) insertions/deletions. Linked lists offer O(1) insertions given a pointer but O(N) sequential traversal.
- Hash Tables: Key-value stores using hash functions. Average case O(1) search, insert, and delete. Collisions handled via chaining (linked lists) or open addressing (linear probing).
- Binary Search Trees (BST): Left child < root < right child. Inorder traversal yields sorted order. Balanced trees (AVL, Red-Black) guarantee O(log N) height.
- Graphs: Composed of vertices and edges. Represented via Adjacency Matrix or Adjacency List. Traversed using BFS (shortest path in unweighted graphs, queue) and DFS (cycle detection, stack/recursion).
- Time Complexity: Big-O notation measures asymptotic upper bound of runtime as input size scales.`
  }
];

export const TEST_ERROR_PRESETS = [
  {
    id: 'malformed',
    label: '⚠️ Test Malformed JSON',
    text: '[test:malformed] Test how StudySpark handles broken or truncated JSON from the AI.'
  },
  {
    id: 'wrong-shape',
    label: '⚠️ Test Wrong Schema',
    text: '[test:wrong-shape] Test how StudySpark handles an AI response with unexpected keys.'
  },
  {
    id: 'empty',
    label: '⚠️ Test Empty Response',
    text: '[test:empty] Test how StudySpark handles an empty response array.'
  }
];

