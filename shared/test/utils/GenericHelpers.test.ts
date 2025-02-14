import { isRegexPattern, escapeRegExp, isTextOnly } from '../../src/utils/GenericHelpers';

describe('Utility Functions', () => {
    test('isRegexPattern identifies valid regex', () => {
        expect(isRegexPattern('\\d+')).toBe(true);
        expect(isRegexPattern('[unclosed')).toBe(false);
    });

    test('escapeRegExp escapes special characters', () => {
        const special = '.*+?^${}()|[]\\';
        const escaped = escapeRegExp(special);
        expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    test('isTextOnly returns true for alphabetic strings', () => {
        expect(isTextOnly('HelloWorld')).toBe(true);
        expect(isTextOnly('Hello World!')).toBe(false);
    });
});