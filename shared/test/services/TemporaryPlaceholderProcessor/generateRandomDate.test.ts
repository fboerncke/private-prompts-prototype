import { TemporaryPlaceholderProcessor } from '../../../src/services/TemporaryPlaceholderProcessor';

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

    it('should generate a date in the specified range and format', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([1990, 2000, 'DD.MM.YYYY']);
        console.log(date); // Debugging line to check the generated date format
        const year = parseInt(date.split('.')[2], 10);
        expect(year).toBeGreaterThanOrEqual(1990);
        expect(year).toBeLessThanOrEqual(2000);
        expect(date).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
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

    it('should generate a date without parameters', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([]);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate a date when called as {date} without parentheses', () => {
        const date = TemporaryPlaceholderProcessor.getTemporaryReplacementString("{date}");
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should default to 2000-2030 if the first year parameter is empty', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate'](['', 2000]);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBeGreaterThanOrEqual(2000);
        expect(year).toBeLessThanOrEqual(2030);
    });

    it('should handle all empty parameters and default to 2000-2030, YYYY-MM-DD', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate'](['', '', '']);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should default to YYYY-MM-DD format if the format string is empty', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2020, 2020, '']);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should always return a 2025 date when min and max year are the same', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2025, 2025]);
        expect(date).toMatch(/^2025-\d{2}-\d{2}$/);
    });

    it('should swap min and max year if given in the wrong order', () => {
        const date = TemporaryPlaceholderProcessor['generateRandomDate']([2030, 2000]);
        const year = parseInt(date.split('-')[0], 10);
        expect(year).toBeGreaterThanOrEqual(2000);
        expect(year).toBeLessThanOrEqual(2030);
    });

    it('should log a warning and use defaults when invalid years are provided', () => {
        console.warn = jest.fn();
        const date = TemporaryPlaceholderProcessor['generateRandomDate'](['text', 2020]);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Invalid year parameters"));
    });

    test('should return a random date in the specified format', () => {
        const result = TemporaryPlaceholderProcessor['generateRandomDate']([1990, 2020, 'DD/MM/YYYY']);
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
});
