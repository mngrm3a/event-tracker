export interface EventData {
  id: number;
  timestamp: number;
}

export type Job =
  | { type: 'merge'; payload: EventData }
  | { type: 'reload'; payload: Date };
