<!-- src/components/importExport/ExportPromptSetButton.vue -->
<template>
    <div>
        <MainImportExportButton :label="label" :color="color" icon="mdi-export"
            :tooltip-text="$t('importExport.export-prompt-set-button-tooltip')" :on-action="exportPrompts" />
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePromptStore } from '../../store/promptStore';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const promptStore = usePromptStore();
const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const exportPrompts = () => {
    try {
        const prompts = promptStore.prompts;
        const promptsWithoutId = prompts.map(({ id: _id, ...rest }) => rest);
        const json = JSON.stringify(promptsWithoutId, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'private-prompts-prompt-set.json';
        link.click();

        snackbarMessage.value = t('importExport.export-prompt-set-success');
        snackbarColor.value = 'success';
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error exporting prompts:', error);
        snackbarMessage.value = t('importExport.export-prompt-set-error');
        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
};

// Define props to allow overwrite of default values
const _props = defineProps({
    label: {
        type: String,
        default: 'Export Prompt Set'
    },
    color: {
        type: String,
        default: 'primary'
    }
});
</script>