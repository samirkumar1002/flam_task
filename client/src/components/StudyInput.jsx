import React, { useState } from 'react';
import ModeSelector from './ModeSelector.jsx';
import DifficultySelector from './DifficultySelector.jsx';
import { SparklesIcon, BookOpenIcon, AlertTriangleIcon } from './Icons.jsx';
import { SAMPLE_TOPICS, TEST_ERROR_PRESETS } from '../utils/sampleNotes.js';

export default function StudyInput({
  inputText,
  setInputText,
  selectedMode,
  setSelectedMode,
  difficulty,
  setDifficulty,
  itemCount,
  setItemCount,
  onGenerate,
  loading
}) {
  const [showTestPresets, setShowTestPresets] = useState(false);
  const isInputEmpty = !inputText.trim();

  const handleSelectSample = (sampleText) => {
    setInputText(sampleText);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div
      className="card-surface"
      style={{
        padding: '2rem 1.75rem',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-surface)'
      }}
    >
      {/* Intro Header */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '0.4rem',
            lineHeight: 1.2
          }}
        >
          Transform Notes into <span className="gradient-text">Interactive Mastery</span>
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto'
          }}
        >
          Paste lecture notes, study outlines, or any topic. StudySpark generates curriculum-grade flashcards and quizzes instantly.
        </p>
      </div>

      {/* Quick Sample Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            ⚡ Quick Samples:
          </span>
          <button
            type="button"
            onClick={() => setShowTestPresets((prev) => !prev)}
            className="btn-ghost"
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--brand-primary)' }}
          >
            {showTestPresets ? 'Hide Test Presets' : '🧪 Assignment Test Cases'}
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SAMPLE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              disabled={loading}
              onClick={() => handleSelectSample(topic.text)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                transition: 'all var(--transition-fast)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.background = 'var(--brand-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.background = 'var(--bg-subtle)';
              }}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Assignment Evaluation Presets */}
        {showTestPresets && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--color-warning-bg)',
              border: '1px solid var(--color-warning-border)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <AlertTriangleIcon size={16} className="text-warning" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-warning-text)' }}>
                Assignment Robustness Evaluation Triggers:
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {TEST_ERROR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectSample(preset.text)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffffff',
                    border: '1px solid var(--color-warning-border)',
                    color: 'var(--color-warning-text)',
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Study Input Textarea */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <label
          htmlFor="study-notes-input"
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
          Study Notes or Concepts
        </label>
        <textarea
          id="study-notes-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          placeholder="Paste lecture notes, textbook excerpts, or enter a topic (e.g., 'React Hooks and Component Lifecycle', 'Photosynthesis Light Reactions', or 'French Revolution Turning Points')..."
          rows={7}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '0.975rem',
            lineHeight: 1.6,
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--border-medium)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--brand-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-medium)';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Sub-bar: Character count & Clear */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.35rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>{inputText.length} characters</span>
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-ghost"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.78rem' }}
            >
              Clear notes
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          disabled={loading}
        />
      </div>

      {/* Difficulty & Count Selectors */}
      <div style={{ marginBottom: '2rem' }}>
        <DifficultySelector
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          itemCount={itemCount}
          onSelectItemCount={setItemCount}
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="button"
          onClick={() => onGenerate()}
          disabled={isInputEmpty || loading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1.05rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <SparklesIcon size={20} />
          <span>{loading ? 'Generating Study Material...' : 'Generate Study Material'}</span>
        </button>

        {isInputEmpty && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.5rem'
            }}
          >
            Enter notes or select a sample topic above to activate generation.
          </p>
        )}
      </div>
    </div>
  );
}

