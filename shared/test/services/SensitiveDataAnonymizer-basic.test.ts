import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import type { Rule } from "../../src/interfaces/RuleInterface";
import { SensitiveDataAnonymizer } from '../../src/services/SensitiveDataAnonymizer';

describe('Basic tests', () => {
  let sensitiveDataAnonymizer: SensitiveDataAnonymizer;

  beforeEach(() => {
    const rulesPath = path.resolve(__dirname, '../../test/rules-for-unit-testing.json');
    const ruleSet: Rule[] = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    sensitiveDataAnonymizer = new SensitiveDataAnonymizer(ruleSet);
  });

  it('should handle empty string ""', () => {
    const original = '';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle whitespace string ""', () => {
    const original = '   ';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should return the same string if no match is found', () => {
    const original = 'Hello, world!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, world!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  // case sensitive

  it('should mask "MyFirstName" with "Max" respecting case', () => {
    const original = 'Hello, MyFirstName!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, Max!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" at end of expression', () => {
    const original = 'Hello, MyFirstName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, Max');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" at start of expression', () => {
    const original = 'MyFirstName is tired.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max is tired.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" with no context around', () => {
    const original = 'MyFirstName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" with non word character before', () => {
    const original = '!MyFirstName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('!Max');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" with non word character after', () => {
    const original = 'MyFirstName!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" with non word characters around', () => {
    const original = '!MyFirstName!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('!Max!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask "MyFirstNamei" ', () => {
    const original = 'Hello, MyFirstNamei!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, MyFirstNamei!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" and handle whitespace prefix', () => {
    const original = '   Hello, MyFirstName!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, Max!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" and handle whitespace suffix', () => {
    const original = 'Hello, MyFirstName!    ';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, Max!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask "myFirstName" because of different case', () => {
    const original = 'Hello, myFirstName!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, myFirstName!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask "MYFIRSTNAME" because of different case', () => {
    const original = 'Hello, MYFIRSTNAME!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, MYFIRSTNAME!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyLastName" with "Mustermann"', () => {
    const original = 'Mr. MyLastName is here';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Mr. Mustermann is here');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask both "MyFirstName" and "MyLastName"', () => {
    const original = 'MyFirstName MyLastName is present';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max Mustermann is present');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple occurrences of "MyFirstName" and "MyLastName"', () => {
    const original = 'MyFirstName and MyLastName know MyFirstName MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max and Mustermann know Max Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask "pEtEr" with "rObErT"', () => {
    const original = 'Hello, pEtEr!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, pEtEr!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask "MyFirstName" with "Max" with non word character before', () => {
    const original = '!MyFirstName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('!Max');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask upper case "MYFIRSTNAME"', () => {
    const original = 'Hello, MYFIRSTNAME!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, MYFIRSTNAME!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should not mask "Peter" ', () => {
    const original = 'Hello, Peter!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Hello, Peter!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should mask both "MyFirstName" and "MyLastName"', () => {
    const original = 'MyFirstName MyLastName is present';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max Mustermann is present');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle multiple occurrences of "MyFirstName" and "MyLastName"', () => {
    const original = 'MyFirstName and MyLastName know MyFirstName MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max and Mustermann know Max Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data at the beginning, middle, and end of a string', () => {
    const original = 'MyFirstName is friend with MyLastName and they know MyTopSecretProjectName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max is friend with Mustermann and they know Project Phoenix');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('will intentionally handle NOT sensitive data with special characters in between', () => {
    const original = 'M-y-F-i-r-s-t-N-a-m-e M.y.L.a.s.t.N.a.m.e';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('M-y-F-i-r-s-t-N-a-m-e M.y.L.a.s.t.N.a.m.e');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  // Additional tests

  it('should handle sensitive data with mixed case', () => {
    const original = 'MyFirstName and myFirstName are different';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max and myFirstName are different');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });


  it('should handle sensitive data with numbers corretly as unrelated', () => {
    const original = 'MyFirstName123 is here';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toBe('Max123 is here');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with leading and trailing spaces', () => {
    const original = '  MyFirstName  ';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with multiple spaces in between', () => {
    const original = 'MyFirstName    MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max    Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with tabs', () => {
    const original = 'MyFirstName\tMyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max\tMustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with newlines', () => {
    const original = 'MyFirstName\nMyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max\nMustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with carriage returns', () => {
    const original = 'MyFirstName\rMyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max\rMustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with mixed whitespace characters', () => {
    const original = 'MyFirstName \t\n\r MyLastName';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max \t\n\r Mustermann');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with punctuation', () => {
    const original = 'MyFirstName, MyLastName.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max, Mustermann.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with multiple punctuation marks', () => {
    const original = 'MyFirstName... MyLastName!!!';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max... Mustermann!!!');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with mixed case and punctuation', () => {
    const original = 'MyFirstName, myFirstName.';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).toBe('Max, myFirstName.');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with attached special characters and numbers as not to be sensitive', () => {
    const original = 'MyFirstName123! MyLastName456?';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toBe('Max123! Mustermann456?');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });

  it('should handle sensitive data with mixed case, special characters, and numbers as not related', () => {
    const original = 'MyFirstName123! myFirstName456?';
    const masked = sensitiveDataAnonymizer.maskSensitiveData(original);
    expect(masked).not.toBe('Max123! myFirstName456?');
    const unmasked = sensitiveDataAnonymizer.unmaskSensitiveData(masked);
    expect(unmasked).toBe(original.trim());
  });
});
