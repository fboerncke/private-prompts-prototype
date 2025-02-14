<!-- src/views/tabs/ProtectedWorkbenchTab.vue -->
<template>
  <v-container class="container" fluid>
    <!-- Overlay that blocks interactions during AI processing -->
    <v-overlay :value="loading" opacity="0.5">
      <v-progress-circular indeterminate color="blue" size="64" />
    </v-overlay>

    <!-- History of past form field contents -->
    <v-card flat class="history-card">
      <!-- Header Section with Title and Clear History Button -->
      <v-card-title class="history-header"
        :style="{ borderBottom: '1px solid rgba(var(--v-theme-formFieldBackground))' }">
        <h4>{{ $t('protectedWorkbench.headline') }}</h4>
        <!-- Clear History Button with tooltip and loading state -->
        <ActionButton icon="mdi-delete" :tooltip-text="`Clear complete workbench history`" :loading="isClearingHistory"
          variant="flat" size="default" :icon-color="colors.speechBubbleFontColor.value" @click="handleClearHistory" />
      </v-card-title>

      <!-- Scrollable History Entries -->
      <v-card-text class="history-container">
        <div>
          <div v-for="(entry) in processedHistory" :key="entry.id" :class="[
            'history-entry',
            entry.type === 'source' ? 'align-right' : 'align-left',
          ]">
            <!-- Entry Content Container -->
            <div class="entry-content">
              <!-- History entry as a speech-bubble-like frame with badge -->
              <v-badge :color="getBadgeColor(entry, theme.current.value.colors as unknown as BadgeColors)"
                :offset-x="getBadgeXoffset(entry)" location="left top">
                <template #badge>
                  <v-icon>{{ getBadgeIcon(entry) }}</v-icon>&nbsp;&nbsp;
                  <span>{{ getBadgeText(entry) }}</span>
                </template>

                <v-card class="speech-bubble" outlined :class="{
                  source: entry.type === 'source',
                  result: entry.type === 'result',
                }">
                  <v-card-text>
                    <template v-for="(part, idx) in parseContent(entry.content)" :key="idx">
                      <span v-if="part.sensitive" class="highlight" :style="{
                        backgroundColor: colors.highlightBackground.value,
                        color: '#424242',
                      }">
                        {{ part.text }}
                      </span>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </v-card-text>
                </v-card>
              </v-badge>
              <div class="action-buttons">
                <ActionButton icon="mdi-content-copy" :tooltip-text="`Copy this entry to Clipboard`" variant="flat"
                  size="default" :icon-color="colors.speechBubbleFontColor.value"
                  @click="copyTextToClipboard(entry.content)" />
                <ActionButton icon="mdi-file-replace-outline" :tooltip-text="`Copy this entry to input field`"
                  variant="flat" size="default" :icon-color="colors.speechBubbleFontColor.value"
                  @click="copyToFormField(entry.content)" />
                <ActionButton icon="mdi-delete" :tooltip-text="`Delete this entry from history`" variant="flat"
                  size="default" :icon-color="colors.speechBubbleFontColor.value"
                  @click="deleteFromHistory(entry.id)" />
              </div>
            </div>
          </div>
          <!-- Dummy div for scrolling -->
          <div ref="lastEntry" />
        </div>
      </v-card-text>
    </v-card>

    <div class="form-container" :style="{ backgroundColor: colors.formContainerBackground.value }">
      <!-- Form Wrapper with Relative Positioning -->
      <div class="form-wrapper">
        <!-- Form field where the action happens -->
        <v-form ref="formField" class="form-field">
          <v-textarea v-model="formStore.currentPrompt" :label="$t('protectedWorkbench.enter-your-prompt')" rows="4"
            auto-grow counter outlined class="custom-textarea"
            :style="{ backgroundColor: colors.formContainerBackground.value }" max-height="200px" />
        </v-form>

        <!-- Action Buttons Overlay -->
        <div class="form-action-buttons">
          <ActionButton icon="mdi-content-copy" :icon-color="colors.speechBubbleFontColor.value"
            :tooltip-text="`Copy prompt text to Clipboard`" variant="flat" size="default"
            @click="copyPromptToClipboard" />
          <ActionButton icon="mdi-delete" :icon-color="colors.speechBubbleFontColor.value"
            :tooltip-text="`Delete prompt text`" variant="flat" size="default" @click="clearInput" />
        </div>
      </div>

      <!-- Buttons for actions with tooltips and loading states where applicable -->
      <div class="form-action-buttons-group">
        <ActionButton v-if="AiIsDefined" icon="mdi-send" color="blue" :tooltip-text="`Send prompt to AI`"
          :loading="loading" :disabled="loading" variant="elevated" size="default" @click="sendToAi">
          &nbsp;{{ $t('protectedWorkbench.send-to-ai') }}
        </ActionButton>

        <ActionButton icon="mdi-pen" color="#FFC900" :tooltip-text="`Mark sensitive text in prompt`" variant="elevated"
          size="default" :loading="isMarking" @click="markSensitiveData">
          &nbsp;Mark
        </ActionButton>

        <ActionButton icon="mdi-shield-lock" color="green" :tooltip-text="`Mask sensitive data in prompt`"
          variant="elevated" size="default" :loading="isMasking" @click="maskData">
          &nbsp;Mask
        </ActionButton>

        <ActionButton icon="mdi-fingerprint" color="orange" :tooltip-text="`Unmask prompt`" variant="elevated"
          size="default" :loading="isUnmasking" @click="unmaskData">
          &nbsp;Unmask
        </ActionButton>
      </div>
    </div>

    <!-- Snackbar for User Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      <span :style="{ color: 'black' }">{{ snackbar.message }}</span>
      &nbsp;
      <ActionButton icon="mdi-close" :tooltip-text="`Close Snackbar`" variant="text" size="default" color="black"
        @click="() => (snackbar.show = false)">
        {{ $t('protectedWorkbench.snackbar-close') }}
      </ActionButton>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  nextTick,
  onMounted,
  ref,
} from "vue";
import { useTheme } from "vuetify";
import { useHistoryStore } from "../../store/historyStore";
import { storeToRefs } from "pinia";
import ActionButton from "../../components/ActionButton.vue";
import type { HistoryEntry } from "../../interfaces/HistoryEntryInterface";
import { getPlatform } from "../../services/PlatformProvider";
import { isAPIKeyAvailable } from "../../services/AIService";
import { createPromptService } from "../../services/PromptManagerService";
import { useFormStore } from "../../store/formStore";
import { useRulesStore } from "../../store/rulesStore";
import {
  getBadgeIcon,
  getBadgeColor,
  getBadgeText,
  getBadgeXoffset,
} from "../../utils/BadgeUtils";
import type { ComputedRef } from "vue";
import { generateUniqueId } from "../../utils/GenericHelpers";
import { BadgeColors } from "../../interfaces/BadgeColors";
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "ProtectedWorkbenchTab",
  components: {
    ActionButton,
  },
  setup() {
    const { t } = useI18n();
    const historyStore = useHistoryStore();
    const { history } = storeToRefs(historyStore);
    const { saveHistory, addHistoryEntry, clearHistory } =
      historyStore;


    // Initialize services and store
    const theme = useTheme();

    const rulesStore = useRulesStore();
    const { getRules } = rulesStore;
    const rules = getRules();
    const replacementRules = rules || [];
    const promptService = createPromptService(replacementRules); // Use default dependencies
    const formStore = useFormStore();
    const platform = getPlatform();
    // Define color names with a const assertion
    const colorNames = [
      "iconDefaultColor",
      "sourceBadgeColor",
      "maskedBadgeColor",
      "unmaskedBadgeColor",
      "markedBadgeColor",
      "processedBadgeColor",
      "borderColor",
      "formContainerBackground",
      "badgeBackgroundColor",
      "highlightBackground",
      "speechBubbleFontColor",
    ] as const;

    // Define the type for the colors object
    type Colors = {
      [key in (typeof colorNames)[number]]: ComputedRef<string>;
    };

    // Function to get theme colors
    const getThemeColor = (colorName: (typeof colorNames)[number]) =>
      computed(() => theme.current.value.colors[colorName]);

    const colors: Colors = colorNames.reduce((acc: Colors, colorName) => {
      acc[colorName] = getThemeColor(colorName);
      return acc;
    }, {} as Colors);

    const _colors: BadgeColors = theme.current.value.colors as unknown as BadgeColors;

    // Reactive state variables
    const loading = ref(false); // State to track loading for Send to AI button
    const isMasking = ref(false);
    const isUnmasking = ref(false);
    const isMarking = ref(false);
    const isClearingHistory = ref(false); // State to track loading for Clear History button
    const AiIsDefined = ref(false); // Initialize as false

    // Data stores
    // const formData = ref({
    //   history: [] as HistoryEntry[]
    // });

    // References to DOM elements
    const lastEntry = ref<HTMLElement | null>(null);

    // Snackbar state
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

    // Function to show snackbar
    const showSnackbar = (message: string, color: string) => {
      snackbar.value = {
        show: true,
        message,
        color,
        buttonColor: "white", // Customize as needed
      };
    };

    // Computed property for processedHistory
    const processedHistory = computed(() => {
      return history.value;
    });

    // Functions to manage AI key availability
    const getAIKey = async () => {
      try {
        AiIsDefined.value = await isAPIKeyAvailable();
      } catch (error) {
        console.error("Error fetching AI Key:", error);
        AiIsDefined.value = false;
      }
    };

    // Scrolls the dummy div into view (i.e., scrolls to the latest entry)
    const scrollToLatestEntry = () => {
      nextTick(() => {
        if (lastEntry.value) {
          lastEntry.value.scrollIntoView({ behavior: "smooth" });
        } else {
          console.log("lastEntry is not defined");
        }
      });
    };

    // Adds a new entry to the history and scrolls to the latest entry
    const addToHistory = async (
      content: string,
      type: "source" | "result",
      operation: "masked" | "unmasked" | "marked" | "processed" | "clone",
    ) => {
      if (content) {
        const entry: HistoryEntry = {
          id: generateUniqueId(),
          content,
          type,
          operation,
        };
        addHistoryEntry(entry);
        await nextTick(); // Wait for DOM to update
        // console.log("After nextTick, lastEntry:", lastEntry.value);
        scrollToLatestEntry(); // Scroll after adding the new entry
      }
    };

    // Mask sensitive data
    const maskData = async () => {
      if (isMasking.value) return; // Prevent multiple operations
      isMasking.value = true;
      try {
        await addToHistory(formStore.currentPrompt, "source", "clone");
        formStore.currentPrompt = await promptService.maskSensitiveData(
          formStore.currentPrompt,
        );
        await addToHistory(formStore.currentPrompt, "result", "masked"); // Specify 'masked'
        //await saveData();
        //showSnackbar('Sensitive data masked successfully.', 'success');
      } catch (error) {
        console.error("Error masking prompt:", error);
        showSnackbar(t('protectedWorkbench.error-masking-prompt'), "error");
      } finally {
        isMasking.value = false;
      }
    };

    // Unmask data
    const unmaskData = async () => {
      if (isUnmasking.value) return; // Prevent multiple operations
      isUnmasking.value = true;
      try {
        await addToHistory(formStore.currentPrompt, "source", "clone");
        formStore.currentPrompt = await promptService.unmaskPrompt(formStore.currentPrompt);
        await addToHistory(formStore.currentPrompt, "result", "unmasked");
      } catch (error) {
        console.error("Error unmasking prompt:", error);
        showSnackbar(t('protectedWorkbench.snackbar-error-unmasking-prompt'), "error");
      } finally {
        isUnmasking.value = false;
      }
    };

    // Mark sensitive data
    const markSensitiveData = async () => {
      if (isMarking.value) return; // Prevent multiple operations
      isMarking.value = true;
      try {
        await addToHistory(formStore.currentPrompt, "source", "clone");
        const markedPrompt = await promptService.markSensitiveData(formStore.currentPrompt,
        );
        await addToHistory(markedPrompt, "result", "marked");
      } catch (error) {
        console.error("Error marking prompt:", error);
        showSnackbar(t('protectedWorkbench.snackbar-error-marking-data'), "error");
      } finally {
        isMarking.value = false;
      }
    };

    // Send prompt to AI
    const sendToAi = async () => {
      if (loading.value) return; // Prevent multiple submissions
      loading.value = true; // Start loading animation

      try {
        // log source prompt
        await addToHistory(formStore.currentPrompt, "source", "clone");

        // mask prompt
        formStore.currentPrompt = await promptService.maskSensitiveData(formStore.currentPrompt)
        await addToHistory(formStore.currentPrompt, "result", "masked");

        // send masked prompt to AI
        formStore.currentPrompt = await promptService.sendToAI(formStore.currentPrompt);
        await addToHistory(formStore.currentPrompt, "result", "processed");

        // unmask result
        formStore.currentPrompt = await promptService.unmaskPrompt(formStore.currentPrompt);
        await addToHistory(formStore.currentPrompt, "result", "unmasked");

      } catch (error) {
        await addToHistory(
          t('protectedWorkbench.error-processing-prompt-with-ai'),
          "result",
          "processed",
        );
        console.error("Error processing prompt with AI:", error);
        showSnackbar(t('protectedWorkbench.error-processing-prompt-with-ai'), "error");
      } finally {
        loading.value = false; // Stop loading animation
      }
    };

    // Clear input field
    const clearInput = () => {
      formStore.currentPrompt = "";
      //saveData();
      // showSnackbar('Prompt input cleared.', 'info');
    };

    const handleClearHistory = async () => {
      if (isClearingHistory.value) return;
      isClearingHistory.value = true;
      try {
        await clearHistory(); // Store's action
        showSnackbar(t('protectedWorkbench.snackbar-history-cleared-successfully'), "success");
      } catch (error) {
        console.error("Error clearing history:", error);
        showSnackbar(t('protectedWorkbench.snackbar-error-clearing-history'), "error");
      } finally {
        isClearingHistory.value = false;
      }
    };

    // Copy text to clipboard
    const copyTextToClipboard = (entry: string) => {
      try {
        platform.copyToClipboard(promptService.removeSensitiveMarkers(entry));
        // showSnackbar('Text copied to clipboard.', 'success');
      } catch (error) {
        console.error("Failed to copy to clipboard: ", error);
        //showSnackbar("Failed to copy text.", "error");
      }
    };

    // Copy prompt to clipboard
    const copyPromptToClipboard = () => {
      if (formStore.currentPrompt) {
        try {
          platform.copyToClipboard(
            promptService.removeSensitiveMarkers(formStore.currentPrompt),
          );
          // showSnackbar('Prompt copied to clipboard.', 'success');
        } catch (error) {
          console.error("Failed to copy prompt to clipboard: ", error);
          // showSnackbar("Failed to copy prompt.", "error");
        }
      } else {
        showSnackbar(t('protectedWorkbench.snackbar-no-prompt-to-copy'), "warning");
      }
    };

    // Copy content to form field
    const copyToFormField = (entry: string) => {
      formStore.currentPrompt = promptService.removeSensitiveMarkers(entry);
      // showSnackbar("Prompt copied to input field.", "success");
    };

    // Delete an entry from history
    const deleteFromHistory = (id: number) => {
      const index = history.value.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        history.value.splice(index, 1);
        showSnackbar(t('protectedWorkbench.snackbar-history-entry-deleted'), "info");
        saveHistory();
      }
    };

    // Parse content for display with highlights
    const parseContent = (content: string) => {
      return promptService.parseContent(content);
    };

    onMounted(async () => {
      await getAIKey();
    });

    return {
      history,
      loading,
      colors,
      processedHistory,
      isClearingHistory,
      getBadgeColor,
      getBadgeIcon,
      getBadgeXoffset,
      getBadgeText,
      parseContent,
      copyTextToClipboard,
      copyToFormField,
      deleteFromHistory,
      formStore,
      copyPromptToClipboard,
      clearInput,
      maskData,
      isMasking,
      unmaskData,
      isUnmasking,
      markSensitiveData,
      isMarking,
      AiIsDefined,
      sendToAi,
      snackbar,
      theme,
      handleClearHistory,
      addHistoryEntry,
      lastEntry,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 85vh;
  padding: 16px;
  padding-top: 0px;
  overflow: hidden;
}

.history-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.history-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: calc(100vh - 100px);
}

.form-container {
  width: 100%;
  position: sticky;
  bottom: 0;
  padding-top: 1px;
}

.history-entry {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease;
}

.align-right {
  align-items: flex-end;
}

.align-left {
  align-items: flex-start;
}

.speech-bubble {
  border-radius: 10px;
  box-shadow: none;
  padding: 5px;
  background-color: rgba(var(--v-theme-speechBubbleBackground, 255, 255, 255, 1));
  color: rgba(var(--v-theme-speechBubbleFontColor, 0, 0, 0, 1));
  text-align: left;
  max-width: 100%;
  min-width: 35vw;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.speech-bubble span {
  font-size: 0.9rem;
}

.speech-bubble.source {
  padding-left: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.speech-bubble.result {
  padding-left: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

:deep(.v-badge__badge) {
  border-radius: 5px !important;
}

.action-buttons {
  align-self: flex-start;
  margin-top: 0px;
  visibility: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
}

.history-entry:hover .action-buttons {
  visibility: visible;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.v-card-title {
  padding: 16px;
}

.form-wrapper {
  position: relative;
  width: 100%;
}

.form-field {
  max-height: calc(1.5em * 10 + 20px);
  overflow-y: auto;
  width: 100%;
  padding-top: 20px;
}

.form-action-buttons {
  position: absolute;
  left: 10px;
  bottom: -20px;
  display: flex;
  gap: 0px;
}

.highlight {
  font-weight: normal;
  padding-left: 2px;
  padding-right: 2px;
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-color, #c1c1c1) var(--scrollbar-track-color, #f1f1f1);
}

.form-action-buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: -10px;
  justify-content: center;
}

.custom-textarea :deep(.v-input__control) {
  border-radius: 10px !important;
  overflow: hidden;
}

.history-entry>.entry-content>.v-badge {
  display: block;
}

@media (max-width: 600px) {
  .form-action-buttons-group {
    flex-direction: column;
    align-items: center;
  }
}
</style>
