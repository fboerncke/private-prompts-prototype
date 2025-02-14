// src/store/promptStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Prompt } from "../interfaces/PromptInterface";
import { PersistenceService } from '../services/PersistenceService';
import { generateUniqueId } from "../utils/GenericHelpers";

export const usePromptStore = defineStore("promptStore", () => {
  // State
  const prompts = ref<Prompt[]>([]);
  const allTags = ref<string[]>([]);
  const allPlatforms = ref<string[]>([]);
  const persistenceService = new PersistenceService();

  const loadPrompts = async () => {
    try {
      const loadedPrompts = await persistenceService.loadPrompts();

      if (loadedPrompts && loadedPrompts.length > 0) {
        prompts.value = loadedPrompts.map((prompt: Prompt) => ({
          ...prompt,
          id: generateUniqueId(), // just to make sure in error case
          isFavorite: prompt.isFavorite || false,
          createdAt: prompt.createdAt || new Date().toISOString(),
          updatedAt: prompt.updatedAt || new Date().toISOString(),
          tags: prompt.tags || [],
          platforms: prompt.platforms || [],
        }));
      }
      updateAllTags();
      updateAllPlatforms();
    } catch (error) {
      console.error("Error loading prompts:", error);
      updateAllTags();
      updateAllPlatforms();
    }
  };

  const updateAllTags = () => {
    const tagsSet = new Set<string>();
    prompts.value.forEach((prompt) => {
      prompt.tags.forEach((tag: string) => tagsSet.add(tag));
    });
    allTags.value = Array.from(tagsSet);
  };

  const updateAllPlatforms = () => {
    const platformsSet = new Set<string>();
    prompts.value.forEach((prompt) => {
      prompt.platforms.forEach((platform: string) =>
        platformsSet.add(platform),
      );
    });
    allPlatforms.value = Array.from(platformsSet);
  };

  const savePrompts = async () => {
    await persistenceService.savePrompts(prompts.value);
  };

  return {
    prompts,
    allTags,
    allPlatforms,
    loadPrompts,
    savePrompts,
    updateAllTags,
    updateAllPlatforms,
  };
});
