<!-- src/components/importExport/ImportRuleSetButton.vue -->
<template>
    <div>
        <MainImportExportButton :label="label" :color="color" icon="mdi-import"
            :tooltip-text="$t('importExport.import-rule-set-button-tooltip')" is-import :on-action="importRules" />
        <!-- Include Snackbar component -->
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRulesStore } from '../../store/rulesStore';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { useI18n } from 'vue-i18n';
import { validatePersistedRulesFileFormat } from '../../services/PersistedRulesValidator';

const { t } = useI18n();
const rulesStore = useRulesStore();

const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const importRules = async (event: Event) => {
    try {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) throw new Error('No file selected.');

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const importedRules = validatePersistedRulesFileFormat(reader.result as string);
                await rulesStore.importRules(importedRules);
                snackbarMessage.value = t('importExport.import-rule-set-success');
                snackbarColor.value = 'success';
            } catch (error) {
                console.error('Error validating rules on import:', error);
                snackbarMessage.value = t('importExport.import-rule-set-error');
                snackbarColor.value = 'error';
            } finally {
                snackbarVisible.value = true;
            }
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('Error importing rules:', error);
        snackbarMessage.value = t('importExport.import-rule-set-error');
        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
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