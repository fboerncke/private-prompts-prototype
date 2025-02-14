// src/store/rulesStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Rule } from "../interfaces/RuleInterface";
import { PersistenceService } from '../services/PersistenceService';

export const useRulesStore = defineStore("rulesStore", () => {
  const rules = ref<Rule[]>([]);
  const persistenceService = new PersistenceService();

  // Global variable to keep track of the last assigned ID
  let lastAssignedId = 0;

  const generateRuntimeUniqueId = () => {
    return ++lastAssignedId;
  };

  const getRules = () => {
    return rules.value;
  }

  const refreshRules = async () => {
    await loadRules(); // Reuse the existing loadRules logic to refresh rules from persistence
  };
  const loadRules = async () => {
    try {
      const rawRules = await persistenceService.loadRules();

      // Assign unique IDs and filter out empty rules during load
      rules.value = rawRules
        .map((rule: Rule) => ({
          ...rule,
          id: generateRuntimeUniqueId(),
        }))
        .filter((rule: Rule) => {
          const pattern = rule.userDefinedSensitiveDataPattern?.trim();
          const placeholder = rule.userDefinedTemporaryPlaceholder?.trim();
          return pattern || placeholder; // Keep only non-empty rules
        });
    } catch (error) {
      console.error("Error loading rules:", error);
      rules.value = [];
    }
  };

  const saveRules = async () => {
    // Filter out empty rules before saving
    const validRules = rules.value
      .filter((rule) => {
        const pattern = rule.userDefinedSensitiveDataPattern?.trim();
        const placeholder = rule.userDefinedTemporaryPlaceholder?.trim();
        return pattern && placeholder; // Keep only non-empty rules
      })
      .map(({ id: _id, ...rest }) => rest);

    // Save only the valid rules
    await persistenceService.saveRules(validRules);
  };

  const importRules = async (importedRules: Rule[]) => {
    // Assign IDs to imported rules and filter out empty ones
    const rulesWithIds = importedRules
      .map((rule) => ({
        ...rule,
        id: generateRuntimeUniqueId(),
      }))
      .filter((rule) => {
        const pattern = rule.userDefinedSensitiveDataPattern?.trim();
        const placeholder = rule.userDefinedTemporaryPlaceholder?.trim();
        return pattern || placeholder; // Keep only non-empty rules
      });
    // rules.value.push(...rulesWithIds);
    // Check for duplicates
    for (const importedRule of rulesWithIds) {
      const duplicate = rules.value.find(
        (existingRule) =>
          existingRule.userDefinedSensitiveDataPattern.trim() ===
          importedRule.userDefinedSensitiveDataPattern.trim() &&
          existingRule.userDefinedTemporaryPlaceholder.trim() ===
          importedRule.userDefinedTemporaryPlaceholder.trim()
      );

      if (!duplicate) {
        // If no duplicate found, add the rule
        rules.value.push(importedRule);
      }
    }
    await saveRules();
  };

  return {
    getRules,
    rules,
    loadRules,
    refreshRules,
    saveRules,
    importRules,
    generateRuntimeUniqueId,
  };
});
