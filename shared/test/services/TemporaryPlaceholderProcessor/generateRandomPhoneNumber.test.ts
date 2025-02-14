import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomPhoneNumber', () => {
    it('should generate a valid phone number', () => {
        const phoneNumber = TemporaryPlaceholderProcessor['generateRandomPhoneNumber']();
        expect(typeof phoneNumber).toBe('string');
        expect(phoneNumber).toMatch(/^\+\d{1,3}\d{1,14}$/);
    });
});
