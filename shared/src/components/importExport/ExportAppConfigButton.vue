<template>
    <div>
        <MainImportExportButton :label="$t('importExport.export-app-configuration-button-label')" color="primary"
            icon="mdi-export" :tooltip-text="$t('importExport.export-app-configuration-button-tooltip')"
            :on-action="exportAppConfig" />
        <!-- Include Snackbar component -->
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { getPersistence } from '../../services/PersistenceProvider';
import { PersistenceService } from '../../services/PersistenceService';
import { AppConfiguration } from '../../interfaces/AppConfigurationInterface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const exportAppConfig = async (_event: Event) => {
    try {
        const persistence = getPersistence();

        const appConfig: AppConfiguration = await persistence.loadAppConfiguration();

        const persistenceService = new PersistenceService();
        const dataToSaveWithoutIds = persistenceService.removeInternalIdsFromJSON(appConfig);

        const json = JSON.stringify(dataToSaveWithoutIds, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'private-prompts-app-configuration.json';
        link.click();

        snackbarMessage.value = t('importExport.export-app-configuration-success');
        snackbarColor.value = 'success';
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error exporting rules:', error);
        snackbarMessage.value = t('importExport.export-app-configuration-error');

        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
};
</script>
