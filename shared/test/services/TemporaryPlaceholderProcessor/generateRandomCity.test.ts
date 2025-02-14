import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomCity', () => {
    it('should generate a valid city name', () => {
        const city = TemporaryPlaceholderProcessor['generateRandomCity']();
        expect(typeof city).toBe('string');
        expect(city.length).toBeGreaterThan(0);
    });
});
