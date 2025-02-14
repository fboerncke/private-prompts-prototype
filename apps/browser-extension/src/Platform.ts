// src/Platform.ts

import { PlatformInterface } from "@private-prompts/shared/interfaces/PlatformInterface";
import { PlatformType } from "@private-prompts/shared/interfaces/PlatformInterface";

/**
 * Platform specific implementations for Browser Plugin
 */
export class Platform implements PlatformInterface {
  getPlatform(): PlatformType {
    return PlatformType.PLUGIN;
  }
  copyToClipboard(text: string): void {
    try {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard (Browser Plugin)");
        })
        .catch((err) => {
          console.error("Error copying text in browser plugin: ", err);
          this.fallbackCopyToClipboard(text);
        });
    } catch {
      this.fallbackCopyToClipboard(text);
    }
  }

  // Fallback for web browsers without Clipboard API
  private fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Fallback: Text copied to clipboard");
    } catch (err) {
      console.error("Fallback: Unable to copy text", err);
    }
    document.body.removeChild(textArea);
  };
}
