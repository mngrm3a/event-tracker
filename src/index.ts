import { onDayChange } from "./day_change";
import { Store } from "./store";
import { TodayView } from "./today_view";

// --- Helpers ---
/**
 * Converts a collection of timestamps into an hourly event frequency distribution.
 * 
 * @param dates Collection of timestamps to analyze
 * @returns An array of 24 integers where index [0-23] represents the hour
 *          and the value represents the number of events that occurred in that hour
 */
function getHourlyEventDistribution(dates: Date[]): number[] {
    const counts = Array(24).fill(0);
    dates.forEach(d => counts[d.getHours()]++);
    return counts;
}

/**
 * Throws an error if value is null or undefined.
 * Used for strict null checks on DOM elements.
 * @param v Value to check
 * @param msg Optional error message
 */
function assertNotNull<T>(v: T, msg?: string): asserts v is NonNullable<T> {
    if (v == null) throw new Error(msg);
}

// --- Main Initialization ---
// Query SVG and required groups from DOM
const svg = document.querySelector("svg") as SVGSVGElement;
const defs = document.querySelector("svg defs") as SVGDefsElement | null;
const timeLabels = document.querySelector("#timeLabels") as SVGGElement | null;
const valueLabels = document.querySelector("#valueLabels") as SVGGElement | null;
const counterLabel = document.querySelector("#counterLabel") as SVGGElement | null;
const radialBars = document.querySelector("#radialBars") as SVGGElement | null;
const button = document.querySelector("#button") as SVGGElement | null;

// Ensure all required SVG elements exist
assertNotNull(svg, "svg missing");
assertNotNull(defs, "defs missing");
assertNotNull(timeLabels, "dataLabels missing");
assertNotNull(valueLabels, "valueLabels missing");
assertNotNull(counterLabel, "counterLabel missing");
assertNotNull(radialBars, "radialBars missing");
assertNotNull(button, "button missing");

// Create store and chart instances
const store = await Store.create();
const todayView = TodayView.create(svg, defs, timeLabels, valueLabels, counterLabel, radialBars);

// Initial chart rendering: load today's data and set it
const data = await store.getEvents(new Date()).then(getHourlyEventDistribution)
todayView.setData(data);

// Add click event to button: save new timestamp and update chart
button.addEventListener("click", () => {
    navigator.locks.request('update-today', async () => {
        const now = new Date();
        await store.addEvent(now);
        const events = await store.getEvents(now);
        const data = getHourlyEventDistribution(events);
        todayView.setData(data);
    });
});

// Update chart on day change: load new data for the new day
const dayWatcher = onDayChange((now) => {
    navigator.locks.request('update-today', async () => {
        const events = await store.getEvents(now);
        const data = getHourlyEventDistribution(events);
        todayView.setData(data);
    });
});

// Cleanup when page is closed or refreshed
window.addEventListener("beforeunload", () => {
    dayWatcher.stop();
});