import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomCurrency', () => {
    it('should generate a valid ISO 4217 currency code', () => {
        const currency = TemporaryPlaceholderProcessor['generateRandomCurrency']();
        expect(typeof currency).toBe('string');
        expect(currency.length).toBe(3);
    });
});
