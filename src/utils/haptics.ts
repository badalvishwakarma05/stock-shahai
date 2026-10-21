/**
 * Reusable Haptic Feedback Utility:
 * Safely triggers native vibration on mobile devices (e.g. Android Chrome).
 * Checks for API availability to prevent runtime errors on unsupported platforms (iOS Safari, desktop).
 */
export const triggerHaptic = (duration: number = 50): void => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Gracefully ignore devices where vibration permissions are restricted
    }
  }
};
