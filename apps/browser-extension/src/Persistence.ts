// src/Persistence.ts

import { DEFAULT_BUCKET_NAME, DEFAULT_JSON_CONFIGURATION } from '@private-prompts/shared/constants/DefaultAppConfiguration';
import { AppConfiguration } from "@private-prompts/shared/interfaces/AppConfigurationInterface";
import type { PersistenceInterface } from "@private-prompts/shared/interfaces/PersistenceInterface";
import { Prompt } from "@private-prompts/shared/interfaces/PromptInterface";
import { PersistenceService } from "@private-prompts/shared/services/PersistenceService";
import browser from "webextension-polyfill";

export class Persistence implements PersistenceInterface {

  private storageKey = DEFAULT_BUCKET_NAME;
  private configurationCache: AppConfiguration | null = null;

  private isBrowserStorageAvailable(): boolean {
    return typeof browser.storage?.local !== "undefined";
  }

  // Function to clean up non-serializable objects
  private serializeData(data: AppConfiguration): AppConfiguration {
    return JSON.parse(JSON.stringify(data));
  }

  async loadAppConfiguration(): Promise<AppConfiguration> {
    try {
      console.log("Loading data...");
      if (this.configurationCache) {
        console.log("loadAppConfiguration: from cache");
        return this.configurationCache;
      }
      console.log("loadAppConfiguration: from local storage");

      let parsedData = undefined;

      if (this.isBrowserStorageAvailable()) {
        console.log("check browser local storage 1");
        const result = await browser.storage.local.get(this.storageKey);
        parsedData = result[this.storageKey];
      } else {
        console.log("check local storage 2");
        const result = localStorage.getItem(this.storageKey);
        if (result) {
          parsedData = JSON.parse(result)
        }
      }

      if (parsedData == null || parsedData == undefined || Object.keys(parsedData).length === 0) {
        console.info("Initialize with default data:");
        await this.saveAppConfiguration(DEFAULT_JSON_CONFIGURATION);
        return DEFAULT_JSON_CONFIGURATION;
      }

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
      console.log("before cache");
      this.configurationCache = parsedDataWithIds;
      console.log("after cache");
      return parsedDataWithIds
    } catch (error) {
      console.error("Failed to load data:", error);
      await this.saveAppConfiguration(DEFAULT_JSON_CONFIGURATION);
      return DEFAULT_JSON_CONFIGURATION;
    }
  }

  async saveAppConfiguration(data: AppConfiguration): Promise<void> {
    try {
      console.log("Saving data...");
      const serializableData = this.serializeData(data);

      const dataToSaveWithIds = { ...serializableData };
      const persistenceService = new PersistenceService();
      const dataToSaveWithoutIds = persistenceService.removeInternalIdsFromJSON(dataToSaveWithIds);

      if (this.isBrowserStorageAvailable()) {
        // console.log("Option 1");
        await browser.storage.local.set({
          [this.storageKey]: dataToSaveWithoutIds,
        });
      } else {
        // console.log("Option 2");
        localStorage.setItem(this.storageKey, JSON.stringify(dataToSaveWithoutIds));
      }
      console.log("Data saved:", dataToSaveWithoutIds);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }

  /**
   * Returns the path to the configuration file.
   * return string "Browser Memory" as we are using localStorage
   */
  getAppConfigurationPath(): Promise<string> {
    return Promise.resolve("Browser Memory");
  }

}
