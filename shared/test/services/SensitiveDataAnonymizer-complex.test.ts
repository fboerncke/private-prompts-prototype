import { beforeEach, describe, expect, it } from '@jest/globals';
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";

describe('Various cases', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  it('should handle a very long string with multiple occurrences of sensitive data', () => {
    const original =
      'MyFirstName '.repeat(1000) + 'MyLastName '.repeat(100) + 'MyCountry '.repeat(10);
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe(
      'Max '.repeat(1000) + 'Mustermann '.repeat(100) + 'MyCountry '.repeat(9) + 'MyCountry'
    );
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask both "MyFirstName" and "MyLastName". Conflicts with replacement Max already in original text.', () => {
    const original = 'MyFirstName MyLastName is a friend of Max.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Maxucidepec Mustermann is a friend of Max.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask both "MyFirstName" and "MyLastName". Conflicts with replacement Max and Mustermann already in original text.', () => {
    const original = 'MyFirstName MyLastName is a friend of Max Mustermann.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Maxucidepec Mustermannopunilir is a friend of Max Mustermann.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with all types of sensitive data', () => {
    const original =
      'MyFirstName MyLastName born in 1990, email: MyEmail@secret.com, phone: MyMobilePhoneNumber';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('MyFirstName');
    expect(masked).not.toContain('MyLastName');
    expect(masked).toContain('1990');
    expect(masked).not.toContain('MyEmail@secret.com');
    expect(masked).toContain('MyMobilePhoneNumber');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with only sensitive data', () => {
    const original = 'MyFirstName MyLastName 1990 MyEmail@secret.com +491634567890';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(
      masked
        .split(' ')
        .every(
          (word) => word !== 'MyFirstName' && word !== 'MyLastName' && word !== 'MyEmail@secret.com'
        )
    ).toBe(true);
    expect(masked).toContain('1990');
    expect(masked).not.toContain('MyEmail@secret.com');
    expect(masked).toContain('+491634567890');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple email addresses and leave phone numbers as they are', () => {
    const original =
      'Contact us at info@example.com or support@example.com. Call +491634567890 or +499876543210';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toContain('info@example.com');
    expect(masked).not.toContain('support@example.com');
    expect(masked).toContain('+491634567890');
    expect(masked).toContain('+499876543210');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with no sensitive data', () => {
    const original = 'This is a regular string with no sensitive data.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe(original);
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original);
  });

  it('should handle a string with mixed sensitive and non-sensitive data', () => {
    const original = 'MyFirstName is Max and MyLastName is Mustermann.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toBe('Max is Max and Mustermann is Mustermann.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with sensitive data in different cases', () => {
    const original = 'myfirstname MYLASTNAME MyFirstName MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toBe('Max Mustermann Max Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with sensitive data in different formats', () => {
    const original = 'MyFirstName-MyLastName MyFirstName.MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max-Mustermann Max.Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle a string with sensitive data and special characters', () => {
    const original = 'MyFirstName! MyLastName? MyFirstName@MyLastName#';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max! Mustermann? Max@Mustermann#');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });
});
