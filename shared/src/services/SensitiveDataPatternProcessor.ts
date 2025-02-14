// src/services/SensitiveDataPatternProcessor.ts

import * as validator from "validator";
import { EMAIL_REGEX, CREDIT_CARD_NUMBER_REGEX, IBAN_REGEX, IPV4_REGEX } from "../utils/RegexPatterns";

import {
    escapeRegExp,
    isRegexPattern,
} from "../utils/GenericHelpers";

/**
 * SensitiveDataPatternProcessor
 *
 * A utility class for creating tools to detect and replace sensitive data in strings.
 * It supports static patterns (literal or regex) and smart matchers (e.g., `{email}`, `{iban}`).
 */
export class SensitiveDataPatternProcessor {
    /**
     * Builds data processing tools based on the provided sensitive data pattern.
     *
     * This method analyzes the given pattern and returns:
     * - A RegExp (`wrappedSensitiveDataCandidateMatcher`) configured with word boundaries to match sensitive data.
     * - A validator function to confirm matches are valid sensitive data.
     * - A faker function to generate fake replacements.
     *
     * If the pattern is a smart matcher (e.g., `{email}`), it uses predefined rules.
     * If the pattern is a valid regex, it uses it directly.
     * Otherwise, it treats the pattern as a literal string.
     *
     * @param sensitiveDataPattern - Pattern to match sensitive data (smart matcher, regex, or literal).
     * @param userDefinedPlaceholderExpression - Placeholder to use for masking sensitive data, may be a smart expression
     * @returns An object containing the regex matcher, validator, and faker function.
     *
     * @throws {Error} If an unknown smart matcher type is provided.
     */
    static buildDataMaskingTools(
        sensitiveDataPattern: string,
        userDefinedPlaceholderExpression: string,
    ): {
        wrappedSensitiveDataCandidateMatcher: RegExp;
        sensitiveDataValidator: (input: string) => boolean;
        sensitiveDataFaker: () => string;
    } {
        let sensitiveDataCandidateMatcher: string = "";
        let dataValidator: (input: string) => boolean = () => {
            return true;
        };
        let dataFaker: () => string = () => {
            return "";
        };

        if (
            sensitiveDataPattern.startsWith("{") &&
            sensitiveDataPattern.endsWith("}")
        ) {
            // Handle smart matcher in searchPattern (e.g., {iban})
            const matcher: string = sensitiveDataPattern.slice(1, -1);
            // Extract "iban" or "email"
            const result = SensitiveDataPatternProcessor.smartMatcher(matcher);
            sensitiveDataCandidateMatcher = result.sensitiveDataCandidateMatcher;
            dataValidator = result.dataValidator;
            dataFaker = () => userDefinedPlaceholderExpression;
        } else if (isRegexPattern(sensitiveDataPattern)) {
            sensitiveDataCandidateMatcher = sensitiveDataPattern;
            dataValidator = () => true;
            dataFaker = () => userDefinedPlaceholderExpression;
        } else {
            sensitiveDataCandidateMatcher = escapeRegExp(sensitiveDataPattern);
            dataValidator = () => true;
            dataFaker = () => userDefinedPlaceholderExpression;
        }
        return {
            // (?<!\\w) is a negative lookbehind, ensuring the match is not preceded by a word character.
            // (?!\\w) is a negative lookahead, ensuring the match is not followed by a word character.
            wrappedSensitiveDataCandidateMatcher: new RegExp(
                `(?<!\\w)(?:${sensitiveDataCandidateMatcher})(?!\\w)`,
                "g",
            ),
            sensitiveDataValidator: dataValidator,
            sensitiveDataFaker: dataFaker,
        };
    }

    /**
     * Handles smart matchers in the search pattern (e.g., `{iban}`).
     *
     * Uses a predefined set of matchers for common sensitive data types:
     * - email, iban, ipv4, creditcardnumber
     *
     * Each matcher provides:
     * - A regex pattern to detect sensitive data.
     * - A validator function to verify matches.
     * - A faker function to generate fake data.
     *
     * @param matcherType - The type of smart matcher (e.g., 'email', 'iban', 'ipv4').
     * @returns An object containing the regex pattern, validator, and faker for the specified type.
     *
     * @throws {Error} If an unknown matcher type is provided.
     *
     * @example
     * const matcher = SensitiveDataPatternProcessor.smartMatcher('email');
     * console.log(matcher.sensitiveDataCandidateMatcher); // Outputs the email regex pattern
     */
    private static smartMatcher(matcherType: string): {
        sensitiveDataCandidateMatcher: string;
        dataValidator: (input: string) => boolean;
    } {
        const matchers: Record<
            string,
            {
                sensitiveDataCandidateMatcher: string;
                dataValidator: (input: string) => boolean;
            }
        > = {
            email: {
                sensitiveDataCandidateMatcher: EMAIL_REGEX.source,
                dataValidator: validator.default.isEmail,
            },
            iban: {
                sensitiveDataCandidateMatcher: IBAN_REGEX.source,
                dataValidator: () => { return true; },
            },
            ipv4: {
                sensitiveDataCandidateMatcher: IPV4_REGEX.source,
                dataValidator: () => { return true; },
            },
            creditcardnumber: {
                sensitiveDataCandidateMatcher: CREDIT_CARD_NUMBER_REGEX.source,
                dataValidator: () => { return true; },
            },
        };

        const matcher = matchers[matcherType];
        if (!matcher) {
            throw new Error(`Unknown smart matcher: ${matcherType}`);
        }
        return matcher;
    }
}
