import React from 'react';
import { BookOpenIcon, HelpCircleIcon, SparklesIcon, LayersIcon } from './Icons.jsx';

export default function EmptyState({ onSelectSample }) {
  const features = [
    {
      icon: BookOpenIcon,
      title: 'Active Recall Flashcards',
      description: '3D flip cards with self-grading ("Know it" / "Review again") and dedicated review mode to target weak spots.'
    },
    {
      icon: HelpCircleIcon,
      title: 'Pedagogical Quizzes',
      description: 'Multiple choice tests with instant correctness indicators, rich explanations, and retry-missed-answers mode.'
    },
    {
      icon: LayersIcon,
      title: 'Zero-Trust Structured AI',
      description: 'Strict schema validation, resilient race-condition protection, and zero conversational clutter.'
    }
  ];

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <span
          className="badge badge-brand"
          style={{ marginBottom: '0.5rem' }}
        >
          Pedagogical Features
        </span>
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}
        >
          Engineered for Maximum Retention
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="card-surface"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  margin: 0
                }}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

