// src/interfaces/PersistenceInterface.ts

import { AppConfiguration } from "./AppConfigurationInterface";

export interface PersistenceInterface {

  /**
   * Loads all state from the database and returns it as a JSON object.
   * The type of the returned data is determined by the type parameter T.
   */
  loadAppConfiguration<_T>(): Promise<AppConfiguration>;

  /**
   * Saves all state from the session to the database as a JSON object.
   * The data to be saved is passed as an argument of type T.
   */
  saveAppConfiguration<_T>(data: AppConfiguration): Promise<void>;

  /**
   * Returns the path to the configuration file.
   */
  getAppConfigurationPath(): Promise<string>;

}
