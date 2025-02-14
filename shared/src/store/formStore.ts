// src/store/formStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { HistoryEntry } from "../interfaces/HistoryEntryInterface";

export const useFormStore = defineStore("formStore", () => {
  const currentPrompt = ref<string>(""); // Assuming it's just a string
  const history = ref<HistoryEntry[]>([]); // Initialize history as an empty array

  return { currentPrompt, history };
});
