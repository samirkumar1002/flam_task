import React, { useState } from 'react';
import {
  TrophyIcon,
  RotateCwIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon
} from './Icons.jsx';

export default function QuizResults({
  questions,
  userAnswers,
  onRestartFullQuiz,
  onRetryIncorrect,
  onGenerateNew
}) {
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  const totalQuestions = questions.length;
  let correctCount = 0;
  const incorrectQuestions = [];

  questions.forEach((q) => {
    const userAnswer = userAnswers[q.id];
    if (userAnswer === q.correctAnswer) {
      correctCount += 1;
    } else {
      incorrectQuestions.push(q);
    }
  });

  const incorrectCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Performance feedback evaluation
  let performanceTier = {
    title: 'Review the Material & Try Again',
    message: 'Don’t worry! Active recall builds retention over time. Review your notes and give it another shot.',
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-bg)'
  };

  if (percentage >= 90) {
    performanceTier = {
      title: 'Outstanding Mastery! 🌟',
      message: 'Phenomenal work! You have mastered this study set with near-perfect accuracy.',
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)'
    };
  } else if (percentage >= 70) {
    performanceTier = {
      title: 'Great Work! 👏',
      message: 'Solid grasp of the core concepts. A quick review of your missed questions will cement total understanding.',
      color: 'var(--brand-primary)',
      bg: 'var(--brand-primary-light)'
    };
  } else if (percentage >= 50) {
    performanceTier = {
      title: 'Good Effort, Keep Practicing! 📚',
      message: 'You understand the basics, but there are a few tricky nuances to review.',
      color: 'var(--color-warning-text)',
      bg: 'var(--color-warning-bg)'
    };
  }

  return (
    <div
      className="card-surface"
      style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '720px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* Trophy Badge */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: performanceTier.bg,
          color: performanceTier.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <TrophyIcon size={38} />
      </div>

      {/* Title & Performance Bracket */}
      <h2
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.4rem'
        }}
      >
        {performanceTier.title}
      </h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          maxWidth: '520px',
          margin: '0 auto 2rem'
        }}
      >
        {performanceTier.message}
      </p>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div
          className="card-surface"
          style={{ padding: '1rem', background: 'var(--bg-subtle)' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            SCORE
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {correctCount} / {totalQuestions}
          </div>
        </div>

        <div
          className="card-surface"
          style={{ padding: '1rem', background: 'var(--bg-subtle)' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            ACCURACY
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
            {percentage}%
          </div>
        </div>

        <div
          className="card-surface"
          style={{ padding: '1rem', background: 'var(--color-success-bg)' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success-text)' }}>
            CORRECT
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.2rem' }}>
            {correctCount}
          </div>
        </div>

        <div
          className="card-surface"
          style={{ padding: '1rem', background: 'var(--color-danger-bg)' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger-text)' }}>
            INCORRECT
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.2rem' }}>
            {incorrectCount}
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}
      >
        {incorrectCount > 0 ? (
          <button
            type="button"
            onClick={onRetryIncorrect}
            className="btn-primary"
            style={{ padding: '0.85rem 1.4rem' }}
          >
            <RotateCwIcon size={18} />
            <span>Retry Incorrect Answers ({incorrectCount})</span>
          </button>
        ) : (
          <div
            className="badge badge-success"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
          >
            ✓ 100% Correct — No mistakes to retry!
          </div>
        )}

        <button
          type="button"
          onClick={onRestartFullQuiz}
          className="btn-secondary"
          style={{ padding: '0.85rem 1.4rem' }}
        >
          <RotateCwIcon size={18} />
          <span>Restart Full Quiz</span>
        </button>

        <button
          type="button"
          onClick={onGenerateNew}
          className="btn-secondary"
          style={{ padding: '0.85rem 1.4rem' }}
        >
          <SparklesIcon size={18} />
          <span>Generate New Material</span>
        </button>
      </div>

      {/* Toggle Detailed Breakdown */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setShowDetailedReview((prev) => !prev)}
          className="btn-ghost"
          style={{ fontWeight: 600, color: 'var(--brand-primary)', margin: '0 auto' }}
        >
          <span>{showDetailedReview ? 'Hide Question Breakdown' : 'View Question-by-Question Breakdown'}</span>
          <ChevronRightIcon
            size={16}
            style={{
              transform: showDetailedReview ? 'rotate(90deg)' : 'none',
              transition: 'transform var(--transition-fast)'
            }}
          />
        </button>

        {showDetailedReview && (
          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const hasAnswered = userAnswer !== undefined;

              return (
                <div
                  key={q.id || idx}
                  className="card-surface"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `4px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Question {idx + 1}
                    </span>
                    <span
                      className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}
                      style={{
                        background: isCorrect ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                        color: isCorrect ? 'var(--color-success-text)' : 'var(--color-danger-text)'
                      }}
                    >
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    {q.question}
                  </p>

                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ color: isCorrect ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>
                      <strong>Your answer:</strong>{' '}
                      {hasAnswered ? q.options[userAnswer] : 'Unanswered'}
                    </div>
                    {!isCorrect && (
                      <div style={{ color: 'var(--color-success-text)' }}>
                        <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                      </div>
                    )}
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

