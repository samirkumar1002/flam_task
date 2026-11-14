/**
 * Client API Service for StudySpark
 * Communicates with the backend /api/generate endpoint.
 * Supports AbortSignal for stale request cancellation.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function generateStudyContent({ input, mode, difficulty, count, signal }) {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        mode,
        difficulty,
        count
      }),
      signal
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = responseData?.error || `Server responded with status ${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      error.code = responseData?.code || 'API_ERROR';
      error.status = response.status;
      error.details = responseData?.details;
      throw error;
    }

    if (!responseData || !responseData.success || !responseData.data) {
      const error = new Error(responseData?.error || 'Malformed payload received from study server.');
      error.code = 'INVALID_PAYLOAD';
      throw error;
    }

    return responseData.data;
  } catch (err) {
    if (err.name === 'AbortError') {
      // Re-throw AbortError so caller can identify aborted request
      throw err;
    }

    // Network / offline error check
    if (!navigator.onLine) {
      const error = new Error('You appear to be offline. Please check your internet connection.');
      error.code = 'NETWORK_OFFLINE';
      throw error;
    }

    throw err;
  }
}

