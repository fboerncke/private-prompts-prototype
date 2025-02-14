<template>
    <div>
        <MainImportExportButton :label="$t('importExport.import-app-configuration-button-label')" color="primary"
            icon="mdi-export" :tooltip-text="$t('importExport.import-app-configuration-button-tooltip')" is-import
            :on-action="importAppConfig" />
        <!-- Include Snackbar component -->
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { getPersistence } from '../../services/PersistenceProvider';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const importAppConfig = async (event: Event) => {

    const persistence = getPersistence();
    try {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) throw new Error('No file selected.');

        const reader = new FileReader();
        reader.onload = async () => {
            const importedConfiguration = JSON.parse(reader.result as string);
            await persistence.saveAppConfiguration(importedConfiguration);
            snackbarMessage.value = 'App configuration imported successfully!';
            snackbarMessage.value = t('importExport.import-app-configuration-success');
            snackbarColor.value = 'success';
            snackbarVisible.value = true;
        };
        reader.readAsText(file);
        window.location.reload();
    } catch (error) {
        console.error('Error importing app configuration', error);
        snackbarMessage.value = t('importExport.import-app-configuration-error');
        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
};
</script>
