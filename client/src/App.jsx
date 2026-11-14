import React from 'react';
import Header from './components/Header.jsx';
import StudyInput from './components/StudyInput.jsx';
import FlashcardDeck from './components/FlashcardDeck.jsx';
import Quiz from './components/Quiz.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import EmptyState from './components/EmptyState.jsx';
import { useStudyGenerator } from './hooks/useStudyGenerator.js';
import { useTheme } from './hooks/useTheme.js';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    inputText,
    setInputText,
    selectedMode,
    setSelectedMode,
    difficulty,
    setDifficulty,
    itemCount,
    setItemCount,
    generatedData,
    loading,
    loadingMessage,
    error,
    errorDetails,
    generate,
    retry,
    resetToInput
  } = useStudyGenerator();

  const hasGeneratedContent = Boolean(generatedData);

  return (
    <div className="app-container">
      {/* Sticky Top Navigation Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        hasGeneratedContent={hasGeneratedContent}
        onReset={resetToInput}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {loading ? (
          <LoadingState
            message={loadingMessage}
            onCancel={resetToInput}
          />
        ) : error ? (
          <ErrorState
            error={error}
            details={errorDetails}
            onRetry={retry}
            onEditInput={resetToInput}
          />
        ) : generatedData ? (
          generatedData.type === 'flashcards' ? (
            <FlashcardDeck
              data={generatedData}
              onGenerateNew={resetToInput}
            />
          ) : (
            <Quiz
              data={generatedData}
              onGenerateNew={resetToInput}
            />
          )
        ) : (
          <>
            <StudyInput
              inputText={inputText}
              setInputText={setInputText}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              itemCount={itemCount}
              setItemCount={setItemCount}
              onGenerate={generate}
              loading={loading}
            />
            <EmptyState onSelectSample={(sampleText) => setInputText(sampleText)} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-light)',
          background: 'var(--bg-surface)',
          padding: '1.5rem 1.25rem',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span>
            StudySpark &copy; {new Date().getFullYear()} — AI-Powered Active Learning Assistant
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Built with React, Express & Zero-Trust Schema Validation
          </span>
        </div>
      </footer>
    </div>
  );
}

