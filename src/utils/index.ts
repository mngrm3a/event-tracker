export function areDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function createAlternatingArray<T>(
  length: number,
  value1: T,
  value2: T,
): T[] {
  return Array.from({ length }, (_, i) => (i % 2 === 0 ? value1 : value2));
}

export function oklchSetAlpha(color: string, alpha: number): string {
  // Remove trailing spaces just in case
  color = color.trim();

  // If color already has a slash, replace alpha
  if (color.includes('/')) {
    return color.replace(/\/\s*[\d.]+/, `/ ${alpha}`);
  }

  // Insert alpha using the modern / <alpha> syntax
  // e.g., "oklch(70.7% 0.165 254.624)" → "oklch(70.7% 0.165 254.624 / 0.5)"
  return color.replace(/\)$/, ` / ${alpha})`);
}
