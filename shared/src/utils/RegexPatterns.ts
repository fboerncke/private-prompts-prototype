// RegexPatterns.ts

// Regular expression to match email addresses
export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// Regular expression to match URLs
export const URL_REGEX = /https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/;

// Regular expression to match IBANS: DE89370400440532013000
export const IBAN_REGEX = /\b[a-zA-Z]{2}[0-9]{2}(?:[ ]?[a-zA-Z0-9]{4}){4}(?:[ ]?[0-9]{1,3})?\b/

// Regular expression to match IPv4 addresses
export const IPV4_REGEX = /\b((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b/

// Regular expression to match credit card numbers
export const CREDIT_CARD_NUMBER_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b/
