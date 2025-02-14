import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';

describe('Email related', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  it('should handle a single mail address', () => {
    const original = 'MyEmail@secret.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('MyEmail@secret.com');

    // the following is because a consecutive rule applies
    expect(masked).not.toContain('max.mustermann@example.com');

    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a single mail address with context before', () => {
    const original = 'ALPHA info@example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('info@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a single mail address with context after', () => {
    const original = 'info@example.com BETA';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('info@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a single mail address with context around', () => {
    const original = 'ALPHA info@example.com BETA';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('info@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple email addresses', () => {
    const original = 'Contact us at info@example.com or support@example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('info@example.com');
    expect(masked).not.toContain('support@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  // Additional test cases
  it('should handle email addresses with subdomains', () => {
    const original = 'user@mail.subdomain.example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('user@mail.subdomain.example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle email addresses with special characters', () => {
    const original = 'user+alias@example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('user+alias@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle email addresses with numeric characters', () => {
    const original = 'user123@example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('user123@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle email addresses with mixed case', () => {
    const original = 'User@Example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('User@Example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle email addresses with dots in the local part', () => {
    const original = 'first.last@example.com';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('first.last@example.com');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle email addresses with multiple domains', () => {
    const original = 'user@sub.example.co.uk';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('user@sub.example.co.uk');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });
});
