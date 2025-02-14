<!-- src/views/tabs/SetupTab.vue -->
<template>
  <v-container class="container" fluid>
    <!-- Header -->
    <v-card flat class="setup-card">
      <v-card-title class="setup-header"
        :style="{ borderBottom: '1px solid rgba(var(--v-theme-formFieldBackground))' }">
        <h4>{{ $t('setupTab.management-console') }}</h4>
      </v-card-title>
    </v-card>
    <!-- Theme Toggle Section -->
    <h3 class="text-h6 mt-10 mb-3 text-start">{{ $t('setupTab.settings') }}</h3>
    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-text class="mt-2">
        <v-row justify="center">
          <v-col cols="auto">
            <ActionButton icon="mdi-theme-light-dark" :color="buttonColor" size="default" @click="toggleTheme">
              {{
                currentTheme === "light"
                  ? $t('setupTab.switch-to-dark-theme')
                  : $t('setupTab.switch-to-light-theme')
              }}
            </ActionButton>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-text class="mt-2">
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn :variant="locale === 'en' ? 'elevated' : 'outlined'" color="primary" @click="setLanguage('en')">
              {{ $t('setupTab.language.english') }}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn :variant="locale === 'de' ? 'elevated' : 'outlined'" color="primary" @click="setLanguage('de')">
              {{ $t('setupTab.language.german') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Import & Export Section -->
    <h3 class="text-h6 mt-10 mb-3 text-start">{{ $t('setupTab.export-import') }}</h3>
    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-title>
        <v-icon left color="primary">mdi-import-export</v-icon>
        <span class="text-h6">{{ $t('setupTab.backup-and-restore') }}</span>
      </v-card-title>
      <v-card-text class="mt-2">
        <v-row justify="center">
          <!-- Export All Data Button -->
          <v-col cols="auto">
            <ExportAppConfigButton />
          </v-col>
          <!-- Import Data Button -->
          <v-col cols="auto">
            <ImportAppConfigButton />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-title>
        <v-icon left color="primary">mdi-import-export</v-icon>
        <span class="text-h6">{{ $t('setupTab.manage-your-prompt-sets') }}</span>
      </v-card-title>
      <v-card-text class="mt-2">
        <v-row justify="center">
          <!-- Export Prompts Button -->
          <v-col cols="auto">
            <ExportPromptSetButton :label="$t('importExport.export-prompt-set-button-label')" color="primary" />
          </v-col>
          <!-- Import Prompts Button -->
          <v-col cols="auto">
            <ImportPromptSetButton :label="$t('importExport.import-prompt-set-button-label')" color="primary" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-title>
        <v-icon left color="primary">mdi-import-export</v-icon>
        <span class="text-h6">{{ $t('setupTab.manage-your-private-data-definition-rules') }}</span>
      </v-card-title>
      <v-card-text class="mt-2">
        <v-row justify="center">
          <!-- Export Rules Button -->
          <v-col cols="auto">
            <ExportRuleSetButton :label="$t('importExport.export-rule-set-button-label')" color="primary" />
          </v-col>
          <!-- Import Rules Button -->
          <v-col cols="auto">
            <ImportRuleSetButton :label="$t('importExport.import-rule-set-button-label')" color="primary" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Storage Location Information Block -->
    <h3 class="text-h6 mt-10 mb-3 text-start">
      Information
    </h3>
    <v-card class="mb-4" :color="cardColor" :elevation="2">
      <v-card-title>
        <span class="text-h6">{{ $t('setupTab.configuration-file-location') }}</span>
      </v-card-title>
      <v-card-text class="mt-2">
        <div v-if="configPath">
          <p>
            {{ $t('setupTab.private-prompts-configuration-file-path') }}
          </p>
          <br>
          <pre>{{ configPath }}</pre>
        </div>
        <div v-else>
          <p>Loading storage location...</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Danger Zone Section -->
    <h3 class="text-h6 mt-10 mb-3 text-start">
      <v-icon left color="error">mdi-alert-octagon</v-icon>&nbsp;{{ $t('setupTab.caution-area') }}
    </h3>
    <v-card class="mb-4" :color="dangerCardColor" :elevation="2">
      <v-card-title>
        <span class="text-h6">{{ $t('setupTab.open-ai-api-key') }}</span>
      </v-card-title>
      <v-card-text>
        <!-- OpenAI API Key Management -->
        <v-form ref="apiKeyForm" @submit.prevent="saveOpenAIKey">
          <v-card-text>
            {{ $t('setupTab.open-ai-api-key-hint') }}
          </v-card-text>
          <v-text-field v-model="openAIKey" :label="$t('setupTab.enter-your-openai-api-key')"
            :append-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" :type="isPasswordVisible ? 'text' : 'password'"
            outlined required dense class="mb-4" :hint="$t('setupTab.open-ai-api-key-warning')" persistent-hint
            :rules="apiKeyRules" @click:append="togglePasswordVisibility" />
          <v-row justify="center">
            <v-col cols="auto">
              <ActionButton type="submit" color="error" icon="mdi-content-save"
                :tooltip-text="$t('setupTab.open-ai-api-key-save-tooltip')" size="default"
                :disabled="!openAIKey || isSaving" :loading="isSaving">
                {{ $t('setupTab.save') }}
              </ActionButton>
            </v-col>
            <v-col cols="auto">
              <ActionButton icon="mdi-delete" :tooltip-text="$t('setupTab.open-ai-api-key-delete-tooltip')"
                color="error" size="default" :disabled="!openAIKey || isDeleting" :loading="isDeleting"
                @click="openDeleteApiKeyDialog">
                {{ $t('setupTab.delete') }}
              </ActionButton>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mb-4" :color="dangerCardColor" :elevation="2">
      <v-card-title>
        <span class="text-h6">{{ $t('setupTab.reset-application') }}</span>
      </v-card-title>
      <v-card-text>
        <!-- Reset Application -->
        <v-card-text>
          {{ $t('setupTab.reset-application-explanation') }}
        </v-card-text>
        <v-row justify="center">
          <v-col cols="auto">
            <ActionButton icon="mdi-restore" :tooltip-text="$t('setupTab.reset-application-explanation')" color="error"
              size="default" @click="openResetDialog">
              &nbsp;{{ $t('setupTab.reset-application') }}
            </ActionButton>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Confirm Delete API Key Dialog -->
    <v-dialog v-model="isDeleteApiKeyDialogOpen" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <v-icon color="error" class="mr-2">mdi-delete-circle</v-icon>
          Delete OpenAI API Key
        </v-card-title>
        <v-divider />
        <v-card-text>
          Are you sure you want to delete your OpenAI API Key? This action
          cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <ActionButton color="grey" variant="text" icon="mdi-cancel" :tooltip-text="'Cancel'"
            @click="closeDeleteApiKeyDialog">
            Cancel
          </ActionButton>
          <ActionButton color="error" variant="text" icon="mdi-delete" :tooltip-text="'Delete API Key'"
            @click="confirmDeleteOpenAIKey">
            Delete
          </ActionButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Reset Dialog -->
    <v-dialog v-model="isResetDialogOpen" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Reset All Settings
        </v-card-title>
        <v-divider />
        <v-card-text>
          Are you sure you want to reset all settings to their default values?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <ActionButton color="grey" variant="text" icon="mdi-cancel" :tooltip-text="'Cancel'"
            @click="closeResetDialogFunc">
            Cancel
          </ActionButton>
          <ActionButton color="error" variant="text" icon="mdi-restore" :tooltip-text="'Reset All Settings'"
            @click="confirmResetSettings">
            Reset
          </ActionButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for User Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right timeout="3000">
      {{ snackbar.message }}
      <ActionButton color="white" variant="text" icon="mdi-close" :tooltip-text="'Close'"
        @click="snackbar.show = false">
        Close
      </ActionButton>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useTheme } from "vuetify";
import ActionButton from "../../components/ActionButton.vue";
import ExportAppConfigButton from "../../components/importExport/ExportAppConfigButton.vue";
import ExportPromptSetButton from "../../components/importExport/ExportPromptSetButton.vue";
import ExportRuleSetButton from "../../components/importExport/ExportRuleSetButton.vue";
import ImportAppConfigButton from "../../components/importExport/ImportAppConfigButton.vue";
import ImportPromptSetButton from "../../components/importExport/ImportPromptSetButton.vue";
import ImportRuleSetButton from "../../components/importExport/ImportRuleSetButton.vue";
import { DEFAULT_JSON_CONFIGURATION } from '../../constants/DefaultAppConfiguration';
import { useI18n } from 'vue-i18n';
import { getPersistence } from '../../services/PersistenceProvider';
import { PersistenceService } from '../../services/PersistenceService';
import { currentTheme, toggleTheme } from "../../services/ThemeManager";

const { locale } = useI18n();

// Initialize Persistence
const persistence = getPersistence();
const persistenceService = new PersistenceService();

const configPath = ref<string>('');


// Theme management
const theme = useTheme();

// Computed properties for dynamic colors
const cardColor = computed(
  () => theme.global.current.value.colors.backgroundCard,
);
const buttonColor = computed(() => theme.global.current.value.colors.primary);
const dangerCardColor = computed(
  () => theme.global.current.value.colors.backgroundCardDangerous,
);

// States for Dialogs and Snackbar
const isResetDialogOpen = ref(false);
const isDeleteApiKeyDialogOpen = ref(false);
const snackbar = ref<{
  show: boolean;
  message: string;
  color: string;
  buttonColor: string;
}>({
  show: false,
  message: "",
  color: "info",
  buttonColor: "white",
});

function setLanguage(lang: 'en' | 'de' | 'fr' | 'pl') {
  locale.value = lang;
}


// State for OpenAI API Key
const openAIKey = ref("");
const isPasswordVisible = ref(false);

// Loading states
const isSaving = ref(false);
const isDeleting = ref(false);

// Validation Rules for API Key
const apiKeyRules = [
  (v: string) => !!v || "API Key is required",
  (v: string) =>
    v.trim().length >= 20 || "API Key must be at least 20 characters",
];

// Toggle password visibility
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Function to show snackbar
const showSnackbar = (
  message: string,
  color: string = "info",
  buttonColor: string = "white",
) => {
  snackbar.value = { show: true, message, color, buttonColor };
};

// Delete API Key Dialog Controls
const openDeleteApiKeyDialog = () => {
  isDeleteApiKeyDialogOpen.value = true;
};

const closeDeleteApiKeyDialog = () => {
  isDeleteApiKeyDialogOpen.value = false;
};

// Delete OpenAI API Key
const deleteOpenAIKey = async () => {
  isDeleting.value = true;
  try {
    await persistenceService.saveOpenAIKey("");
    openAIKey.value = "";
    showSnackbar("OpenAI API Key deleted successfully!", "success");
  } catch (error) {
    console.error("Error deleting OpenAI API Key:", error);
    showSnackbar("Error deleting OpenAI API Key.", "error");
  } finally {
    isDeleting.value = false;
  }
};

// Confirm Delete API Key
const confirmDeleteOpenAIKey = async () => {
  await deleteOpenAIKey();
  isDeleteApiKeyDialogOpen.value = false;
};

// Reset Settings Dialog Controls
const openResetDialog = () => {
  isResetDialogOpen.value = true;
};

const closeResetDialogFunc = () => {
  isResetDialogOpen.value = false;
};

// Reset Settings
const confirmResetSettings = async () => {
  try {
    const defaultData = DEFAULT_JSON_CONFIGURATION;
    await persistence.saveAppConfiguration(defaultData);
    await toggleTheme();
    isResetDialogOpen.value = false;
    showSnackbar(
      "Successfully reset all settings to default values.",
      "success",
    );
    window.location.reload();
  } catch (error) {
    console.error("Error resetting settings:", error);
    showSnackbar("Error while resetting settings.", "error");
    isResetDialogOpen.value = false;
  }
};

// Save OpenAI API Key
const saveOpenAIKey = async () => {
  isSaving.value = true;
  try {
    await persistenceService.saveOpenAIKey(openAIKey.value);
    showSnackbar("OpenAI API Key saved successfully!", "success");
  } catch (error) {
    console.error("Error saving OpenAI API Key:", error);
    showSnackbar("Error saving OpenAI API Key.", "error");
  } finally {
    isSaving.value = false;
  }
};

// Load OpenAI API Key on Mount
const loadOpenAIKey = async () => {
  try {
    const key = await persistenceService.loadOpenAIKey();
    if (key) {
      openAIKey.value = key;
    }
  } catch (error) {
    console.error("Error loading OpenAI API Key:", error);
    showSnackbar("Error loading OpenAI API Key.", "error");
  }
};

onMounted(async () => {
  // Retrieve and store the configuration file path
  configPath.value = await persistence.getAppConfigurationPath();
});


watch(locale, async (newLocale) => {
  const appConfiguration = await getPersistence().loadAppConfiguration();
  appConfiguration.preferredLocale = newLocale;
  await getPersistence().saveAppConfiguration(appConfiguration);
});
// Initialize by loading the API key
loadOpenAIKey();
</script>

<style scoped>
.container {
  padding: 16px;
  padding-top: 0px;
}

.setup-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.setup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
</style>
