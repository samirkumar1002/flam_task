import React, { useState } from 'react';
import { AlertTriangleIcon, RotateCwIcon, ChevronRightIcon } from './Icons.jsx';

export default function ErrorState({
  error,
  details,
  onRetry,
  onEditInput
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div
      className="card-surface"
      style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '620px',
        margin: '2rem auto',
        textAlign: 'center',
        border: '1px solid var(--color-danger-border)',
        background: 'var(--bg-surface)'
      }}
    >
      {/* Alert Icon Badge */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}
      >
        <AlertTriangleIcon size={32} />
      </div>

      <h3
        style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem'
        }}
      >
        Unable to Generate Study Material
      </h3>

      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: '460px',
          margin: '0 auto 1.75rem'
        }}
      >
        {error || 'An unexpected error occurred while communicating with the study generator.'}
      </p>

      {/* Primary Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}
      >
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <RotateCwIcon size={18} />
            <span>Retry Generation</span>
          </button>
        )}

        {onEditInput && (
          <button
            type="button"
            onClick={onEditInput}
            className="btn-secondary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <span>Edit Notes & Settings</span>
          </button>
        )}
      </div>

      {/* Expandable Technical Details for Developers & Reviewers */}
      {details && (
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowTechnicalDetails((prev) => !prev)}
            className="btn-ghost"
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 auto' }}
          >
            <span>{showTechnicalDetails ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics'}</span>
            <ChevronRightIcon
              size={14}
              style={{
                transform: showTechnicalDetails ? 'rotate(90deg)' : 'none',
                transition: 'transform var(--transition-fast)'
              }}
            />
          </button>

          {showTechnicalDetails && (
            <pre
              style={{
                marginTop: '1rem',
                textAlign: 'left',
                padding: '0.85rem 1rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--color-danger-text)',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace'
              }}
            >
              {typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

