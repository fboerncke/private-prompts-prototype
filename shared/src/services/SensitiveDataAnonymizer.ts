// src/services/SensitiveDataAnonymizer.ts

import type { ReplacementLogEntry } from "../interfaces/ReplacementLogEntryInterface";
import type { Rule } from "../interfaces/RuleInterface";
import { TemporaryPlaceholderProcessor } from "./TemporaryPlaceholderProcessor";
import { SensitiveDataPatternProcessor } from "./SensitiveDataPatternProcessor";
import { generateHexHash, generateReadableHash } from "../utils/HashUtils";
import {
  escapeRegExp,
  isTextOnly,
} from "../utils/GenericHelpers";

/**
 * SensitiveDataAnonymizer
 *
 * Handles detection, replacement, logging, and reversal of sensitive data in text based on defined rules.
 * It ensures deterministic and reversible replacements, generating unique fake values to avoid conflicts.
 *
 * ### Key Features:
 * - **Detection:** Identifies sensitive data using patterns or smart matchers (e.g., `{email}`, `{iban}`).
 * - **Replacement:** Substitutes sensitive data with valid, fake information consistently.
 * - **Logging:** Keeps an in-memory log of replacements for accurate reversal.
 * - **Reversibility:** Can revert masked text back to its original form using the logged data.
 * - **Uniqueness:** Guarantees unique fake values, regenerating if conflicts arise.
 * - **Extendability:** Easily supports new sensitive data types via additional rules.
 *
 * ### Example:
 * ```typescript
 * const rules: Rule[] = [
 *   { sensitiveDataPattern: '{email}', temporaryPlaceholder: '{{randomEmail}}' },
 *   { sensitiveDataPattern: '{year}', temporaryPlaceholder: '{{randomYear}}' }
 * ];
 * const anonymizer = new SensitiveDataAnonymizer(rules);
 * const originalText = "Contact me at john.doe@example.com in 2023.";
 * const maskedText = anonymizer.maskSensitiveData(originalText);
 * console.log(maskedText);
 * // Might output: "Contact me at fake.email@example.com in 19XX."
 *
 * const revertedText = anonymizer.unmaskSensitiveData(maskedText);
 * console.log(revertedText);
 * // Outputs: "Contact me at john.doe@example.com in 2023."
 * ```
 */
export class SensitiveDataAnonymizer {
  // In-memory log of replacements
  private replacementRules: Rule[] = [];

  private replacementLog: ReplacementLogEntry[] = [];
  private usedFakeValues: Set<string>;
  private replacementMap: Map<string, string>;

  // Constructor takes replacement rules as an argument or default rule set as fallback
  constructor(replacementRules: Rule[]) {
    this.replacementRules = replacementRules;
    this.replacementMap = new Map<string, string>();
    this.usedFakeValues = new Set<string>();
    this.replacementLog = [];
  }


  /**
   * Masks sensitive data in the given text based on the defined rules.
   * Processes each rule sequentially, updating internal logs and mapping, so that repeated calls continue adding to the log.
   *
   * @param originalText - The original text containing sensitive data.
   * @returns The text with sensitive data masked.
   */
  maskSensitiveData(originalText: string): string {
    // Iterate over the rules and update maskedContent step by step
    // apply all replacement rules
    let maskedContent: string = originalText.trim();
    this.replacementRules.forEach((replacementRule) => {
      const {
        userDefinedSensitiveDataPattern,
        userDefinedTemporaryPlaceholder: userDefinedTemporaryPlaceholderExpression,
      } = replacementRule;

      const {
        wrappedSensitiveDataCandidateMatcher,
        sensitiveDataValidator,
        sensitiveDataFaker,
      } = SensitiveDataPatternProcessor.buildDataMaskingTools(
        userDefinedSensitiveDataPattern,
        userDefinedTemporaryPlaceholderExpression,
      );

      // Replace occurrences of the rule pattern in the input string with temporary placeholder
      maskedContent = this.processSensitiveData(
        maskedContent,
        wrappedSensitiveDataCandidateMatcher,
        sensitiveDataValidator,
        sensitiveDataFaker,
      );
    });
    return maskedContent;
  }

  /**
   * Generates a unique placeholder for sensitive data.
   *
   * This method ensures that the generated placeholder is unique and does not conflict with any existing fake values or the original text.
   * If a collision is detected, it appends a hash of the original string to the placeholder to make it unique.
   *
   * @param original - The original sensitive data string.
   * @param modifiedText - The text with masked sensitive data.
   * @param faker - Function to generate a base placeholder.
   * @returns A unique placeholder string.
   */
  private generateUniquePlaceholder(
    original: string,
    modifiedText: string,
    faker: () => string,
  ): string {


    let placeholder = TemporaryPlaceholderProcessor.getTemporaryReplacementString(faker());
    let attempts = 0;
    const maxAttempts = 10;

    while (
      this.usedFakeValues.has(placeholder) ||
      modifiedText.includes(placeholder)
    ) {
      placeholder = TemporaryPlaceholderProcessor.getTemporaryReplacementString(faker());
      attempts++;
      if (attempts >= maxAttempts) {
        if (isTextOnly(placeholder)) {
          placeholder = `${placeholder}${generateReadableHash(original).substring(0, 8)}`;
        } else {
          placeholder = `${placeholder}_${generateHexHash(original).substring(0, 8)}`;
        }
        break;
      }
    }

    this.usedFakeValues.add(placeholder);
    return placeholder;
  }

  /**
   * Processes sensitive data in the text using the provided matcher, validator, and faker.
   *
   * This method:
   * 1. Matches potential sensitive data using the provided regex.
   * 2. Validates each match to confirm it's sensitive data.
   * 3. Generates a unique hash for each piece of sensitive data.
   * 4. Either retrieves an existing fake value (for deterministic replacement) or generates a new one.
   * 5. Ensures uniqueness of fake values.
   * 6. Logs the replacement for later reversal.
   * 7. Replaces the sensitive data with the fake value.
   *
   * @param text - The text to process.
   * @param sensitiveDataCandidateMatcher - RegExp to match potential sensitive data.
   * @param sensitiveDataValidator - Function to validate if a match is truly sensitive data.
   * @param sensitiveDataFaker - Function to generate fake data for replacement.
   * @returns The text with sensitive data replaced by fake values.
   */
  private processSensitiveData(
    text: string,
    sensitiveDataCandidateMatcher: RegExp,
    sensitiveDataValidator: (input: string) => boolean,
    sensitiveDataFaker: () => string,
  ): string {
    let modifiedText = text;

    modifiedText = modifiedText.replace(
      sensitiveDataCandidateMatcher,
      (match) => {
        if (sensitiveDataValidator(match)) {
          // Generate a hash for the matched sensitive data
          const caseAwareHashForLookup = generateHexHash(match);

          if (this.replacementMap.has(caseAwareHashForLookup)) {
            // If the match has already been processed, use the existing fake value
            return this.replacementMap.get(caseAwareHashForLookup) as string;
          } else {
            // Otherwise generate a new fake value if it doesn't exist in the map
            const fakeValue = this.generateUniquePlaceholder(
              match,
              modifiedText,
              sensitiveDataFaker,
            );

            // Store the new fake value in the replacement map
            this.replacementMap.set(caseAwareHashForLookup, fakeValue);

            // Log the original version of the match
            this.replacementLog.push({
              original: match, // store the original match, including its case
              fake: fakeValue,
              type: "sensitive data",
            });

            // Return the fake value for replacement
            return fakeValue;
          }
        } else {
          console.debug(`Match ${match} not rated sensitive`);
          return match; // If no validation, return the match unchanged
        }
      },
    );

    return modifiedText;
  }

  /**
   * Unmasks data by reversing the replacements recorded during masking.
   * Relies on the instance's replacement log; modifications to the text outside of this log may not be correctly unmapped.
   *
   * @param maskedText - The text with masked sensitive data.
   * @returns The original text with sensitive data restored.
   */
  unmaskSensitiveData(maskedText: string): string {
    let originalText = maskedText;

    // Reverse through the replacement log to ensure proper unmasking
    for (let i = this.replacementLog.length - 1; i >= 0; i--) {
      const { original, fake } = this.replacementLog[i];
      // Replace the fake value back with the original, restoring the correct case
      originalText = originalText.replace(
        new RegExp(escapeRegExp(fake), "g"),
        original,
      );
    }
    return originalText;
  }

  /**
   * Marks sensitive data in the given text by wrapping it with <sensitive> tags.
   * It collects and processes matches for all rules to avoid overlapping annotations.
   *
   * @param unmaskedText - The original text containing sensitive data.
   * @returns The text with sensitive data marked.
   */
  markSensitiveData(unmaskedText: string): string {
    let markedContent: string = unmaskedText.trim();

    // Collect all matches from all rules
    type Match = { start: number; end: number; text: string };
    const matches: Match[] = [];

    this.replacementRules.forEach((replacementRule) => {
      const {
        userDefinedSensitiveDataPattern,
        userDefinedTemporaryPlaceholder,
      } = replacementRule;

      const temporaryReplacementString =
        TemporaryPlaceholderProcessor.getTemporaryReplacementString(
          userDefinedTemporaryPlaceholder.trim(),
        );

      const { wrappedSensitiveDataCandidateMatcher, sensitiveDataValidator } =
        SensitiveDataPatternProcessor.buildDataMaskingTools(
          userDefinedSensitiveDataPattern,
          temporaryReplacementString,
        );

      let match: RegExpExecArray | null;
      const regex = new RegExp(
        wrappedSensitiveDataCandidateMatcher.source,
        "g",
      );
      while ((match = regex.exec(markedContent)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;
        const text = match[0];

        if (sensitiveDataValidator(text)) {
          matches.push({ start, end, text });
        }
      }
    });

    // Remove overlapping matches
    matches.sort((a, b) => a.start - b.start);
    const nonOverlappingMatches: Match[] = [];
    let lastEnd = -1;
    for (const match of matches) {
      if (match.start >= lastEnd) {
        nonOverlappingMatches.push(match);
        lastEnd = match.end;
      }
    }

    // Apply the <sensitive> tags in reverse order to not mess up indices
    for (let i = nonOverlappingMatches.length - 1; i >= 0; i--) {
      const match = nonOverlappingMatches[i];
      markedContent =
        markedContent.slice(0, match.start) +
        `<sensitive>${match.text}</sensitive>` +
        markedContent.slice(match.end);
    }

    return markedContent;
  }
}