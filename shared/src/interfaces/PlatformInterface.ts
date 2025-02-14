export enum PlatformType {
  WEB = "WEB",
  ELECTRON = "ELECTRON",
  PLUGIN = "PLUGIN",
}

export interface PlatformInterface {
  // return one of three enums WEB, ELECTRON, PLUGIN
  getPlatform(): PlatformType;
  copyToClipboard(text: string): void;
}
