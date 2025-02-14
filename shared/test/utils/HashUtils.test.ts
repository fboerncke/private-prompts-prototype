import { generateHexHash, generateReadableHash, generateNumericHash, generateDJB2HexHash, generatePromptHash } from '../../src/utils/HashUtils';
import type { Prompt } from '../../src/interfaces/PromptInterface';

describe('Hash Utilities', () => {
    test('generateHexHash returns a hexadecimal string', () => {
        const input = 'test string';
        const hash = generateHexHash(input);
        expect(typeof hash).toBe('string');
        expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    test('generateReadableHash returns a string of specified length', () => {
        const input = 'another test';
        const length = 10;
        const readable = generateReadableHash(input, length);
        expect(readable.length).toBe(length);
        // Check that first char is a vowel as per logic
        expect('aeiou').toContain(readable[0]);
    });

    test('generateNumericHash returns a string of digits', () => {
        const input = 'numeric test';
        const numeric = generateNumericHash(input);
        expect(numeric).toMatch(/^\d+$/);
    });

    test('generateDJB2HexHash produces consistent output', () => {
        const input = 'consistent';
        const hash1 = generateDJB2HexHash(input);
        const hash2 = generateDJB2HexHash(input);
        expect(hash1).toBe(hash2);
    });

    test('generatePromptHash returns a consistent hash for identical prompts', () => {
        const prompt: Omit<Prompt, "id"> = {
            description: 'Sample',
            prompt: 'Do something.',
            comment: 'Test comment',
            platforms: ['TestPlatform'],
            tags: ['test'],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const hashA = generatePromptHash(prompt);
        const hashB = generatePromptHash(prompt);
        expect(hashA).toBe(hashB);
    });

    test('generateReadableHash handles empty input', () => {
        const readable = generateReadableHash('', 6);
        expect(readable.length).toBe(6);
    });

    test('generatePromptHash differentiates similar prompts', () => {
        const prompt1: Omit<Prompt, "id"> = {
            description: 'Desc',
            prompt: 'Content A',
            comment: '',
            platforms: [],
            tags: [],
            isFavorite: false,
            createdAt: "2022-01-01T00:00:00Z",
            updatedAt: "2022-01-01T00:00:00Z",
        };
        const prompt2 = { ...prompt1, prompt: 'Content B' };
        expect(generatePromptHash(prompt1)).not.toBe(generatePromptHash(prompt2));
    });
});