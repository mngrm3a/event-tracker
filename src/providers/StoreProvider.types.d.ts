export interface EventData {
  id: number;
  timestamp: number;
  type: string;
}

export type Job =
  | { type: 'merge'; payload: EventData }
  | { type: 'reload'; payload: Date };
