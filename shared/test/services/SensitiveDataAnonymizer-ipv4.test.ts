import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';

describe('IPV4 related', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  // ip v4

  it('should handle ip alone', () => {
    const original = '192.178.152.10';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle ip in context', () => {
    const original = 'alpha 192.178.152.10 beta';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple ips in context', () => {
    const original = 'alpha 192.178.152.10 beta 192.178.152.1 gamma';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    expect(masked).toContain('beta');
    expect(masked).not.toContain('192.178.152.1');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle ip at the start of the string', () => {
    const original = '192.178.152.10 is the IP address';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle ip at the end of the string', () => {
    const original = 'The IP address is 192.178.152.10';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple ips alone', () => {
    const original = '192.178.152.10 192.178.152.1';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    expect(masked).not.toContain('192.178.152.1');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle no ip in the string', () => {
    const original = 'This string has no IP address';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe(original);
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle invalid ip format', () => {
    const original = 'This is not an IP: 999.999.999.999';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe(original);
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle ip with leading and trailing spaces', () => {
    const original = '  192.178.152.10  ';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original.trim());
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle ip with special characters', () => {
    const original = 'IP: 192.178.152.10!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('192.178.152.10');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });
});
