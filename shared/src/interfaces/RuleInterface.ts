/**
 * Rule for sensitive data anonymization.
 *
 * Remember: Order of rules is relevant for the processing order
 *
 * @property {string} sensitiveDataPattern - The pattern to match sensitive data. Can be a smart matcher (e.g., {email}), a regex pattern, or a string literal.
 * @property {string} temporaryPlaceholder - The placeholder to use for replacement. Can be a constant, regex with group reference, or smart expression.
 */
export interface Rule {
  id?: number; // id is optional and will not be persisted
  userDefinedSensitiveDataPattern: string; // Can be a regex, a string, or a smart matcher
  userDefinedTemporaryPlaceholder: string; // Can be a constant, regex with group reference, or smart expression
}
