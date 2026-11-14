import React from 'react';
import { RotateCwIcon, CheckCircleIcon, BookmarkIcon } from './Icons.jsx';

export default function Flashcard({
  card,
  isFlipped,
  onFlip,
  status // 'known' | 'review' | undefined
}) {
  return (
    <div className="flashcard-wrapper">
      <div
        className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${isFlipped ? 'Answer side' : 'Question side'}. Press Space or Enter to flip.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        {/* FRONT FACE (Question) */}
        <div className="flashcard-face flashcard-front">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <span className="badge badge-brand">Question</span>
              {status === 'known' && (
                <span className="badge badge-success">
                  <CheckCircleIcon size={12} /> Mastered
                </span>
              )}
              {status === 'review' && (
                <span className="badge badge-warning">
                  <BookmarkIcon size={12} /> Needs Review
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                marginTop: '1.25rem'
              }}
            >
              {card.question}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RotateCwIcon size={14} /> Click card or press <kbd style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.75rem' }}>Space</kbd> to flip
            </span>
            <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>Reveal Answer →</span>
          </div>
        </div>

        {/* BACK FACE (Answer) */}
        <div className="flashcard-face flashcard-back">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <span className="badge badge-success">Answer</span>
              {status === 'known' && (
                <span className="badge badge-success">
                  <CheckCircleIcon size={12} /> Mastered
                </span>
              )}
              {status === 'review' && (
                <span className="badge badge-warning">
                  <BookmarkIcon size={12} /> Needs Review
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                marginTop: '1rem'
              }}
            >
              {card.answer}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RotateCwIcon size={14} /> Click or press <kbd style={{ padding: '0.1rem 0.35rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.75rem' }}>Space</kbd> to view question
            </span>
            <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>← Back to Question</span>
          </div>
        </div>
      </div>
    </div>
  );
}

