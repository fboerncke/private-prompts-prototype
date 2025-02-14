// shared/src/services/PersistenceProvider.ts

import { PersistenceInterface } from '../interfaces/PersistenceInterface';

/**
 * Singleton holder for the application's Persistence instance.
 * Provides methods to set and retrieve the Persistence instance throughout the application.
 */
let persistenceInstance: PersistenceInterface | null = null;

/**
 * Sets the global Persistence instance.
 * Should be called once during application initialization.
 *
 * @param persistence - An instance implementing PersistenceInterface.
 */
export function setPersistence(persistence: PersistenceInterface) {
  persistenceInstance = persistence;
}

/**
 * Retrieves the global Persistence instance.
 *
 * @returns The currently set Persistence instance.
 * @throws Error if the Persistence instance has not been set.
 */
export function getPersistence(): PersistenceInterface {
  if (!persistenceInstance) {
    throw new Error('Persistence instance has not been set.');
  }
  return persistenceInstance;
}
