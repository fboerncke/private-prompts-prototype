// src/interfaces/PromptInterface.ts

export interface Prompt {
  id: number;
  description: string;
  prompt: string;
  comment: string;
  platforms: string[];
  tags: string[];
  isFavorite: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
