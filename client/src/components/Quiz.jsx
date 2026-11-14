import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion.jsx';
import QuizResults from './QuizResults.jsx';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCwIcon,
  SparklesIcon
} from './Icons.jsx';

export default function Quiz({ data, onGenerateNew }) {
  // Store the active pool of questions (can be full set or subset when retrying incorrect)
  const [activeQuestions, setActiveQuestions] = useState(() => data?.items || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const isCurrentAnswered = currentQuestion && userAnswers[currentQuestion.id] !== undefined;

  // Answer handler
  const handleSelectAnswer = (optionIndex) => {
    if (!currentQuestion) return;
    if (userAnswers[currentQuestion.id] !== undefined) return; // Prevent changing after submission

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed last question
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Restart handlers
  const handleRestartFullQuiz = () => {
    setActiveQuestions(data?.items || []);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  const handleRetryIncorrect = () => {
    const incorrectOnly = activeQuestions.filter((q) => {
      const ans = userAnswers[q.id];
      return ans !== q.correctAnswer;
    });

    if (incorrectOnly.length > 0) {
      setActiveQuestions(incorrectOnly);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setIsCompleted(false);
    }
  };

  // If completed, render QuizResults
  if (isCompleted) {
    return (
      <QuizResults
        questions={activeQuestions}
        userAnswers={userAnswers}
        onRestartFullQuiz={handleRestartFullQuiz}
        onRetryIncorrect={handleRetryIncorrect}
        onGenerateNew={onGenerateNew}
      />
    );
  }

  const progressPercent =
    totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Quiz Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          <span className="badge badge-brand" style={{ marginBottom: '0.25rem' }}>
            Interactive Quiz
          </span>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            {data.title || 'Study Quiz'}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleRestartFullQuiz}
          className="btn-ghost"
          style={{ fontSize: '0.8rem' }}
          title="Clear progress and restart"
        >
          <RotateCwIcon size={14} /> Restart Quiz
        </button>
      </div>

      {/* Progress Card */}
      <div
        className="card-surface"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {Object.keys(userAnswers).length} answered
          </span>
        </div>

        {/* Progress Bar Track */}
        <div
          style={{
            height: '6px',
            width: '100%',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--brand-gradient)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Question Card Surface */}
      <div
        className="card-surface"
        style={{
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            selectedAnswer={userAnswers[currentQuestion.id]}
            onSelectAnswer={handleSelectAnswer}
          />
        )}

        {/* Navigation Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)'
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.15rem' }}
          >
            <ChevronLeftIcon size={18} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <span>
              {currentQuestionIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}
            </span>
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      {/* Footer Return Action */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={onGenerateNew}
          className="btn-ghost"
          style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600 }}
        >
          <SparklesIcon size={14} /> Back to Notes Editor
        </button>
      </div>
    </div>
  );
}

