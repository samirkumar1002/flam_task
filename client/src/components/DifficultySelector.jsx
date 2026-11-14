import React from 'react';

export default function DifficultySelector({
  difficulty,
  onSelectDifficulty,
  itemCount,
  onSelectItemCount,
  disabled = false
}) {
  const difficulties = [
    { id: 'easy', label: 'Easy', desc: 'Foundations' },
    { id: 'medium', label: 'Medium', desc: 'Conceptual' },
    { id: 'hard', label: 'Hard', desc: 'Analytical' }
  ];

  const counts = [5, 10, 15];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}
    >
      {/* Difficulty Selection */}
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
          Difficulty Level
        </label>
        <div
          role="radiogroup"
          aria-label="Select study difficulty"
          style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}
        >
          {difficulties.map((level) => {
            const isSelected = difficulty === level.id;
            return (
              <button
                key={level.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => onSelectDifficulty(level.id)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--bg-surface)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>{level.label}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: isSelected ? 'var(--text-muted)' : 'var(--text-muted)',
                    opacity: 0.8
                  }}
                >
                  {level.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Count Selection */}
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
          Number of Items
        </label>
        <div
          role="radiogroup"
          aria-label="Select item count"
          style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}
        >
          {counts.map((countVal) => {
            const isSelected = itemCount === countVal;
            return (
              <button
                key={countVal}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => onSelectItemCount(countVal)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--bg-surface)' : 'transparent',
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>{countVal}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    opacity: 0.8
                  }}
                >
                  {countVal === 5 ? 'Quick' : countVal === 10 ? 'Standard' : 'In-depth'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

