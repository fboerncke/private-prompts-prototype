import { DEFAULT_JSON_CONFIGURATION } from '../../src/constants/DefaultAppConfiguration';
import type { AppConfiguration } from '../../src/interfaces/AppConfigurationInterface';
import type { PersistenceInterface } from '../../src/interfaces/PersistenceInterface';
import { Prompt } from '../../src/interfaces/PromptInterface';
import { setPersistence } from '../../src/services/PersistenceProvider';
import { PersistenceService } from '../../src/services/PersistenceService';

const mockConfig: AppConfiguration = DEFAULT_JSON_CONFIGURATION;

class MockPersistence implements PersistenceInterface {
    getAppConfigurationPath(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async loadAppConfiguration<_T>(): Promise<AppConfiguration> {
        return mockConfig;
    }
    async saveAppConfiguration<_T>(data: AppConfiguration): Promise<void> {
        Object.assign(mockConfig, data);
    }
}

describe('PersistenceService', () => {
    let service: PersistenceService;

    beforeEach(() => {
        // Inject our mock persistence instance
        setPersistence(new MockPersistence());
        service = new PersistenceService();
    });

    test('loadPrompts returns prompts from configuration', async () => {
        const samplePrompt: Prompt = {
            id: 1,
            description: "Sample",
            prompt: "Test",
            comment: "",
            platforms: [],
            tags: [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockConfig.prompts = [samplePrompt];

        const prompts = await service.loadPrompts();
        expect(prompts).toHaveLength(1);
        expect(prompts[0].description).toBe("Sample");
    });

    test('savePrompts updates configuration', async () => {
        const newPrompt: Prompt = {
            id: 2,
            description: "New Prompt",
            prompt: "Content",
            comment: "",
            platforms: [],
            tags: [],
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await service.savePrompts([newPrompt]);
        expect(mockConfig.prompts).toContainEqual(newPrompt);
    });

    // Additional tests for loadRules, saveRules, history, themes, etc., can be added similarly.
});