import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomIP', () => {
    it('should generate a valid IPv4 address', () => {
        const ip = TemporaryPlaceholderProcessor['generateRandomIPv4']([]);
        expect(ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });

});
