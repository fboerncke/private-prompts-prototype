/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param string - The string to escape.
 * @returns The escaped string.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Checks if the input string is a valid regular expression pattern.
 *
 * @param {string} pattern The input string to be checked.
 * @returns {boolean} `true` if the input string is a valid regular expression pattern, `false` otherwise.
 */
export function isRegexPattern(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a given string contains only text characters (i.e., Unicode letters).
 *
 * @param input The input string to check.
 * @returns `true` if the input string contains only text characters, `false` otherwise.
 */
export function isTextOnly(input: string): boolean {
  // Regular expression to match any Unicode letter character
  const textOnlyRegex = /^[\p{L}]+$/u;
  return textOnlyRegex.test(input);
}

/**
 * Compare with generateRuntimeUniqueId()
 * @returns 
 */
export function generateUniqueId(): number {
  // Return a unique ID based on the current time and a random number
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}
