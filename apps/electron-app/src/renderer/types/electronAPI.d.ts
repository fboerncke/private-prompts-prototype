// src/types/electronAPI.d.ts
export { };  // Ensure this file is treated as a module

declare global {
    interface Window {
        electronAPI: {
            loadAppConfigurationFromBucket(bucketName: string): Promise<AppConfiguration>;
            saveAppConfigurationToBucket(data: AppConfiguration, bucketName: string): Promise<void>;
            getAppConfigurationPath(): Promise<string>;
            copyToClipboard(text: string): Promise<void>;
            onNavigate(callback: (...args: unknown[]) => void): void;
        }
    }
}