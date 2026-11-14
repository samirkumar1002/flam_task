import React from 'react';
import { CheckCircleIcon, XCircleIcon, HelpCircleIcon } from './Icons.jsx';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({
  question,
  selectedAnswer, // number | undefined
  onSelectAnswer
}) {
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div>
      {/* Question Text */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.5,
          marginBottom: '1.5rem'
        }}
      >
        {question.question}
      </h3>

      {/* Answer Options */}
      <div
        role="radiogroup"
        aria-label="Quiz answer options"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}
      >
        {question.options.map((optionText, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = question.correctAnswer === index;

          let optionClass = 'quiz-option';
          let statusBadge = null;

          if (isAnswered) {
            if (isCorrect) {
              optionClass += ' correct';
              statusBadge = <CheckCircleIcon size={18} className="text-success" />;
            } else if (isSelected) {
              optionClass += ' incorrect';
              statusBadge = <XCircleIcon size={18} className="text-danger" />;
            }
          } else if (isSelected) {
            optionClass += ' selected-neutral';
          }

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isAnswered}
              onClick={() => onSelectAnswer(index)}
              className={optionClass}
            >
              <div className="option-letter">{OPTION_LETTERS[index]}</div>
              <span style={{ flex: 1 }}>{optionText}</span>
              {statusBadge}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner (Visible once answered) */}
      {isAnswered && (
        <div
          className="card-surface"
          style={{
            padding: '1.15rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background:
              selectedAnswer === question.correctAnswer
                ? 'var(--color-success-bg)'
                : 'var(--brand-primary-light)',
            border:
              selectedAnswer === question.correctAnswer
                ? '1px solid var(--color-success-border)'
                : '1px solid rgba(99, 102, 241, 0.25)',
            marginTop: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.4rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              color:
                selectedAnswer === question.correctAnswer
                  ? 'var(--color-success-text)'
                  : 'var(--brand-primary)'
            }}
          >
            <HelpCircleIcon size={16} />
            <span>
              {selectedAnswer === question.correctAnswer
                ? 'Correct! Explanation:'
                : 'Incorrect. Key takeaway:'}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)'
            }}
          >
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

