<!-- src/components/importExport/ImportPromptSetButton.vue -->
<template>
    <div>
        <MainImportExportButton :label="label" :color="color" icon="mdi-import"
            :tooltip-text="$t('importExport.import-prompt-set-button-tooltip')" is-import :on-action="importPrompts" />
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePromptStore } from '../../store/promptStore';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { generatePromptHash } from "../../utils/HashUtils";
import type { Prompt } from "../../interfaces/PromptInterface";
import { PersistenceService } from '../../services/PersistenceService';
import { generateUniqueId } from '../../utils/GenericHelpers';
import { useI18n } from 'vue-i18n';
import { validatePersistedPromptsFileFormat } from '../../services/PersistedPromptsValidator';

const { t } = useI18n();
const promptStore = usePromptStore();
const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const persistenceService = new PersistenceService();

const importPrompts = async (event: Event) => {
    try {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) throw new Error('No file selected.');

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const data = validatePersistedPromptsFileFormat(reader.result as string);

                const importedPrompts: Omit<Prompt, "id">[] = data;
                const existingPrompts: Prompt[] = await persistenceService.loadPrompts();

                // let importedCount = 0;
                // let skippedCount = 0;
                // let invalidCount = 0;

                for (const prompt of importedPrompts) {
                    if (validatePrompt(prompt)) {

                        const hash = generatePromptHash(prompt);
                        const exists = existingPrompts.some(
                            (existingPrompt: Prompt) => generatePromptHash(existingPrompt) === hash,
                        );

                        if (!exists) {
                            const newPrompt: Prompt = {
                                ...prompt,
                                id: generateUniqueId(),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            };
                            existingPrompts.push(newPrompt);
                            // importedCount++;
                        } else {
                            console.log("Duplicate detected");
                            // skippedCount++;
                        }
                    } else {
                        // invalidCount++;
                    }
                }

                await persistenceService.savePrompts(existingPrompts);
                await promptStore.loadPrompts();

                snackbarMessage.value = t('importExport.import-prompt-set-success');
                snackbarColor.value = 'success';
            } catch (error) {
                console.error('Validation failed:', error);
                snackbarMessage.value = t('importExport.import-prompt-set-error');
                snackbarColor.value = 'error';
            } finally {
                snackbarVisible.value = true;
            }
            snackbarVisible.value = true;
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('Error importing prompts:', error);
        snackbarMessage.value = t('importExport.import-prompt-set-error');
        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
};

// Validate Prompt Structure
const validatePrompt = (prompt: Omit<Prompt, "id">): prompt is Omit<Prompt, "id"> => {
    return (
        typeof prompt.description === "string" &&
        typeof prompt.prompt === "string" &&
        typeof prompt.comment === "string" &&
        Array.isArray(prompt.platforms) &&
        Array.isArray(prompt.tags) &&
        typeof prompt.createdAt === "string" &&
        typeof prompt.updatedAt === "string"
    );
};

// Define props to allow overwrite of default values
const _props = defineProps({
    label: {
        type: String,
        default: 'Import Prompt Set'
    },
    color: {
        type: String,
        default: 'primary'
    }

});
</script>