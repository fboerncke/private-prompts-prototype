import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomPrice', () => {
    it('should generate a price within the default range', () => {
        const price = parseFloat(TemporaryPlaceholderProcessor['generateRandomPrice']([]));
        expect(price).toBeGreaterThanOrEqual(1);
        expect(price).toBeLessThanOrEqual(1000);
    });

    it('should generate a price within the specified range', () => {
        const price = parseFloat(TemporaryPlaceholderProcessor['generateRandomPrice']([5, 10]));
        expect(price).toBeGreaterThanOrEqual(5);
        expect(price).toBeLessThanOrEqual(10);
    });

    it('should generate a price with specified currency', () => {
        const price = TemporaryPlaceholderProcessor['generateRandomPrice']([5, 10, 'USD']);
        expect(price).toMatch(/USD$/);
    });
});
