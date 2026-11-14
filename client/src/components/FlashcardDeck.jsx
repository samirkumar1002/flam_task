import React, { useState } from 'react';
import Flashcard from './Flashcard.jsx';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCwIcon,
  CheckCircleIcon,
  BookmarkIcon,
  SparklesIcon
} from './Icons.jsx';

export default function FlashcardDeck({ data, onGenerateNew }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState({}); // { [id]: 'known' | 'review' }
  const [reviewModeOnly, setReviewModeOnly] = useState(false);

  const allCards = data?.items || [];

  // Filter cards if in "Review Mode"
  const activeDeck = reviewModeOnly
    ? allCards.filter((card) => cardStatuses[card.id] === 'review')
    : allCards;

  const totalCount = activeDeck.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCount - 1));
  const currentCard = activeDeck[safeIndex];

  const knownCount = allCards.filter((c) => cardStatuses[c.id] === 'known').length;
  const reviewCount = allCards.filter((c) => cardStatuses[c.id] === 'review').length;

  // Handlers
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (safeIndex < totalCount - 1) {
      setCurrentIndex(safeIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkStatus = (status) => {
    if (!currentCard) return;
    setCardStatuses((prev) => ({
      ...prev,
      [currentCard.id]: prev[currentCard.id] === status ? undefined : status
    }));
  };

  const handleRestartDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleResetAllStatuses = () => {
    setCardStatuses({});
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewModeOnly(false);
  };

  // Keyboard navigation hook
  useKeyboardNavigation({
    onPrev: safeIndex > 0 ? handlePrev : undefined,
    onNext: safeIndex < totalCount - 1 ? handleNext : undefined,
    onFlip: handleFlip,
    isEnabled: Boolean(currentCard)
  });

  // Calculate percentage
  const progressPercent = totalCount > 0 ? Math.round(((safeIndex + 1) / totalCount) * 100) : 0;

  // Positive empty state for review mode
  if (reviewModeOnly && activeDeck.length === 0) {
    return (
      <div
        className="card-surface"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <CheckCircleIcon size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          All Caught Up! 🎉
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '440px', margin: '0 auto 1.75rem' }}>
          You have cleared all cards marked for review or haven't marked any yet. Outstanding mastery!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setReviewModeOnly(false);
              setCurrentIndex(0);
            }}
            className="btn-primary"
          >
            Return to Full Deck ({allCards.length} Cards)
          </button>
          <button
            type="button"
            onClick={onGenerateNew}
            className="btn-secondary"
          >
            Generate New Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto' }}>
      {/* Deck Header & Mode Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <span className="badge badge-brand" style={{ marginBottom: '0.25rem' }}>
            Flashcard Deck
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
            {data.title || 'Study Flashcards'}
          </h2>
        </div>

        {/* Review Mode Toggle Switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            border: '1px solid var(--border-light)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setReviewModeOnly(false);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: !reviewModeOnly ? 'var(--bg-surface)' : 'transparent',
              color: !reviewModeOnly ? 'var(--brand-primary)' : 'var(--text-secondary)',
              boxShadow: !reviewModeOnly ? 'var(--shadow-xs)' : 'none'
            }}
          >
            All Cards ({allCards.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setReviewModeOnly(true);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: reviewModeOnly ? 'var(--bg-surface)' : 'transparent',
              color: reviewModeOnly ? 'var(--color-warning-text)' : 'var(--text-secondary)',
              boxShadow: reviewModeOnly ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Review Again ({reviewCount})
          </button>
        </div>
      </div>

      {/* Progress & Stat Counters Bar */}
      <div
        className="card-surface"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
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
            Card {safeIndex + 1} of {totalCount}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              ✓ Known: {knownCount}
            </span>
            <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
              ⚑ Review: {reviewCount}
            </span>
          </div>
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

      {/* Main Flashcard Component */}
      {currentCard && (
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          status={cardStatuses[currentCard.id]}
        />
      )}

      {/* Card Self-Grading Actions: Know it / Review again */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '1.25rem',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => handleMarkStatus('known')}
          className="btn-secondary"
          style={{
            borderColor: cardStatuses[currentCard?.id] === 'known' ? 'var(--color-success)' : undefined,
            background: cardStatuses[currentCard?.id] === 'known' ? 'var(--color-success-bg)' : undefined,
            color: cardStatuses[currentCard?.id] === 'known' ? 'var(--color-success-text)' : undefined
          }}
        >
          <CheckCircleIcon size={18} />
          <span>Know it</span>
        </button>

        <button
          type="button"
          onClick={() => handleMarkStatus('review')}
          className="btn-secondary"
          style={{
            borderColor: cardStatuses[currentCard?.id] === 'review' ? 'var(--color-warning)' : undefined,
            background: cardStatuses[currentCard?.id] === 'review' ? 'var(--color-warning-bg)' : undefined,
            color: cardStatuses[currentCard?.id] === 'review' ? 'var(--color-warning-text)' : undefined
          }}
        >
          <BookmarkIcon size={18} />
          <span>Review again</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="btn-secondary"
          title="Flip card (Spacebar)"
        >
          <RotateCwIcon size={16} />
          <span>Flip Card</span>
        </button>
      </div>

      {/* Navigation Controls: Previous / Next */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)'
        }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.15rem' }}
          aria-label="Previous card (Left Arrow)"
        >
          <ChevronLeftIcon size={18} />
          <span>Previous</span>
        </button>

        {/* Keyboard hints */}
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          className="keyboard-nav-hint"
        >
          Keys: ← Previous | Space Flip | Next →
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={safeIndex === totalCount - 1}
          className="btn-primary"
          style={{ padding: '0.65rem 1.25rem' }}
          aria-label="Next card (Right Arrow)"
        >
          <span>Next</span>
          <ChevronRightIcon size={18} />
        </button>
      </div>

      {/* Deck Utility Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <button
          type="button"
          onClick={handleRestartDeck}
          className="btn-ghost"
          style={{ fontSize: '0.85rem' }}
        >
          <RotateCwIcon size={14} /> Restart Deck
        </button>

        <button
          type="button"
          onClick={onGenerateNew}
          className="btn-ghost"
          style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600 }}
        >
          <SparklesIcon size={14} /> Generate New Study Set
        </button>
      </div>
    </div>
  );
}

