// src/store/historyStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { HistoryEntry } from "../interfaces/HistoryEntryInterface";
import { PersistenceService } from '../services/PersistenceService';
import { generateUniqueId } from "../utils/GenericHelpers";
import { debounce } from "lodash";

export const useHistoryStore = defineStore("historyStore", () => {
  // State
  const history = ref<HistoryEntry[]>([]);
  const persistenceService = new PersistenceService();

  // Actions
  const loadHistory = async () => {
    try {
      const loadedHistory = await persistenceService.loadHistory();
      if (loadedHistory && loadedHistory.length > 0) {
        // Ensure each entry conforms to the HistoryEntry interface
        history.value = loadedHistory.map((entry: Partial<HistoryEntry>) => ({
          id: entry.id || generateUniqueId(),
          content: entry.content || "",
          type: entry.type || "source",
          operation: entry.operation || "processed",
        }));
      } else {
        history.value = [];
      }
    } catch (error) {
      console.error("Error loading history:", error);
      history.value = [];
    }
  };

  // Debounce saveHistory to prevent excessive writes
  const saveHistoryDebounced = debounce(async () => {
    try {
      await persistenceService.saveHistory(history.value);
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }, 500);

  const saveHistory = async () => {
    await saveHistoryDebounced();
  };

  // Action to add a new history entry
  const addHistoryEntry = (entry: Omit<HistoryEntry, "id">) => {
    const newEntry: HistoryEntry = {
      id: generateUniqueId(),
      ...entry,
    };
    history.value.push(newEntry);
    saveHistory();
  };
  // Action to clear history
  const clearHistory = () => {
    history.value = [];
    saveHistory();
  };

  return {
    history,
    loadHistory,
    saveHistory,
    addHistoryEntry,
    clearHistory,
  };
});
