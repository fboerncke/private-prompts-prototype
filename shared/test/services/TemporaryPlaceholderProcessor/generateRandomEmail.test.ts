import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomEmail', () => {
    it('should generate a valid email address', () => {
        const email = TemporaryPlaceholderProcessor['generateRandomEmail']([]);
        expect(typeof email).toBe('string');
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should generate a valid email address with specified provider', () => {
        const email = TemporaryPlaceholderProcessor['generateRandomEmail'](['example.com']);
        expect(email).toMatch(/@example\.com$/);
    });
});
