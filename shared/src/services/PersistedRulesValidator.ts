// src/services/PersistedRulesValidator.ts

/**
 * Represents a persisted rule for pseudonymization sensitive data.
 * 
 * - These rules are **persisted** and do not contain temporary or dynamically generated values.
 * - When later loaded into the system, they will receive a **generated ID**.
 * - The order of rules is **important** for processing.
 */
export interface PersistedRule {
    // Persisted rules do not have an ID until they are loaded later
    userDefinedSensitiveDataPattern: string; // Pattern for identifying sensitive data (regex, fixed string, or intelligent matcher)
    userDefinedTemporaryPlaceholder: string; // Placeholder for pseudonymization placeholders (fixed value, smart replacement)
}

/**
 * Represents a set of persisted pseudonymization rules.
 * 
 * - This container holds **only persisted rules** (not dynamically generated ones).
 * - Rules from this set will be later loaded and assigned a **generated ID**.
 */
export type PersistedRuleSet = PersistedRule[];

/**
 * Validates the format of a JSON file containing persisted pseudonymization rules.
 * 
 * Example JSON format:
 * ```json
 * [
 *     {
 *         "userDefinedSensitiveDataPattern": "Hulk Hogan",
 *         "userDefinedTemporaryPlaceholder": "Max Mustermann"
 *     },
 *     {
 *         "userDefinedSensitiveDataPattern": "0511/3333333",
 *         "userDefinedTemporaryPlaceholder": "0851/4711"
 *     },
 *     {
 *         "userDefinedSensitiveDataPattern": "hulk.hogan@gmail.com",
 *         "userDefinedTemporaryPlaceholder": "max.mustermann@example.com"
 *     }
 * ]
 * ```
 *
 * This function ensures that the input is a properly formatted JSON string 
 * and that it follows the structure of a `PersistedRuleSet`. It performs
 * the following checks:
 * 
 * 1. **Input Type Validation**: Ensures the input is a string.
 * 2. **JSON Parsing**: Attempts to parse the string and throws an error if parsing fails.
 * 3. **Root Object Structure**: The root must be an array of rules, not an object with a `"rules"` key.
 * 4. **Rules Array Validation**: Ensures array is valid  (not null, not an object, etc.).
 * 5. **Ensure at least one rule exists**: The array must not be empty.
 * 6. **Maximum Rule Limit Check**: Restricts rules to 1000 to prevent excessive memory usage 
 *      and processing overhead when applying pseudonymization.
 * 7. **Validation of each rule in the array**:
 *    - **Object Check**: Each rule must be an object (not null or an array).
 *    - **Unexpected Fields Check**: Ensures no unexpected fields exist (throws an error if found).
 *    - **Required Fields Validation**: 
 *       - `userDefinedSensitiveDataPattern` must be a non-empty string.
 *       - `userDefinedTemporaryPlaceholder` must be a non-empty string.
 * 
 * If any validation step fails, an appropriate error message is thrown.
 * 
 * @param persistedRulesFile - The JSON file content as a string
 * @returns The parsed `PersistedRuleSet` object if valid
 * @throws Error if the file format is incorrect
 */
export function validatePersistedRulesFileFormat(persistedRulesFile: string): PersistedRuleSet {
    if (typeof persistedRulesFile !== "string") {
        throw new Error("Invalid input: Expected a JSON string but received a non-text file.");
    }

    let rawData: unknown;
    try {
        rawData = JSON.parse(persistedRulesFile);
    } catch (error) {
        throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    if (!Array.isArray(rawData)) {
        throw new Error("Invalid JSON structure: Expected an array of rules.");
    }

    if (rawData.length === 0) {
        throw new Error("Invalid JSON structure: 'rules' array must contain at least one rule.");
    }

    const MAX_RULES = 1000;
    if (rawData.length > MAX_RULES) {
        throw new Error(`Too many rules: The limit is ${MAX_RULES} rules.`);
    }

    const allowedFields = new Set(["userDefinedSensitiveDataPattern", "userDefinedTemporaryPlaceholder"]);

    for (const [index, rule] of rawData.entries()) {
        if (typeof rule !== "object" || rule === null) {
            throw new Error(`Invalid rule at index ${index}: Each rule must be an object.`);
        }

        if (!Object.keys(rule).every(key => allowedFields.has(key))) {
            throw new Error(`Invalid rule at index ${index}: Unexpected fields detected.`);
        }

        if (typeof rule.userDefinedSensitiveDataPattern !== "string" || rule.userDefinedSensitiveDataPattern.trim() === "") {
            throw new Error(`Invalid rule at index ${index}: "userDefinedSensitiveDataPattern" must be a non-empty string.`);
        }

        if (typeof rule.userDefinedTemporaryPlaceholder !== "string" || rule.userDefinedTemporaryPlaceholder.trim() === "") {
            throw new Error(`Invalid rule at index ${index}: "userDefinedTemporaryPlaceholder" must be a non-empty string.`);
        }
    }

    return rawData as PersistedRuleSet;
}

