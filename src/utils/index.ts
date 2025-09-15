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
