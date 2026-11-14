import React from 'react';
import { SparklesIcon } from './Icons.jsx';

export default function LoadingState({ message = 'Generating study material...', onCancel }) {
  return (
    <div
      className="card-surface"
      style={{
        padding: '3.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '2rem auto'
      }}
    >
      {/* Animated Glowing Icon Ring */}
      <div
        style={{
          position: 'relative',
          width: '76px',
          height: '76px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="animate-spin"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid var(--border-light)',
            borderTopColor: 'var(--brand-primary)',
            borderRightColor: 'var(--brand-secondary)'
          }}
        />
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SparklesIcon size={26} className="animate-pulse-subtle" />
        </div>
      </div>

      {/* Primary Status Text */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.4rem',
          letterSpacing: '-0.01em'
        }}
      >
        {message}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          maxWidth: '380px',
          margin: '0 auto 1.75rem',
          lineHeight: 1.5
        }}
      >
        Structuring learning objectives into rigorous pedagogical formats. This typically takes 2–4 seconds.
      </p>

      {/* Cancel button if request is taking too long */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          Cancel generation
        </button>
      )}
    </div>
  );
}

