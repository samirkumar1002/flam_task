import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard shortcuts for flashcards navigation:
 * - Left Arrow: Previous card
 * - Right Arrow: Next card
 * - Spacebar: Flip card
 *
 * Automatically disables navigation when user is typing in inputs or textareas.
 */
export function useKeyboardNavigation({ onPrev, onNext, onFlip, isEnabled = true }) {
  useEffect(() => {
    if (!isEnabled) return;

    function handleKeyDown(event) {
      const activeElement = document.activeElement;
      const tagName = activeElement ? activeElement.tagName.toUpperCase() : '';
      const isInputFocused =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        (activeElement && activeElement.isContentEditable);

      // Do not intercept if user is currently interacting with an input field
      if (isInputFocused) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (onPrev) {
            event.preventDefault();
            onPrev();
          }
          break;

        case 'ArrowRight':
          if (onNext) {
            event.preventDefault();
            onNext();
          }
          break;

        case ' ':
        case 'Spacebar':
          if (onFlip) {
            // Prevent space from scrolling the webpage
            event.preventDefault();
            onFlip();
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrev, onNext, onFlip, isEnabled]);
}

