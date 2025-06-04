// hooks/useCountdown.ts
import { useState, useEffect, useCallback } from "react";

type CountdownOptions = {
  persist?: boolean;
  persistKey?: string;
};

/**
 * A hook for managing countdown timers with formatting
 * @param initialTime Initial time in seconds (default: 0)
 * @param options Optional configuration for persistence
 */
export function useCountdown(initialTime = 0, options: CountdownOptions = {}) {
  const { persist = false, persistKey = "countdown_timer" } = options;

  // Initialize state with persisted value if enabled
  const [seconds, setSeconds] = useState(() => {
    if (persist) {
      try {
        const savedCountdown = localStorage.getItem(persistKey);
        if (savedCountdown) {
          const { value, expiry } = JSON.parse(savedCountdown);
          // Check if the saved countdown is still valid
          if (expiry > Date.now()) {
            // Calculate remaining time
            return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
          }
        }
      } catch (error) {
        console.error("Error reading countdown from storage:", error);
      }
    }
    return initialTime;
  });

  const [isActive, setIsActive] = useState(seconds > 0);

  // Format time as mm:ss
  const formatTime = useCallback(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [seconds]);

  // Start countdown with a specific time
  const startCountdown = useCallback(
    (time = 180) => {
      setSeconds(time);
      setIsActive(true);

      if (persist) {
        try {
          const expiry = Date.now() + time * 1000;
          localStorage.setItem(
            persistKey,
            JSON.stringify({ value: time, expiry }),
          );
        } catch (error) {
          console.error("Error saving countdown to storage:", error);
        }
      }
    },
    [persist, persistKey],
  );

  // Reset the countdown
  const resetCountdown = useCallback(() => {
    setSeconds(0);
    setIsActive(false);

    if (persist) {
      try {
        localStorage.removeItem(persistKey);
      } catch (error) {
        console.error("Error removing countdown from storage:", error);
      }
    }
  }, [persist, persistKey]);

  // Countdown timer effect
  useEffect(() => {
    let intervalId: number | undefined;

    if (isActive && seconds > 0) {
      intervalId = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          const newValue = prevSeconds - 1;

          // Update persisted value if needed
          if (persist && newValue >= 0) {
            try {
              const expiry = Date.now() + newValue * 1000;
              localStorage.setItem(
                persistKey,
                JSON.stringify({ value: newValue, expiry }),
              );
            } catch (error) {
              // Silent fail for storage errors
            }
          }

          if (newValue <= 0) {
            setIsActive(false);
            clearInterval(intervalId);
            return 0;
          }

          return newValue;
        });
      }, 1000);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, persist, persistKey, seconds]); // Added seconds to dependency array

  return {
    seconds,
    isActive,
    startCountdown,
    resetCountdown,
    formatTime,
    // Additional utility
    percentage: seconds > 0 ? Math.min(100, (seconds / 180) * 100) : 0,
  };
}
