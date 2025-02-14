// src/renderer/Persistence.ts

import { AppConfiguration } from "@private-prompts/shared/interfaces/AppConfigurationInterface";
import type { PersistenceInterface } from "@private-prompts/shared/interfaces/PersistenceInterface"; // Import the PersistenceInterface type
import { Prompt } from "@private-prompts/shared/interfaces/PromptInterface";
import { PersistenceService } from "@private-prompts/shared/services/PersistenceService";
import { DEFAULT_JSON_CONFIGURATION, DEFAULT_BUCKET_NAME } from '@private-prompts/shared/constants/DefaultAppConfiguration';

export class Persistence implements PersistenceInterface {

  private configurationCache: AppConfiguration | null = null;

  /**
   * @returns Parsed JSON object or an empty object if no data is found.
   */
  async loadAppConfiguration(): Promise<AppConfiguration> {

    if (this.configurationCache) {
      console.log("loadAppConfiguration: from cache");
      return this.configurationCache;
    }
    console.log("loadAppConfiguration: from local storage");

    try {
      // Call the exposed method from the preload script to load JSON data from the database to the session
      const data = await window.electronAPI.loadAppConfigurationFromBucket(DEFAULT_BUCKET_NAME);
      // console.log("Data loaded:", data); // Log data after serialization
      if (data == null || data == undefined || Object.keys(data).length === 0) {
        console.info("Initialize with default data:");
        await this.saveAppConfiguration(DEFAULT_JSON_CONFIGURATION);
        return DEFAULT_JSON_CONFIGURATION;
      }

      const persistenceService = new PersistenceService();
      const parsedDataWithIds = persistenceService.createInternalIdsForJSON(data);

      if (parsedDataWithIds.prompts && Array.isArray(parsedDataWithIds.prompts)) {
        parsedDataWithIds.prompts = parsedDataWithIds.prompts.map(
          (prompt: Prompt) => ({
            ...prompt,
            createdAt: prompt.createdAt || new Date().toISOString(),
            updatedAt: prompt.updatedAt || new Date().toISOString(),
          }),
        );
      }
      this.configurationCache = parsedDataWithIds;
      return parsedDataWithIds;
    } catch (error) {
      console.info("Failed to load data:", error);
      await this.saveAppConfiguration(DEFAULT_JSON_CONFIGURATION);
      return DEFAULT_JSON_CONFIGURATION;
    }
  }

  async saveAppConfiguration(data: AppConfiguration): Promise<void> {
    try {
      // Call the exposed method from the preload script to save JSON data from the session to the database
      const dataToSave = { ...data };
      const persistenceService = new PersistenceService();
      const dataToSaveWithoutIds = persistenceService.removeInternalIdsFromJSON(dataToSave);

      // Serialize the data to plain JSON
      const plainData = JSON.parse(JSON.stringify(dataToSaveWithoutIds));
      //console.log("Data after serialization:", plainData); // Log data after serialization

      await window.electronAPI.saveAppConfigurationToBucket(plainData, DEFAULT_BUCKET_NAME); // Save the serialized data to the database
      this.configurationCache = data; // update cache
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }

  async getAppConfigurationPath(): Promise<string> {
    try {
      // Call the exposed method from the preload script to get the path to the configuration file
      return await window.electronAPI.getAppConfigurationPath();
    } catch (error) {
      // Log an error message if the operation fails
      console.error("Failed to retrieve configuration path:", error);
      return "Failed to retrieve configuration path";
    }
  }

}
