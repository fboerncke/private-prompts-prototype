// test/services/PersistedPromptsValidator.test.ts

import { validatePersistedPromptsFileFormat } from '../../src/services/PersistedPromptsValidator';

describe('validatePersistedPromptsFileFormat', () => {
    it('should throw an error if input is not a string', () => {
        expect(() => validatePersistedPromptsFileFormat(123 as unknown as string)).toThrow('Invalid input: Expected a JSON string but received a non-text file.');
    });

    it('should throw an error if JSON is invalid', () => {
        expect(() => validatePersistedPromptsFileFormat('invalid json')).toThrow('Invalid JSON format: Unexpected token \'i\', "invalid json" is not valid JSON');
    });

    it('should throw an error if root is not an array', () => {
        expect(() => validatePersistedPromptsFileFormat('{"prompts": []}')).toThrow('Invalid JSON structure: Expected an array of prompts.');
    });

    it('should throw an error if array is empty', () => {
        expect(() => validatePersistedPromptsFileFormat('[]')).toThrow("Invalid JSON structure: 'prompts' array must contain at least one prompt.");
    });

    it('should throw an error if array exceeds maximum limit', () => {
        const prompts = new Array(1001).fill({
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        });
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Too many prompts: The limit is 1000 prompts.');
    });

    it('should throw an error if a prompt is not an object', () => {
        expect(() => validatePersistedPromptsFileFormat('[null]')).toThrow('Invalid prompt at index 0: Each prompt must be an object.');
    });

    it('should throw an error if a prompt contains unexpected fields', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z',
            unexpectedField: 'unexpected'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: Unexpected fields detected.');
    });

    it('should throw an error if description is not a non-empty string', () => {
        const prompts = [{
            description: '',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "description" must be a non-empty string.');
    });

    it('should throw an error if prompt is not a non-empty string', () => {
        const prompts = [{
            description: 'description',
            prompt: '',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "prompt" must be a non-empty string.');
    });

    it('should throw an error if comment is not a string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 123,
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "comment" must be a string.');
    });

    it('should throw an error if platforms is not an array of strings', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: 'platform',
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "platforms" must be an array of strings.');
    });

    it('should throw an error if tags is not an array of strings', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: 'tag',
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "tags" must be an array of strings.');
    });

    it('should throw an error if isFavorite is not a boolean', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: 'false',
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "isFavorite" must be a boolean.');
    });

    it('should throw an error if createdAt is not a valid ISO date string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: 'invalid date',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "createdAt" must be a valid ISO date string.');
    });

    it('should throw an error if updatedAt is not a valid ISO date string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: 'invalid date'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "updatedAt" must be a valid ISO date string.');
    });

    it('should throw an error if description is missing', () => {
        const prompts = [{
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "description" must be a non-empty string.');
    });

    it('should throw an error if prompt is missing', () => {
        const prompts = [{
            description: 'description',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "prompt" must be a non-empty string.');
    });

    it('should throw an error if comment is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "comment" must be a string.');
    });

    it('should throw an error if platforms is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "platforms" must be an array of strings.');
    });

    it('should throw an error if tags is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "tags" must be an array of strings.');
    });

    it('should throw an error if isFavorite is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "isFavorite" must be a boolean.');
    });

    it('should throw an error if createdAt is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "createdAt" must be a valid ISO date string.');
    });

    it('should throw an error if updatedAt is missing', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "updatedAt" must be a valid ISO date string.');
    });

    it('should throw an error if platforms contains non-string elements', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform', 123],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "platforms" must be an array of strings.');
    });

    it('should throw an error if tags contains non-string elements', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag', 123],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "tags" must be an array of strings.');
    });

    it('should throw an error if createdAt is not a string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: 12345,
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "createdAt" must be a valid ISO date string.');
    });

    it('should throw an error if updatedAt is not a string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: 12345
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "updatedAt" must be a valid ISO date string.');
    });

    it('should throw an error if description is a whitespace string', () => {
        const prompts = [{
            description: '   ',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "description" must be a non-empty string.');
    });

    it('should throw an error if prompt is a whitespace string', () => {
        const prompts = [{
            description: 'description',
            prompt: '   ',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow('Invalid prompt at index 0: "prompt" must be a non-empty string.');
    });

    it('should throw an error if platforms contains an empty string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform', ''],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow("Invalid prompt at index 0: \"platforms\" must not contain empty strings.");
    });

    it('should throw an error if tags contains an empty string', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag', ''],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(() => validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toThrow("Invalid prompt at index 0: \"tags\" must not contain empty strings.");
    });

    it('should return the parsed PersistedPromptArray if valid', () => {
        const prompts = [{
            description: 'description',
            prompt: 'prompt',
            comment: 'comment',
            platforms: ['platform'],
            tags: ['tag'],
            isFavorite: false,
            createdAt: '2025-01-22T12:07:31.841Z',
            updatedAt: '2025-01-22T12:07:31.841Z'
        }];
        expect(validatePersistedPromptsFileFormat(JSON.stringify(prompts))).toEqual(prompts);
    });
});
