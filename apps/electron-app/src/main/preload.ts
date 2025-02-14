// src/main/preload.ts

import { contextBridge, ipcRenderer } from "electron";

console.log("Setting up electronAPI in preload script");

// Expose a limited API to the renderer process using contextBridge for security
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   *  Send message to main process using ipcRenderer
   * @param message
   * @returns 
   */
  sendMessage: (message: string) => ipcRenderer.send("message", message),

  /**
   *  Copy text to clipboard
   * @param text 
   * @returns 
   */
  copyToClipboard: (text: string) => ipcRenderer.invoke("clipboard-write", text),


  /**
   *  Load JSON data from persistend storage to application session
   * @returns 
   */
  loadAppConfigurationFromBucket: async (bucketName: string) => {
    try {
      const json = await ipcRenderer.invoke("electron-store-get", bucketName);
      return json || {};
    } catch (error) {
      console.error("Error loading data:", error);
      return {};
    }
  },

  /**
   *  Save JSON data from the application session to persistend storage
   * @param data 
   */
  saveAppConfigurationToBucket: async (data: unknown, bucketName: string) => {
    try {
      await ipcRenderer.invoke("electron-store-set", bucketName, data);
      // console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  },

  /**
   *  Get the path to the application configuration file
   * @returns 
   */
  async getAppConfigurationPath(): Promise<string> {
    try {
      const configPath = await ipcRenderer.invoke('get-config-path') as string;
      return configPath;
    } catch (error) {
      console.error("Error retrieving config path:", error);
      return "";
    }
  },

  // After the existing methods in electronAPI, add this line:
  onNavigate: (callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.on("navigate", callback)
});

console.log("Preload script has finished execution");
