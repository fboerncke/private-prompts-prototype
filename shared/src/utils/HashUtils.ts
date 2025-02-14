// src/utils/HashUtils.ts

import type { Prompt } from "../interfaces/PromptInterface";

/**
 * Utility functions for generating various types of hashes,
 * including hexadecimal, numeric, and readable hashes,
 * as well as specific hash codes for prompts based on their content.
 */


/**
 * Generates a hexadecimal hash for the input string using bitwise operations.
 *
 * @param input - The input string to hash.
 * @returns The hexadecimal representation of the hash.
 */
export const generateHexHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Generates a readable hash string from the input by alternating vowels and consonants.
 * The first character is ensured to be a vowel.
 *
 * @param input - The input string to hash.
 * @param length - Desired length of the readable hash (default is 8).
 * @returns A readable hash string composed of vowels and consonants.
 */
export const generateReadableHash = (input: string, length = 8): string => {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";

  const hash = generateHexHash(input); // Get the hash string
  let readableHash = "";

  // Ensure the first character is a vowel
  const firstIndex = parseInt(hash[0], 16); // Use the first hex value for a vowel
  readableHash += vowels[firstIndex % vowels.length]; // First character: vowel

  // Alternate between consonants and vowels for the rest of the characters
  for (let i = 1; i < length; i++) {
    const index = parseInt(hash[i % hash.length], 16); // Use hex values
    if (i % 2 === 0) {
      readableHash += vowels[index % vowels.length]; // Even index: vowel
    } else {
      readableHash += consonants[index % consonants.length]; // Odd index: consonant
    }
  }

  return readableHash;
};

/**
 * Generates a numeric hash for the input string using bitwise operations.
 *
 * @param input - The input string to hash.
 * @returns A numeric string representing the absolute value of the hash.
 */
export const generateNumericHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert hash to absolute value and return it as a string of digits
  return Math.abs(hash).toString();
};

/**
 * Generates a hexadecimal hash code for the input string using the DJB2 algorithm.
 *
 * @param input - The input string to hash.
 * @returns The generated DJB2 hex hash code as a string.
 */
export const generateDJB2HexHash = (input: string): string => {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = hash * 33 + input.charCodeAt(i);
    // Ensure hash remains a 32-bit value
    hash = hash & hash;
  }
  // Convert to a positive value and then to hex
  return (hash >>> 0).toString(16);
};

/**
 * Generates a unique hash code for a prompt based on its content fields.
 * Combines various fields of the prompt, then applies the DJB2 algorithm.
 *
 * @param prompt - The prompt object without the `id` property.
 * @returns The generated hash code as a string.
 */
export const generatePromptHash = (prompt: Omit<Prompt, "id">): string => {
  const {
    description,
    prompt: promptText,
    comment,
    platforms,
    tags,
    isFavorite,
    createdAt,
    updatedAt,
  } = prompt;

  // Combine all relevant fields into a single string
  const hashInput = `${description}|${promptText}|${comment}|${platforms.sort().join(",")}|${tags.sort().join(",")}|${isFavorite}|${createdAt}|${updatedAt}`;
  return generateDJB2HexHash(hashInput);
};
