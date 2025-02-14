import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';

describe('IBAN related', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  // iban

  it('should handle iban alone', () => {
    const original = 'DE89370400440532013000';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle iban in context', () => {
    const original = 'alpha DE89370400440532013000 beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple ibans in string', () => {
    const original = 'alpha DE89370400440532013000 beta DE89370400440532013001 gamma';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('DE89370400440532013000');
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).toContain('gamma');
    expect(masked).not.toContain('DE89370400440532013001');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle empty string', () => {
    const original = '';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original);
  });

  it('should handle string without iban', () => {
    const original = 'This is a test string without any IBAN.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe(original);
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original);
  });

  it('should handle string with special characters', () => {
    const original = 'alpha DE89370400440532013000!@#$%^&*() beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('!@#$%^&*()');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle string with multiple spaces', () => {
    const original = 'alpha    DE89370400440532013000    beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle string with newline characters', () => {
    const original = 'alpha\nDE89370400440532013000\nbeta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle string with tabs', () => {
    const original = 'alpha\tDE89370400440532013000\tbeta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('DE89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle string with mixed case IBAN', () => {
    const original = 'alpha De89370400440532013000 beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toContain('alpha');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('De89370400440532013000');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

});
