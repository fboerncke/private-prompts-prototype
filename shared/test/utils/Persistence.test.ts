import { PersistenceService } from '../../src/services/PersistenceService';
import { PersistenceInterface } from "../../src/interfaces/PersistenceInterface";
import { setPersistence } from "../../src/services/PersistenceProvider"; // Ensure you have a setter function
import { AppConfiguration } from '../../src/interfaces/AppConfigurationInterface';

const mockPersistence: PersistenceInterface = {
    loadAppConfiguration: function <_T>(): Promise<AppConfiguration> {
        throw new Error('Function not implemented.');
    },
    saveAppConfiguration: function <_T>(_data: AppConfiguration): Promise<void> {
        throw new Error('Function not implemented.');
    },
    getAppConfigurationPath: function (): Promise<string> {
        throw new Error('Function not implemented.');
    }
};

describe('Persistence Utilities', () => {

    let persistenceService: PersistenceService;

    beforeEach(() => {
        // Set the mock persistence instance before each test
        setPersistence(mockPersistence);
        persistenceService = new PersistenceService();
    });

    test('empty string is not base64', () => {
        const isBase64 = persistenceService.isBase64('');
        expect(isBase64).toBe(false);
    });

    test('SPACE is not base64', () => {
        const isBase64 = persistenceService.isBase64(' ');
        expect(isBase64).toBe(false);
    });

    test('alpha is not base64', () => {
        const isBase64 = persistenceService.isBase64('alpha');
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8gd29ybGQ=' is valid Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8gd29ybGQ=");
        expect(isBase64).toBe(true);
    });

    test("'dGVzdA==' is valid Base64", () => {
        const isBase64 = persistenceService.isBase64("dGVzdA==");
        expect(isBase64).toBe(true);
    });

    test("'YWJjZA==' is valid Base64", () => {
        const isBase64 = persistenceService.isBase64("YWJjZA==");
        expect(isBase64).toBe(true);
    });

    test("'YWJjZA' (without padding) is invalid Base64", () => {
        const isBase64 = persistenceService.isBase64("YWJjZA");
        expect(isBase64).toBe(false);
    });

    test("'alpha' is not Base64", () => {
        const isBase64 = persistenceService.isBase64("alpha");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8#d29ybGQ=' (invalid character #) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8#d29ybGQ=");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8===' (incorrect padding) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8===");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8gd29ybGQ====' (too much padding) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8gd29ybGQ====");
        expect(isBase64).toBe(false);
    });

    test("'YWJjZ' (length not multiple of 4) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("YWJjZ");
        expect(isBase64).toBe(false);
    });

    test("' ' (whitespace only) is not Base64", () => {
        const isBase64 = persistenceService.isBase64(" ");
        expect(isBase64).toBe(false);
    });

    test("'\\n\\t' (newline and tab) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("\n\t");
        expect(isBase64).toBe(false);
    });

    test("'' (empty string) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("");
        expect(isBase64).toBe(false);
    });

    test("'YWJjZA===' (incorrect padding placement) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("YWJjZA===");
        expect(isBase64).toBe(false);
    });

    test("'YWJjZ$==' (invalid character $) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("YWJjZ$==");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8gd29ybGQ' (without padding) is invalid Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8gd29ybGQ");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8gd29ybGQ=' (valid with padding) is valid Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8gd29ybGQ=");
        expect(isBase64).toBe(true);
    });

    test("'SGVsbG8gd29ybGQ== ' (trailing whitespace) is invalid Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8gd29ybGQ== ");
        expect(isBase64).toBe(false);
    });

    test("' SGVsbG8gd29ybGQ==' (leading whitespace) is invalid Base64", () => {
        const isBase64 = persistenceService.isBase64(" SGVsbG8gd29ybGQ==");
        expect(isBase64).toBe(false);
    });

    test("'SGVsbG8 gd29ybGQ==' (whitespace inside, should be invalid) is not Base64", () => {
        const isBase64 = persistenceService.isBase64("SGVsbG8 gd29ybGQ==");
        expect(isBase64).toBe(false);
    });
});