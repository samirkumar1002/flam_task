import React from 'react';
import { SunIcon, MoonIcon } from './Icons.jsx';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn-ghost"
      style={{
        padding: '0.5rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-light)'
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <SunIcon size={18} className="theme-icon sun" />
      ) : (
        <MoonIcon size={18} className="theme-icon moon" />
      )}
    </button>
  );
}

