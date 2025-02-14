import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomNumber', () => {
    it('should generate a number within the default range', () => {
        const number = parseInt(TemporaryPlaceholderProcessor['generateRandomNumber']([]), 10);
        expect(number).toBeGreaterThanOrEqual(1);
        expect(number).toBeLessThanOrEqual(1000);
    });

    it('should generate a number within the specified range', () => {
        const number = parseInt(TemporaryPlaceholderProcessor['generateRandomNumber']([5, 10]), 10);
        expect(number).toBeGreaterThanOrEqual(5);
        expect(number).toBeLessThanOrEqual(10);
    });
});
