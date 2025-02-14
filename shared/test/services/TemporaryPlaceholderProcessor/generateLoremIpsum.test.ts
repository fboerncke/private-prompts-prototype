import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateLoremIpsum', () => {
    test('should return a predefined Lorem Ipsum text', () => {
        const result = TemporaryPlaceholderProcessor['generateLoremIpsum']();
        expect(result).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    });
});
