import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { SparklesIcon, ChevronLeftIcon } from './Icons.jsx';

export default function Header({ theme, onToggleTheme, hasGeneratedContent, onReset }) {
  return (
    <header
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(var(--bg-surface), 0.85)'
      }}
    >
      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {hasGeneratedContent && (
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost"
              style={{
                padding: '0.4rem 0.6rem',
                marginRight: '0.25rem'
              }}
              aria-label="Back to notes editor"
              title="Back to notes editor"
            >
              <ChevronLeftIcon size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes</span>
            </button>
          )}

          <div
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer'
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onReset()}
            aria-label="StudySpark Home"
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 10px rgba(79, 70, 229, 0.35)'
              }}
            >
              <SparklesIcon size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                  }}
                >
                  Study<span className="gradient-text">Spark</span>
                </span>
                <span
                  className="badge badge-brand"
                  style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}
                >
                  AI Studio
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.2
                }}
              >
                Turn your notes into interactive learning.
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}

