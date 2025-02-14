// src/renderer/Platform.ts

import { PlatformInterface } from "@private-prompts/shared/interfaces/PlatformInterface";
import { PlatformType } from "@private-prompts/shared/interfaces/PlatformInterface";

/**
 * Platform specific implementations for Electron
 */
export class Platform implements PlatformInterface {
  getPlatform(): PlatformType {
    return PlatformType.ELECTRON;
  }

  copyToClipboard(text: string): void {
    if (window.electronAPI) {
      window.electronAPI.copyToClipboard(text);
      console.log("Text copied to clipboard (Electron)");
    } else {
      console.error("Electron API is not available");
    }
  }
}
