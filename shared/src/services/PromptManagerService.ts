// src/services/PromptManagerService.ts

import { AppConfiguration } from '../interfaces/AppConfigurationInterface';
import type { HistoryEntry } from "../interfaces/HistoryEntryInterface";
import type { Rule } from "../interfaces/RuleInterface";
import { getAIResponse } from "./AIService";
import { getPersistence } from './PersistenceProvider';
import { SensitiveDataAnonymizer } from "./SensitiveDataAnonymizer";

// Constants used for marking sensitive sections in text.
const SENSITIVE_TAG_OPEN = "<sensitive>";
const SENSITIVE_TAG_CLOSE = "</sensitive>";

/**
 * Factory function to create a prompt service instance.
 * It encapsulates functionality for masking, unmasking, marking sensitive data,
 * sending prompts to AI, saving prompt data, and parsing content.
 *
 * @param replacementRules - Array of rules to initialize the SensitiveDataAnonymizer.
 * @returns An object with methods for prompt management and sensitive data handling.
 */
export const createPromptService = (replacementRules: Rule[]
) => {
  const persistence = getPersistence();
  const anonymizer = new SensitiveDataAnonymizer(replacementRules);

  return {
    /**
   * Masks sensitive data in the provided prompt using the anonymizer.
   * @param prompt - The input text containing potentially sensitive data.
   * @returns The text with sensitive data replaced by fake values.
   */
    async maskSensitiveData(prompt: string): Promise<string> {
      return anonymizer.maskSensitiveData(prompt);
    },

    /**
    * Reverts previously masked data in the prompt back to its original form.
    * @param prompt - The text with masked sensitive data.
    * @returns The unmasked original text.
    */
    async unmaskPrompt(prompt: string): Promise<string> {
      return anonymizer.unmaskSensitiveData(prompt);
    },

    /**
     * Marks sensitive portions of the prompt by wrapping them with <sensitive> tags.
     * @param prompt - The input text containing potentially sensitive data.
     * @returns The text with sensitive data sections marked.
     */
    async markSensitiveData(prompt: string): Promise<string> {
      return anonymizer.markSensitiveData(prompt);
    },

    /**
      * Sends the prompt to the AI service and returns the AI's response.
      * @param prompt - The prompt text to send to AI.
      * @returns The AI's response as a string.
      */
    async sendToAI(prompt: string): Promise<string> {
      return await getAIResponse(prompt);
    },

    /**
     * Saves the current prompt and its history to persistent storage.
     * @param prompt - The current prompt text.
     * @param history - Array of history entries related to the prompt.
     */
    async savePromptData(prompt: string, history: HistoryEntry[]) {
      try {
        const existingData: AppConfiguration = await persistence.loadAppConfiguration();
        const mergedData = { ...existingData, currentPrompt: prompt, history };
        await persistence.saveAppConfiguration(mergedData);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    },

    /**
     * Removes the <sensitive> markers from the given text.
     * @param text - The text containing sensitive markers.
     * @returns The text with all <sensitive> tags removed.
     */
    removeSensitiveMarkers(text: string): string {
      return text
        .replace(new RegExp(SENSITIVE_TAG_OPEN, "g"), "")
        .replace(new RegExp(SENSITIVE_TAG_CLOSE, "g"), "");
    },

    /**
     * Parses text containing <sensitive> tags and splits it into parts.
     * Each part indicates whether it's sensitive or not.
     * @param text - The input text with <sensitive> tags.
     * @returns An array of objects with 'text' and 'sensitive' boolean properties.
     */
    parseContent(text: string) {
      const parts = [];
      let lastIndex = 0;
      const regex = new RegExp(
        `${SENSITIVE_TAG_OPEN}(.*?)${SENSITIVE_TAG_CLOSE}`,
        "gs",
      );
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add non-sensitive text before the sensitive tag
        if (match.index > lastIndex) {
          parts.push({
            text: text.slice(lastIndex, match.index),
            sensitive: false,
          });
        }
        // Add sensitive text
        parts.push({ text: match[1], sensitive: true });
        lastIndex = regex.lastIndex;
      }
      // Add any remaining non-sensitive text
      if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), sensitive: false });
      }
      return parts;
    },
  };
};
