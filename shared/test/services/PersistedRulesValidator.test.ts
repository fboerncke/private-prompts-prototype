import { validatePersistedRulesFileFormat } from '../../src/services/PersistedRulesValidator';

describe('validatePersistedRulesFileFormat', () => {

    it('should throw an error if JSON is invalid', () => {
        expect(() => validatePersistedRulesFileFormat('invalid json')).toThrow('Invalid JSON format: Unexpected token \'i\', "invalid json" is not valid JSON');
    });

    it('should throw an error if root is not an array', () => {
        expect(() => validatePersistedRulesFileFormat('{"rules": []}')).toThrow('Invalid JSON structure: Expected an array of rules.');
    });

    it('should throw an error if array is empty', () => {
        expect(() => validatePersistedRulesFileFormat('[]')).toThrow("Invalid JSON structure: 'rules' array must contain at least one rule.");
    });

    it('should throw an error if array exceeds maximum limit', () => {
        const rules = new Array(1001).fill({
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 'placeholder'
        });
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Too many rules: The limit is 1000 rules.');
    });

    it('should throw an error if a rule is not an object', () => {
        expect(() => validatePersistedRulesFileFormat('[null]')).toThrow('Invalid rule at index 0: Each rule must be an object.');
    });

    it('should throw an error if a rule contains unexpected fields', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 'placeholder',
            unexpectedField: 'unexpected'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: Unexpected fields detected.');
    });

    it('should throw an error if userDefinedSensitiveDataPattern is not a non-empty string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: '',
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedSensitiveDataPattern" must be a non-empty string.');
    });

    it('should throw an error if userDefinedTemporaryPlaceholder is not a non-empty string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: ''
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedTemporaryPlaceholder" must be a non-empty string.');
    });

    it('should throw an error if userDefinedSensitiveDataPattern is missing', () => {
        const rules = [{
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedSensitiveDataPattern" must be a non-empty string.');
    });

    it('should throw an error if userDefinedTemporaryPlaceholder is missing', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedTemporaryPlaceholder" must be a non-empty string.');
    });

    it('should throw an error if userDefinedSensitiveDataPattern is not a string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 123,
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedSensitiveDataPattern" must be a non-empty string.');
    });

    it('should throw an error if userDefinedTemporaryPlaceholder is not a string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 123
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedTemporaryPlaceholder" must be a non-empty string.');
    });

    it('should throw an error if userDefinedSensitiveDataPattern is a whitespace string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: '   ',
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedSensitiveDataPattern" must be a non-empty string.');
    });

    it('should throw an error if userDefinedTemporaryPlaceholder is a whitespace string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: '   '
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedTemporaryPlaceholder" must be a non-empty string.');
    });

    it('should return the parsed PersistedRuleSet if valid', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(validatePersistedRulesFileFormat(JSON.stringify(rules))).toEqual(rules);
    });

    it('should throw an error if userDefinedSensitiveDataPattern is an empty string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: '',
            userDefinedTemporaryPlaceholder: 'placeholder'
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedSensitiveDataPattern" must be a non-empty string.');
    });

    it('should throw an error if userDefinedTemporaryPlaceholder is an empty string', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: ''
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: "userDefinedTemporaryPlaceholder" must be a non-empty string.');
    });

    it('should throw an error if JSON contains a nested array', () => {
        const rules = [[{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 'placeholder'
        }]];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: Unexpected fields detected.');
    });

    it('should throw an error if JSON contains a nested object', () => {
        const rules = [{
            userDefinedSensitiveDataPattern: 'pattern',
            userDefinedTemporaryPlaceholder: 'placeholder',
            nestedObject: {
                key: 'value'
            }
        }];
        expect(() => validatePersistedRulesFileFormat(JSON.stringify(rules))).toThrow('Invalid rule at index 0: Unexpected fields detected.');
    });
});
