// src/interfaces/HistoryEntryInterface.ts

export interface HistoryEntry {
  id: number; // Unique identifier
  content: string;
  type: "source" | "result";
  operation: "masked" | "unmasked" | "marked" | "processed" | "clone";
}
