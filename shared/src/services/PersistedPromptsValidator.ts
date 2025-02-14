// src/services/PersistedPromptsValidator.ts

/**
 * Represents a persisted prompt for anonymizing sensitive data.
 * 
 * - These prompts are **persisted** and do not contain temporary or dynamically generated values.
 * - When later loaded into the system, they will receive a **generated ID**.
 */
export interface PersistedPrompt {
    // Persisted prompts do not have an ID until they are loaded later
    description: string;
    prompt: string;
    comment: string;
    platforms: string[];
    tags: string[];
    isFavorite: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

/**
 * Represents a set of persisted prompts.
 * 
 * - This container holds **only persisted prompts** (not dynamically generated ones).
 * - Prompts from this set will be later loaded and assigned a **generated ID**.
 */
export type PersistedPromptArray = PersistedPrompt[];

/**
 * Validates the format of a JSON file containing persisted prompts.
 * 
 * Example JSON format:
 * ```json
[
  {
    "isFavorite": false,
    "description": "Example sensitive prompt - Job application letter",
    "prompt": "Write a friendly job application letter.\nMy name: John Doe\nMy address: Bahnhofstraße 12\n30624 Hannover\nPhone: 0511/3333333\nMail: john.doe@gmail.com\nJob description: Manager Position in a fast food restaurant. ",
    "comment": "This prompt can be used to demonstrate the functionality of the application.",
    "platforms": [
      "ChatGPT",
      "Claude",
      "gdsfgdsgdsfg",
      "sdgfgdsfg"
    ],
    "tags": [
      "Demo case",
      "bbad",
      "bbb",
      "gfsdgdsfg"
    ],
    "createdAt": "2025-01-22T12:07:31.841Z",
    "updatedAt": "2025-01-30T11:42:40.292Z"
  },
  {
    "isFavorite": false,
    "description": "Joke generator",
    "prompt": "Tell me a funny joke.",
    "comment": "Let the AI generate a joke for you.",
    "platforms": [
      "Claude",
      "OpenAI"
    ],
    "tags": [
      "Fun"
    ],
    "createdAt": "2025-01-22T12:07:31.841Z",
    "updatedAt": "2025-01-22T12:07:31.841Z"
  }
]
   * ```
 *
 * This function ensures that the input is a properly formatted JSON string 
 * and that it follows the structure of a `PersistedPromptArray`. It performs
 * the following checks:
 * 
 * 1. **Input Type Validation**: Ensures the input is a string.
 * 2. **JSON Parsing**: Attempts to parse the string and throws an error if parsing fails.
 * 3. **Root Object Structure**: The root must be an array of prompts, not an object with a `"prompts"` key.
 * 4. **Prompts Array Validation**: Ensures array is valid  (not null, not an object, etc.).
 * 5. **Ensure at least one prompt exists**: The array must not be empty.
 * 6. **Maximum Prompt Limit Check**: Restricts prompt to 1000 to prevent excessive memory usage 
 *      and processing overhead when applying anonymization.
 * 7. **Validation of each prompt in the array**:
 *    - **Object Check**: Each prompt must be an object (not null or an array).
 *    - **Unexpected Fields Check**: Ensures no unexpected fields exist (throws an error if found).
 *    - **Required Fields Validation**: 
 *       - `description` must be a non-empty string.
 *       - `prompt` must be a non-empty string.
 *       - `comment` must be a string.
 *       - `platforms` must be an array of strings.
 *       - `tags` must be an array of strings.
 *       - `isFavorite` must be a boolean.
 *       - `createdAt` must be a valid ISO date string.
 *       - `updatedAt` must be a valid ISO date string.
 * 
 * If any validation step fails, an appropriate error message is thrown.
 * 
 * @param persistedPromptsFile - The JSON file content as a string
 * @returns The parsed `PersistedPromptArray` object if valid
 * @throws Error if the file format is incorrect
 */
export function validatePersistedPromptsFileFormat(persistedPromptsFile: string): PersistedPromptArray {
    if (typeof persistedPromptsFile !== "string") {
        throw new Error("Invalid input: Expected a JSON string but received a non-text file.");
    }

    let rawData: unknown;
    try {
        rawData = JSON.parse(persistedPromptsFile);
    } catch (error) {
        throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    if (!Array.isArray(rawData)) {
        throw new Error("Invalid JSON structure: Expected an array of prompts.");
    }

    if (rawData.length === 0) {
        throw new Error("Invalid JSON structure: 'prompts' array must contain at least one prompt.");
    }

    const MAX_PROMPTS = 1000;
    if (rawData.length > MAX_PROMPTS) {
        throw new Error(`Too many prompts: The limit is ${MAX_PROMPTS} prompts.`);
    }

    const allowedFields = new Set([
        "id", "description", "prompt", "comment", "platforms", "tags", "isFavorite", "createdAt", "updatedAt"
    ]);

    for (const [index, prompt] of rawData.entries()) {
        if (typeof prompt !== "object" || prompt === null) {
            throw new Error(`Invalid prompt at index ${index}: Each prompt must be an object.`);
        }

        if (!Object.keys(prompt).every(key => allowedFields.has(key))) {
            throw new Error(`Invalid prompt at index ${index}: Unexpected fields detected.`);
        }

        if (typeof prompt.description !== "string" || prompt.description.trim() === "") {
            throw new Error(`Invalid prompt at index ${index}: "description" must be a non-empty string.`);
        }

        if (typeof prompt.prompt !== "string" || prompt.prompt.trim() === "") {
            throw new Error(`Invalid prompt at index ${index}: "prompt" must be a non-empty string.`);
        }

        if (typeof prompt.comment !== "string") {
            throw new Error(`Invalid prompt at index ${index}: "comment" must be a string.`);
        }

        if (!Array.isArray(prompt.platforms) || !prompt.platforms.every((p: unknown) => typeof p === "string")) {
            throw new Error(`Invalid prompt at index ${index}: "platforms" must be an array of strings.`);
        }

        // no prompt platform tag may be an empty string
        if (prompt.platforms.some((p: string) => p.trim() === "")) {
            throw new Error(`Invalid prompt at index ${index}: "platforms" must not contain empty strings.`);
        }


        if (!Array.isArray(prompt.tags) || !prompt.tags.every((t: unknown) => typeof t === "string")) {
            throw new Error(`Invalid prompt at index ${index}: "tags" must be an array of strings.`);
        }

        // no prompt tag string may be an empty string
        if (prompt.tags.some((t: string) => t.trim() === "")) {
            throw new Error(`Invalid prompt at index ${index}: "tags" must not contain empty strings.`);
        }

        if (typeof prompt.isFavorite !== "boolean") {
            throw new Error(`Invalid prompt at index ${index}: "isFavorite" must be a boolean.`);
        }

        if (typeof prompt.createdAt !== "string" || isNaN(Date.parse(prompt.createdAt))) {
            throw new Error(`Invalid prompt at index ${index}: "createdAt" must be a valid ISO date string.`);
        }

        if (typeof prompt.updatedAt !== "string" || isNaN(Date.parse(prompt.updatedAt))) {
            throw new Error(`Invalid prompt at index ${index}: "updatedAt" must be a valid ISO date string.`);
        }
    }

    return rawData as PersistedPromptArray;
}

