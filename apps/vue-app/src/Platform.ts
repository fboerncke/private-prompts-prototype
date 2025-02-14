import type { PlatformInterface } from "@private-prompts/shared/interfaces/PlatformInterface";
import { PlatformType } from "@private-prompts/shared/interfaces/PlatformInterface";

/**
 * Platform specific implementations for Web version
 */
export class Platform implements PlatformInterface {
  getPlatform(): PlatformType {
    return PlatformType.WEB;
  }
  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard (Web)");
        })
        .catch((err) => {
          console.error("Error copying text in web: ", err);
          this.fallbackCopyToClipboard(text);
        });
    } else {
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
