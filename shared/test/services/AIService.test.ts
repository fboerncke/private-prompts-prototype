import { isAPIKeyAvailable, getAIResponse } from '../../src/services/AIService';
import { PersistenceService } from '../../src/services/PersistenceService';

// Mock PersistenceService to control API key behavior
jest.mock('../../src/services/PersistenceService');
const mockedPersistenceService = PersistenceService as jest.MockedClass<typeof PersistenceService>;

// Mock OpenAI client behavior
jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn().mockResolvedValue({
                    choices: [{ message: { content: 'AI response' } }],
                }),
            },
        },
    }));
});

describe('AIService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup the mock to return an API key for isAPIKeyAvailable
        mockedPersistenceService.prototype.loadOpenAIKey = jest.fn().mockResolvedValue('fake-api-key');
    });

    test('isAPIKeyAvailable returns true when key exists', async () => {
        const available = await isAPIKeyAvailable();
        expect(available).toBe(true);
    });

    test('getAIResponse returns a response from OpenAI', async () => {
        const response = await getAIResponse('Test prompt');
        expect(response).toBe('AI response');
    });

    // Add additional tests for error handling, missing API key, etc.
});