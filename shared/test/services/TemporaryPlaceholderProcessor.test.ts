import { TemporaryPlaceholderProcessor } from '../../src/services/TemporaryPlaceholderProcessor';

describe('TemporaryPlaceholderProcessor.generateRandomDate', () => {
    it('should generate a date in the default range and format', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([]);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate a date in the specified range', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([1990, 2000]);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBeGreaterThanOrEqual(1990);
        expect(year).toBeLessThanOrEqual(2000);
    });

    it('should generate a date in the specified format', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2000, 2030, 'DD/MM/YYYY']);
        expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should generate a date in the specified range and format', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([1990, 2000, 'DD/MM/YYYY']);
        const year = parseInt(date.split('/')[2], 10);
        expect(year).toBeGreaterThanOrEqual(1990);
        expect(year).toBeLessThanOrEqual(2000);
        expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should handle invalid parameters gracefully', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate'](['invalid', 'params']);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate a date with a single year range', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2020, 2020]);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBe(2020);
    });

    it('should generate a date with a single year range and custom format', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2020, 2020, 'MM-DD-YYYY']);
        expect(date).toMatch(/^\d{2}-\d{2}-2020$/);
    });

    it('should generate a date with minimum year greater than maximum year', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2030, 2000]);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBeGreaterThanOrEqual(2000);
        expect(year).toBeLessThanOrEqual(2030);
    });

    it('should generate a date with non-numeric year parameters', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate'](['2000', '2030']);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBeGreaterThanOrEqual(2000);
        expect(year).toBeLessThanOrEqual(2030);
    });

    it('should generate a date with missing format parameter', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2000, 2030, '']);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
