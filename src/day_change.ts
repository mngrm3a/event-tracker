/**
 * Type representing the object returned by onDayChange
 */
type DayChangeWatcher = {
    stop(): void; // Stops the timer and removes event listeners
};

/**
 * Calls the provided callback when the local day changes.
 * Handles midnight transitions and tab/device sleep.
 *
 * @param callback Function to run when the day changes (e.g., reload UI)
 * @returns An object with a stop() method to cancel timers and listeners
 */
export function onDayChange(callback: (now: Date) => void): DayChangeWatcher {
    // Track the last seen day (1–31) to detect day changes
    let lastDay = new Date().getDate();
    let timerId: number | null = null;

    /**
     * Check if the day has changed since last check.
     * If it has, update lastDay and call the user callback.
     */
    function triggerIfNewDay() {
        const now = new Date();
        if (now.getDate() !== lastDay) {
            lastDay = now.getDate();
            callback(now);
        }
    }

    /**
     * Schedule a one-shot timer to fire at the next local midnight.
     * After firing, it automatically reschedules for the following midnight.
     */
    function scheduleNextMidnight() {
        if (timerId != null) clearTimeout(timerId); // clear any existing timer

        const now = new Date();
        // Next local midnight: year, month, day + 1 at 00:00:00
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = nextMidnight.getTime() - now.getTime();

        timerId = window.setTimeout(() => {
            triggerIfNewDay();       // check if day changed
            scheduleNextMidnight();  // reschedule for the next midnight
        }, msUntilMidnight);
    }

    /**
     * Event handlers to detect missed day changes when tab becomes visible
     * or window gains focus (covers most mobile sleep scenarios)
     */
    const onVisibility = () => {
        if (!document.hidden) triggerIfNewDay();
    };
    const onFocus = () => triggerIfNewDay();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    // Start initial schedule
    scheduleNextMidnight();

    /**
     * Return an object with a stop() method for cleanup.
     * Useful for page unloads, SPA route changes, or memory management.
     */
    return {
        stop() {
            if (timerId != null) clearTimeout(timerId);
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("focus", onFocus);
        }
    };
}
