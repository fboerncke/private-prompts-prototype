import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomISO2', () => {
    it('should generate a valid ISO 3166-1 Alpha-2 country code', () => {
        const iso2 = TemporaryPlaceholderProcessor['generateRandomISO2']();
        expect(typeof iso2).toBe('string');
        expect(iso2.length).toBe(2);
    });
});
