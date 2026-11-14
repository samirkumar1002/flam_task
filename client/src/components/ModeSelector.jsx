import React from 'react';
import { BookOpenIcon, HelpCircleIcon } from './Icons.jsx';

export default function ModeSelector({ selectedMode, onSelectMode, disabled = false }) {
  const modes = [
    {
      id: 'flashcards',
      label: 'Flashcards',
      desc: 'Interactive 3D flip cards for active recall and review',
      icon: BookOpenIcon
    },
    {
      id: 'quiz',
      label: 'Quiz',
      desc: 'Multiple-choice test with scoring and detailed explanations',
      icon: HelpCircleIcon
    }
  ];

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}
      >
        Select Study Mode
      </label>
      <div
        role="radiogroup"
        aria-label="Study mode selection"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectMode(mode.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected
                  ? '2px solid var(--brand-primary)'
                  : '2px solid var(--border-light)',
                background: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.12)' : 'none'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--brand-primary)' : 'var(--bg-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.975rem' }}>{mode.label}</span>
                  {isSelected && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-primary)'
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    margin: '0.2rem 0 0 0',
                    lineHeight: 1.35
                  }}
                >
                  {mode.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

