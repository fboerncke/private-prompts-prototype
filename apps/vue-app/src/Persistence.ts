// src/Persistence.ts

import { DEFAULT_BUCKET_NAME, DEFAULT_JSON_CONFIGURATION } from '@private-prompts/shared/constants/DefaultAppConfiguration';
import { AppConfiguration } from "@private-prompts/shared/interfaces/AppConfigurationInterface";
import type { PersistenceInterface } from "@private-prompts/shared/interfaces/PersistenceInterface";
import type { Prompt } from "@private-prompts/shared/interfaces/PromptInterface";
import { PersistenceService } from "@private-prompts/shared/services/PersistenceService";

export class Persistence implements PersistenceInterface {
  private storageKey = DEFAULT_BUCKET_NAME;
  private configurationCache: AppConfiguration | null = null;

  /**
   * @returns Parsed JSON object or an empty object if no data is found.
   */
  async loadAppConfiguration(): Promise<AppConfiguration> {
    if (this.configurationCache) {
      console.log("loadAppConfiguration: from cache");
      return this.configurationCache; // Return from cache
    }

    console.log("loadAppConfiguration: from local storage");

    const data = localStorage.getItem(this.storageKey);
    if (data == null || data == undefined || Object.keys(data).length === 0) {
      console.info("Initialize with default data:");
      await this.saveAppConfiguration(DEFAULT_JSON_CONFIGURATION);
      return DEFAULT_JSON_CONFIGURATION;
    }

    const parsedData = data ? JSON.parse(data) : DEFAULT_JSON_CONFIGURATION;
    const persistenceService = new PersistenceService();
    const parsedDataWithIds = persistenceService.createInternalIdsForJSON(parsedData);

    if (parsedDataWithIds.prompts && Array.isArray(parsedDataWithIds.prompts)) {
      parsedDataWithIds.prompts = parsedDataWithIds.prompts.map(
        (prompt: Prompt) => ({
          ...prompt,
          createdAt: prompt.createdAt || new Date().toISOString(),
          updatedAt: prompt.updatedAt || new Date().toISOString(),
        }),
      );
    }

    this.configurationCache = parsedDataWithIds; // Update cache
    return parsedDataWithIds;
  }

  /**
   * Saves JSON data to localStorage.
   * @param data - The JSON object to save.
   */
  async saveAppConfiguration(data: AppConfiguration): Promise<void> {
    console.log("saveAppConfiguration ");

    const dataToSaveWithIds = { ...data };
    const persistenceService = new PersistenceService();
    const dataToSaveWithoutIds = persistenceService.removeInternalIdsFromJSON(dataToSaveWithIds);

    localStorage.setItem(this.storageKey, JSON.stringify(dataToSaveWithoutIds));
    this.configurationCache = data; // Update cache
  }

  /**
   * Returns the path to the configuration file.
   * return string "Browser Memory" as we are using localStorage
   */
  getAppConfigurationPath(): Promise<string> {
    return Promise.resolve("Browser Memory");
  }

}
