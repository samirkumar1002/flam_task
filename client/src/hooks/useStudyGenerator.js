import { useState, useRef, useEffect, useCallback } from 'react';
import { generateStudyContent } from '../services/api.js';
import { validateStudyResponse } from '../utils/validateResponse.js';

const LOADING_STEPS = [
  'Analyzing your study notes...',
  'Extracting key terms & core concepts...',
  'Synthesizing pedagogical material...',
  'Structuring interactive response...'
];

export function useStudyGenerator() {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'hard'
  const [itemCount, setItemCount] = useState(5); // 5 | 10 | 15

  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_STEPS[0]);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  // Stale request race condition protection
  const abortControllerRef = useRef(null);
  const latestRequestIdRef = useRef(0);
  const stepTimerRef = useRef(null);

  // Cleans up any pending request or timer when unmounting
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    };
  }, []);

  const generate = useCallback(
    async (overrides = {}) => {
      const textToUse = overrides.input !== undefined ? overrides.input : inputText;
      const modeToUse = overrides.mode || selectedMode;
      const difficultyToUse = overrides.difficulty || difficulty;
      const countToUse = overrides.count || itemCount;

      if (!textToUse || !textToUse.trim()) {
        setError('Please enter study notes or a topic before generating.');
        return;
      }

      // 1. Cancel previous in-flight request if present
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. Increment monotonically increasing request ID
      latestRequestIdRef.current += 1;
      const currentRequestId = latestRequestIdRef.current;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 3. Reset state & set loading
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      setLoadingMessage(LOADING_STEPS[0]);

      // Rotate loading messages smoothly
      let stepIndex = 0;
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      stepTimerRef.current = setInterval(() => {
        stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
        setLoadingMessage(LOADING_STEPS[stepIndex]);
      }, 1600);

      try {
        const rawResult = await generateStudyContent({
          input: textToUse.trim(),
          mode: modeToUse,
          difficulty: difficultyToUse,
          count: countToUse,
          signal: controller.signal
        });

        // 4. Stale response check: discard if newer request has been initiated
        if (currentRequestId !== latestRequestIdRef.current) {
          if (import.meta.env.DEV) {
            console.log(`[useStudyGenerator] Discarding stale response #${currentRequestId} (Current is #${latestRequestIdRef.current})`);
          }
          return;
        }

        // 5. Zero-trust frontend validation of AI output
        const validation = validateStudyResponse(rawResult, modeToUse);
        if (!validation.isValid) {
          throw new Error(validation.error || 'AI output did not match expected schema format.');
        }

        setGeneratedData(validation.sanitizedData);
      } catch (err) {
        // If aborted by a newer request or component unmount, ignore silently
        if (err.name === 'AbortError') {
          if (import.meta.env.DEV) {
            console.log(`[useStudyGenerator] Request #${currentRequestId} aborted.`);
          }
          return;
        }

        // Discard error state if request is stale
        if (currentRequestId !== latestRequestIdRef.current) {
          return;
        }

        const friendlyMessage =
          err.message || 'An unexpected error occurred while generating study material.';
        setError(friendlyMessage);
        setErrorDetails(err.details || err.code || err.stack);
      } finally {
        if (currentRequestId === latestRequestIdRef.current) {
          setLoading(false);
          if (stepTimerRef.current) {
            clearInterval(stepTimerRef.current);
            stepTimerRef.current = null;
          }
        }
      }
    },
    [inputText, selectedMode, difficulty, itemCount]
  );

  const retry = useCallback(() => {
    generate();
  }, [generate]);

  const resetToInput = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setGeneratedData(null);
    setError(null);
    setErrorDetails(null);
    setLoading(false);
  }, []);

  return {
    inputText,
    setInputText,
    selectedMode,
    setSelectedMode,
    difficulty,
    setDifficulty,
    itemCount,
    setItemCount,
    generatedData,
    setGeneratedData,
    loading,
    loadingMessage,
    error,
    errorDetails,
    generate,
    retry,
    resetToInput
  };
}

