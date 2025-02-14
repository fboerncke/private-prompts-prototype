import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';

describe('CC related', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  // credit card numbers

  it('should handle credit card numbers alone', () => {
    const original = '4111 1111 1111 1111';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle credit card numbers in context', () => {
    const original = 'alpha 4111 1111 1111 1111 beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple credit card numbers in context', () => {
    const original = 'alpha 4111 1111 1111 1111 beta 5105 1051 0510 5100 gamma';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('5105 1051 0510 5100');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  // additional test cases

  it('should handle credit card numbers with different formats', () => {
    const original = '4111-1111-1111-1111';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111-1111-1111-1111');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle credit card numbers with spaces and dashes', () => {
    const original = '4111 1111-1111 1111';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111-1111 1111');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle credit card numbers with text around', () => {
    const original = 'My credit card number is 4111 1111 1111 1111, please keep it safe.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    expect(masked).toContain('My credit card number is');
    expect(masked).toContain('please keep it safe.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple credit card numbers with different formats', () => {
    const original = '4111 1111 1111 1111 and 5105-1051-0510-5100';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    expect(masked).not.toContain('5105-1051-0510-5100');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle credit card numbers with special characters', () => {
    const original = '4111 1111 1111 1111!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    expect(masked).toContain('!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle credit card numbers with leading and trailing spaces', () => {
    const original = '  4111 1111 1111 1111  ';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('4111 1111 1111 1111');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

});
