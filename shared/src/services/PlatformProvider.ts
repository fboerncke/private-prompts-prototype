// shared/src/services/PlatformProvider.ts

import { PlatformInterface } from '../interfaces/PlatformInterface';

/**
 * Holds the global instance of a PlatformInterface.
 * Acts as a simple singleton provider for platform-specific implementations.
 */
let platformInstance: PlatformInterface | null = null;

/**
 * Sets the global platform instance.
 * This should be called during application initialization with a proper PlatformInterface implementation.
 *
 * @param platform - An instance implementing PlatformInterface.
 */
export function setPlatform(platform: PlatformInterface) {
  platformInstance = platform;
}

/**
 * Retrieves the global platform instance.
 *
 * @returns The currently set PlatformInterface instance.
 * @throws {Error} If the platform instance has not been set prior to calling this method.
 */
export function getPlatform(): PlatformInterface {
  if (!platformInstance) {
    throw new Error('Platform instance has not been set.');
  }
  return platformInstance;
}
