// src/services/AIService.ts

import OpenAI from "openai"; // Import OpenAI SDK
import { PersistenceService } from '../services/PersistenceService';

/**
 * OpenAIService handles interactions with the OpenAI API,
 * including API key management and sending prompts.
 */
class OpenAIService {
  private openAIClient: OpenAI | null = null; // Holds the OpenAI client instance

  /**
   * Retrieves the OpenAI API key from persistent storage.
   * @returns {Promise<string | undefined>} The API key or undefined if not found.
   */
  private async fetchAPIKey(): Promise<string | undefined> {
    const persistenceService = new PersistenceService();

    return await persistenceService.loadOpenAIKey();
  }

  /**
   * Initializes the OpenAI client if not already initialized.
   * Note: `dangerouslyAllowBrowser` is set to true; review security implications if used outside a controlled environment.
   *
   * @returns {Promise<OpenAI>} The initialized OpenAI client.
   * @throws {Error} If the API key is unavailable.
   */
  private async initializeClient(): Promise<OpenAI> {
    if (!this.openAIClient) {
      const apiKey = await this.fetchAPIKey();
      if (!apiKey) {
        throw new Error("OpenAI API key is not available.");
      }
      this.openAIClient = new OpenAI({
        apiKey,

        // The application is not intended to run on a web server
        // but in electron context as a standalone application.
        // Hence security implications are minimal. However, 
        // this setting should be reviewed in a production environment.
        dangerouslyAllowBrowser: true,
      });
    }
    return this.openAIClient;
  }

  /**
   * Determines if an OpenAI API key is available.
   * @returns {Promise<boolean>} True if the API key exists, else false.
   */
  public async isAPIKeyAvailable(): Promise<boolean> {
    const apiKey = await this.fetchAPIKey();
    return Boolean(apiKey);
  }

  /**
   * Sends a user prompt to the OpenAI API and retrieves the response.
   * @param {string} userPrompt - The prompt to send to the AI.
   * @returns {Promise<string>} The AI's response.
   * @throws {Error} If fetching the response fails (handled by handleError).
   */
  public async getAIResponse(userPrompt: string): Promise<string> {
    const client = await this.initializeClient();

    try {
      const apiResponse = await client.chat.completions.create({
        model: "gpt-4", // Specify the model
        messages: [{ role: "user", content: userPrompt }], // The prompt message
      });

      // Return the response text or a default message
      return (
        apiResponse.choices[0]?.message?.content || "No response from API."
      );
    } catch (error) {
      this.handleError(error); // Centralized error handling
    }
  }

  /**
   * Handles errors by logging and rethrowing standardized error messages.
   * @param {unknown} error - The error to handle.
   * @throws {Error} Throws a new standardized error.
   */
  private handleError(error: unknown): never {
    if (error instanceof Error) {
      console.error("Error fetching response:", error.message);
      throw new Error("Failed to fetch response from OpenAI.");
    } else {
      console.error("An unknown error occurred");
      throw new Error("Unknown error occurred.");
    }
  }
}

// Instantiate the OpenAIService
const openAIService = new OpenAIService();

/**
 * Determines if an OpenAI API key is available.
 * @returns {Promise<boolean>} True if the API key exists, else false.
 */
export const isAPIKeyAvailable =
  openAIService.isAPIKeyAvailable.bind(openAIService);

/**
 * Sends a user prompt to the AI and retrieves the response.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<string>} The AI's response.
 */
export const getAIResponse = openAIService.getAIResponse.bind(openAIService);
