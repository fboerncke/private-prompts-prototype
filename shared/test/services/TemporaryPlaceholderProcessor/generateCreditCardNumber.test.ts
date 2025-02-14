import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateCreditCardNumber', () => {
    it('should generate a valid Visa credit card number', () => {
        const cardNumber = TemporaryPlaceholderProcessor['generateCreditCardNumber']([]);
        expect(cardNumber).toMatch(/^4/);
    });
});
