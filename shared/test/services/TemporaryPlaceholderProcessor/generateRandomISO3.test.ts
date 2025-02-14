import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomISO3', () => {
    it('should generate a valid ISO 3166-1 Alpha-3 country code', () => {
        const iso3 = TemporaryPlaceholderProcessor['generateRandomISO3']();
        expect(typeof iso3).toBe('string');
        expect(iso3.length).toBe(3);
    });
});
