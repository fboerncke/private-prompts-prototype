<!-- src/components/importExport/ExportRuleSetButton.vue -->
<template>
    <div>
        <MainImportExportButton :label="label" :color="color" icon="mdi-export"
            :tooltip-text="$t('importExport.export-rule-set-button-tooltip')" :on-action="exportRules" />
        <SimpleSnackbar v-model:visible="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRulesStore } from '../../store/rulesStore';
import SimpleSnackbar from '../SimpleSnackbar.vue';
import MainImportExportButton from '../../components/importExport/MainImportExportButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const rulesStore = useRulesStore();
const snackbarMessage = ref('');
const snackbarColor = ref('info');
const snackbarVisible = ref(false);

const exportRules = () => {
    try {
        const rules = rulesStore.rules;
        const rulesWithoutId = rules.map(({ id: _id, ...rest }) => rest);
        const json = JSON.stringify(rulesWithoutId, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'private-prompts-rule-set.json';
        link.click();

        snackbarMessage.value = t('importExport.export-rule-set-success');
        snackbarColor.value = 'success';
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error exporting rules:', error);
        snackbarMessage.value = t('importExport.export-rule-set-error');
        snackbarColor.value = 'error';
        snackbarVisible.value = true;
    }
};

const _props = defineProps({
    label: {
        type: String,
        default: 'Export Rrompt Set'
    },
    color: {
        type: String,
        default: 'primary'
    }
});

</script>