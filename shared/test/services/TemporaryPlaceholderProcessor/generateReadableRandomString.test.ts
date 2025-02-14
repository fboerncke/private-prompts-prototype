import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateReadableRandomString', () => {
    it('should generate a readable random string of default length', () => {
        const randomString = TemporaryPlaceholderProcessor['generateReadableRandomString']([]);
        expect(typeof randomString).toBe('string');
        expect(randomString.length).toBe(8);
    });

    it('should generate a readable random string of specified length', () => {
        const randomString = TemporaryPlaceholderProcessor['generateReadableRandomString']([12]);
        expect(randomString.length).toBe(12);
    });
});
