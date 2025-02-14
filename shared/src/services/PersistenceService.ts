// src/PersistenceService.ts

import { AppConfiguration, PersistableAppConfiguration } from "../interfaces/AppConfigurationInterface";
import type { HistoryEntry } from "../interfaces/HistoryEntryInterface";
import { PersistenceInterface } from "../interfaces/PersistenceInterface";
import type { Prompt } from "../interfaces/PromptInterface";
import type { Rule } from "../interfaces/RuleInterface";
import { getPersistence } from '../services/PersistenceProvider';

/**
 * PersistenceService
 *
 * A service abstraction that delegates persistence operations to a configured 
 * PersistenceInterface implementation. It handles loading and saving of 
 * prompts, rules, history, theme, and OpenAI API key, as well as exporting data.
 */
export class PersistenceService {

  private persistence: PersistenceInterface;

  constructor() {
    this.persistence = getPersistence();
  }

  /**
   * Loads prompts from the persistent storage.
   * @returns An array of prompts or an empty array if none are stored.
   */
  async loadPrompts(): Promise<Prompt[]> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    return data.prompts || []; // Return the prompts array or empty if not found
  }

  /**
   * Saves prompts to the stored JSON data.
   * @param prompts - An array of prompts to save.
   */
  async savePrompts(prompts: Prompt[]): Promise<void> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    data.prompts = prompts; // Update the prompts in the stored data
    await this.persistence.saveAppConfiguration(data);
  }

  /**
  * Loads the list of rules from persistent storage.
  * @returns A Promise resolving to an array of Rule objects, or an empty array if none are found.
  */
  async loadRules(): Promise<Rule[]> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    return data.rules || []; // Return the prompts array or empty if not found
  }

  /**
  * Saves the provided array of rules to persistent storage.
  * @param rules - The array of Rule objects to be saved.
  * @returns A Promise that resolves once the rules have been saved.
  */
  async saveRules(rules: Rule[]): Promise<void> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    data.rules = rules; // Update the prompts in the stored data
    await this.persistence.saveAppConfiguration(data);
  }

  /**
   * Loads the history entries from persistent storage.
   * @returns A Promise resolving to an array of HistoryEntry objects, or an empty array if none are found.
   */
  async loadHistory(): Promise<HistoryEntry[]> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    return data.history || []; // Return the prompts array or empty if not found
  }

  /**
   * Saves the provided history entries array to persistent storage.
   * @param history - The array of HistoryEntry objects to be saved.
   * @returns A Promise that resolves once the history has been saved.
   */
  async saveHistory(history: HistoryEntry[]): Promise<void> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    data.history = history; // Update the prompts in the stored data
    await this.persistence.saveAppConfiguration(data);
  }

  /**
   * Loads the current theme from the stored JSON data.
   * @returns The theme string or 'light' if not set.
   */
  async loadTheme(): Promise<string> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    return data.theme || "light"; // default is 'light'
  }

  /**
   * Saves the current theme to the stored JSON data.
   * @param theme - The theme string to save.
   */
  async saveTheme(theme: string): Promise<void> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    data.theme = theme;
    await this.persistence.saveAppConfiguration(data);
  }

  /**
   * Loads the OpenAI API Key from the stored JSON data.
   * @returns The OpenAI API Key string or undefined if not set.
   */
  async loadOpenAIKey(): Promise<string | undefined> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    if (!data.openAIKey) return undefined;

    const storedKey = data.openAIKey;

    if (this.isBase64(storedKey)) {
      const decodedKey = Buffer.from(storedKey, "base64").toString();
      return decodedKey;
    } else {
      console.log("Plaintext API key detected. Migrating to Base64.");
      await this.saveOpenAIKey(storedKey);
      return storedKey;
    }
  }

  /**
   * Saves the OpenAI API Key to the stored JSON data.
   * Note: This implementation uses Base64 encoding for basic obfuscation, but it is not a secure encryption method.
   * The key should be treated as plain text from a security perspective.
   * Users must ensure their computer and environment are properly secured when using the optional OpenAI feature in "Private Prompts".
   * 
   * @param key - The OpenAI API Key to save.
   */
  async saveOpenAIKey(key: string): Promise<void> {
    const data: AppConfiguration = await this.persistence.loadAppConfiguration();
    data.openAIKey = Buffer.from(key).toString("base64"); // Base64-Kodierung
    await this.persistence.saveAppConfiguration(data);
  }

  /**
   * Exports the current application state as a downloadable JSON file.
   * It includes versioning and timestamp information in the exported file.
   */
  async exportJSON(): Promise<void> {
    const parsedData: AppConfiguration = await this.persistence.loadAppConfiguration();
    if (parsedData) {
      // Add version and dateExported fields
      const version = "0.002";
      const dateExported = this.getLocalDateTime(); // Format as 'YYYY-MM-DD hh:mm:ss'

      const parsedDataWithoutId = this.removeInternalIdsFromJSON(parsedData);

      const exportData = {
        ...parsedDataWithoutId,
        version: version,
        dateExported: dateExported,
      };

      const formattedState = JSON.stringify(exportData, null, 2);
      const blob = new Blob([formattedState], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "private-prompts-backup-" + dateExported + ".json";
      link.click();
    } else {
      console.error("No data found to export");
    }
  }

  /**
   * Removes all 'id' properties from prompts, rules, and history entries in the provided config.
   * Useful for exporting data without internal identifiers.
   * 
   * @param appConfigurationWithIds - The current application configuration.
   * @returns The configuration without internal ids.
   */
  removeInternalIdsFromJSON(appConfigurationWithIds: AppConfiguration): PersistableAppConfiguration {
    return {
      prompts: (appConfigurationWithIds.prompts || []).map(({ id: _id, ...rest }: Prompt) => rest),
      rules: (appConfigurationWithIds.rules || []).map(({ id: _id, ...rest }: Rule) => rest),
      history: (appConfigurationWithIds.history || []).map(({ id: _id, ...rest }: HistoryEntry) => rest),
      theme: appConfigurationWithIds.theme,
      openAIKey: appConfigurationWithIds.openAIKey,
      preferredLocale: appConfigurationWithIds.preferredLocale,
      version: appConfigurationWithIds.version,
    };
  }

  /**
   * Resets and assigns sequential numeric IDs to each entry in prompts, rules, and history arrays.
   * Useful for reinitializing IDs after data import or modification.
   * 
   * @param appConfigurationWithoutIds - The application configuration to process.
   * @returns The configuration with sequentially assigned IDs.
   */
  createInternalIdsForJSON(appConfigurationWithoutIds: PersistableAppConfiguration): AppConfiguration {
    // determine locale or fallback to default 'de'
    let locale = 'de';
    if (appConfigurationWithoutIds.preferredLocale) {
      locale = appConfigurationWithoutIds.preferredLocale;
    }
    return {
      prompts: (appConfigurationWithoutIds.prompts || []).map(
        (prompt, index): Prompt => ({ id: index, ...prompt }) // Add 'id' directly
      ),
      rules: (appConfigurationWithoutIds.rules || []).map(
        (rule, index): Rule => ({ id: index, ...rule }) // Add 'id' directly
      ),
      history: (appConfigurationWithoutIds.history || []).map(
        (historyEntry, index): HistoryEntry => ({ id: index, ...historyEntry }) // Add 'id' directly
      ),
      theme: appConfigurationWithoutIds.theme,
      openAIKey: appConfigurationWithoutIds.openAIKey,
      preferredLocale: locale,
      version: appConfigurationWithoutIds.version,
    };
  }

  /**
   * Checks if a string is valid Base64 encoded
   * @param str - The string to check.
   * @returns True if the string is valid Base64, false otherwise.
   */
  isBase64(str: string): boolean {
    if (!str || str.trim() === "") {
      return false; // Reject empty or whitespace-only strings
    }

    // Base64-Regex: Must be in 4-character blocks (optional padding "=")
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
      ;

    if (!base64Regex.test(str)) {
      return false; // Regex fails => not Base64
    }

    try {
      const decoded = Buffer.from(str, "base64").toString("utf-8");

      // Check if the decoding is valid (no gibberish)
      return Buffer.from(decoded, "utf-8").toString("base64") === str;
    } catch (error) {
      console.warn("Error decoding Base64:", error);

      return false; // If an exception occurs => not Base64
    }
  }

  /**
   * Generates a formatted local date and time string.
   * @returns A string in the format 'YYYY-MM-DD hh:mm:ss'.
   */
  private getLocalDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
