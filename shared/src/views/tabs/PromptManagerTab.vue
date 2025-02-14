<!-- src/views/tabs/PromptManagerTab.vue -->

<template>
  <v-container class="container" fluid>
    <v-card flat class="prompt-manager-card">
      <v-card-title class="prompt-manager-header"
        :style="{ borderBottom: '1px solid rgba(var(--v-theme-formFieldBackground))' }">
        <div style="flex: 1; text-align: left;">
          <h4>{{ $t('promptManager.prompt-manager') }}</h4>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
          <ImportPromptSetButton label="" color="" />
          <ExportPromptSetButton label="" color="" />

          <div>
            <v-badge v-if="filteredPrompts.length < prompts.length" :content="filteredPrompts.length" color="error"
              overlap>
              <!-- Make sure the ActionButton is in the default slot -->
              <template #default>
                <ActionButton icon="mdi-filter-outline" :tooltip-text="$t('promptManager.filter-prompts-tooltip')"
                  variant="flat" size="default" @click="toggleSearch" />
              </template>
            </v-badge>

            <ActionButton v-else icon="mdi-filter-outline" :tooltip-text="$t('promptManager.filter-prompts-tooltip')"
              variant="flat" size="default" @click="toggleSearch" />
          </div>
          &nbsp;

          <v-badge :content="prompts.length" color="primary" overlap>
            <ActionButton icon="mdi-plus"
              :tooltip-text="$t('promptManager.add-prompt-tooltip-prefix') + ' ' + prompts.length + ' ' + $t('promptManager.add-prompt-tooltip-suffix')"
              variant="flat" size="default" @click="addNewPrompt" />
          </v-badge>
          &nbsp;
          &nbsp;
          &nbsp;
        </div>
      </v-card-title>

      <v-card-text>
        <div v-if="showSearch" class="search-area">
          <div style="display:flex;align-items: start;gap:10px;">
            <v-text-field v-model="searchQuery" :label="$t('promptManager.filter-prompts-definitions-by-text')"
              :hint="$t('promptManager.filter-prompts-hint')" clearable clear-icon="mdi-backspace"
              @input="filterPrompts" @click:clear="clearSearch()" />
            <ActionButton :icon="showPinnedOnly ? 'mdi-pin' : 'mdi-pin-outline'"
              style="margin-top: 5px;padding-bottom: 0px;"
              :tooltip-text="$t('promptManager.filter-pinned-prompts-only')" color="transparent" variant="flat"
              size="large" @click="toggleFilterPinnedPrompts()" />
            <ActionButton icon="mdi-restart" style="margin-top: 5px;padding-bottom: 0px;"
              :tooltip-text="$t('promptManager.reset-all-filter-settings')" color="transparent" variant="flat"
              size="large" @click="resetSearch()" />
          </div>

          <div style="display: flex; gap: 0px; flex-wrap: wrap;">
            <v-chip-group v-model="selectedTags" multiple column filter variant="flat" color="green">
              <div style="margin-right: 8px; align-self: center;font-weight: bold;">{{ $t('promptManager.tags') }}</div>
              <v-chip v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
            <v-chip-group v-model="selectedPlatforms" multiple column filter variant="flat" color="blue">
              <div style="margin-right: 8px; align-self: center;font-weight: bold;">
                {{ $t('promptManager.platforms') }}
              </div>
              <v-chip v-for="platform in availablePlatforms" :key="platform" :value="platform">
                {{ platform }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <br>
    <!-- Draggable List of Prompts -->
    <v-row>
      <draggable :animation="200" :list="prompts" item-key="id" :use-transition-group="false" handle=".drag-handle">
        <template #item="{ element: prompt }">
          <div :ref="(el) => (lazyHydrateRefs[prompt.id] = el as HTMLElement)" class="draggable-item-root"
            :data-id="prompt.id" :style="{ display: passesFilter(prompt) ? 'block' : 'none' }">
            <v-skeleton-loader v-if="!isHydrated[prompt.id]" boilerplate class="custom-placeholder">
              <div class="rounded-rectangle" />
            </v-skeleton-loader>

            <PromptItem v-else :prompt="prompt" :character-threshold="characterThreshold"
              @open-prompt-dialog="openPromptDialog" @duplicate-prompt="duplicatePrompt" @delete-prompt="deletePrompt"
              @copy-to-clipboard="copyToClipboard" @copy-to-protected-workbench="copyToProtectedWorkbench"
              @toggle-prompt-favorite-status="togglePromptFavoriteStatus" @open-rename-tag-dialog="openRenameTagDialog"
              @delete-tag-from-prompt="deleteTagFromPrompt" @open-add-tag-dialog="openAddTagDialog"
              @open-rename-platform-dialog="openRenamePlatformDialog"
              @delete-platform-from-prompt="deletePlatformFromPrompt"
              @open-add-platform-dialog="openAddPlatformDialog" />
          </div>
        </template>
      </draggable>
    </v-row>
    <!-- New Prompt Dialog -->
    <v-dialog v-model="isPromptDialogOpen" max-width="80vw" persistent @keydown.esc.prevent="attemptCloseDialog"
      @click:outside.prevent="attemptCloseDialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('promptManager.edit-prompt') }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form>
            <!-- Description -->
            <v-text-field v-model="formPrompt.description" :label="$t('promptManager.edit-prompt-short-description')"
              class="mb-3" outlined />

            <!-- Prompt -->
            <v-textarea v-model="formPrompt.prompt" :label="$t('promptManager.edit-prompt-prompt-text')" class="mb-3"
              outlined autofocus counter />

            <!-- Comment -->
            <v-textarea v-model="formPrompt.comment" :label="$t('promptManager.edit-prompt-comment-long-description')"
              class="mb-3" outlined counter />

            <!-- Tags Multi-select -->
            <v-select v-model="formPrompt.tags" :items="allTags" :label="$t('promptManager.edit-prompt-tags')"
              class="mb-0" multiple outlined />

            <!-- Platforms Multi-select -->
            <v-select v-model="formPrompt.platforms" :items="allPlatforms"
              :label="$t('promptManager.edit-prompt-platforms')" multiple class="mb-3" outlined />


            <v-container class="d-flex flex-row pl-0 pr-0 pb-0">
              <!-- Read-only Creation Date Field -->
              <v-text-field :value="formatDate(formPrompt.createdAt)"
                :label="$t('promptManager.edit-prompt-creation-date')" class="mb-0" readonly outlined
                persistent-placeholder />

              <div style="width: 12px;" />

              <!-- Read-only Last Modified Date Field -->
              <v-text-field :value="formatDate(formPrompt.updatedAt)"
                :label="$t('promptManager.edit-prompt-last-modified-date')" class="mb-0" readonly outlined
                persistent-placeholder />
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn color="green" variant="text" @click="savePrompt(formPrompt)">
            {{
              $t('promptManager.edit-prompt-save')
            }}
          </v-btn>
          <v-btn color="grey" variant="text" @click="attemptCloseDialog">
            {{
              $t('promptManager.edit-prompt-cancel')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation Dialog -->
    <ConfirmationDialog v-model="isConfirmDialogOpen" :title="$t('promptManager.edit-prompt-discard-changes')"
      :message="$t('promptManager.edit-prompt-unsaved-changes')" @confirm="discardChanges" @cancel="cancelDiscard" />

    <!-- Other Existing Dialogs -->
    <!-- Add Platform Dialog -->
    <v-dialog v-model="isAddPlatformDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('promptManager.add-new-platform-name') }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveNewPlatform">
            <v-text-field v-model="newPlatformText" :label="$t('promptManager.add-new-platform-platform')" outlined
              autofocus />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="saveNewPlatform">
            {{ $t('promptManager.add-new-platform-save')
            }}
          </v-btn>
          <v-btn variant="text" @click="cancelNewPlatform">{{ $t('promptManager.add-new-platform-cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Tag Dialog -->
    <v-dialog v-model="isAddTagDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('promptManager.add-new-tag-name') }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveNewTag">
            <v-text-field v-model="newTagText" :label="$t('promptManager.add-new-tag-platform')" outlined autofocus />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="saveNewTag">
            {{ $t('promptManager.add-new-tag-save') }}
          </v-btn>
          <v-btn variant="text" @click="cancelNewTag">
            {{ $t('promptManager.add-new-tag-cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rename Tag Dialog -->
    <v-dialog v-model="isRenameTagDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('promptManager.rename-tag') }}</v-card-title>
        <v-card-text>
          <v-text-field :label="$t('promptManager.rename-tag-current-tag-name')" :value="tagToRename" readonly outlined
            persistent-placeholder />
          <v-text-field v-model="newTagName" :label="$t('promptManager.rename-tag-new-tag-name')" outlined />
          <p>
            {{ $t('promptManager.rename-tag-explanation') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="confirmRenameTag">
            {{
              $t('promptManager.rename-tag-rename')
            }}
          </v-btn>
          <v-btn variant="text" @click="cancelRenameTag">{{ $t('promptManager.rename-tag-cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rename Platform Dialog -->
    <v-dialog v-model="isRenamePlatformDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('promptManager.rename-platform') }}</v-card-title>
        <v-card-text>
          <v-text-field :label="$t('promptManager.rename-platform-current-platform-name')" :value="platformToRename"
            readonly outlined persistent-placeholder />
          <v-text-field v-model="newPlatformName" :label="$t('promptManager.rename-platform-new-platform-name')"
            outlined />
          <p>
            {{ $t('promptManager.rename-platform-explanation') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="confirmRenamePlatform">
            {{
              $t('promptManager.rename-platform-rename')
            }}
          </v-btn>
          <v-btn variant="text" @click="cancelRenamePlatform">
            {{
              $t('promptManager.rename-platform-cancel')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- "Back to top" Button -->
    <v-btn v-show="showScrollToTop" fab fixed bottom right color="primary" class="back-to-top" :transition="'fade'"
      :elevation="4" @click="scrollToTop">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar" :color="'rgba(var(--v-theme-info), 1)'" top right timeout="3000">
      {{ snackbarMessage }}
      <v-btn :color="'rgba(var(--v-theme-snackbarButtonColor), 1)'" variant="text" @click="snackbar = false">
        {{ $t('promptManager.snackbar-close') }}
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { nextTick, defineComponent, ref, defineAsyncComponent, watch, onBeforeUnmount, onMounted } from "vue";
import draggable from "vuedraggable";
import { VBtn, VIcon } from "vuetify/components";
import { usePromptStore } from "../../store/promptStore";
import { useFormStore } from "../../store/formStore";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { de, enGB } from "date-fns/locale"; // German locale
const ConfirmationDialog = defineAsyncComponent(() => import('../../components/ConfirmationDialog.vue'));
const PromptItem = defineAsyncComponent(() => import('../../components/PromptItem.vue'));
const ActionButton = defineAsyncComponent(() => import('../../components/ActionButton.vue'));

import { storeToRefs } from "pinia";
import { generateUniqueId } from "../../utils/GenericHelpers";
import type { Prompt } from "../../interfaces/PromptInterface";
import isEqual from 'lodash/isEqual';
import ExportPromptSetButton from "../../components/importExport/ExportPromptSetButton.vue";
import ImportPromptSetButton from "../../components/importExport/ImportPromptSetButton.vue";
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: "PromptManagerTab",
  components: {
    draggable,
    ActionButton,
    ConfirmationDialog,
    PromptItem,
    VBtn,
    VIcon,
    ExportPromptSetButton,
    ImportPromptSetButton,
  },
  setup() {
    const { t } = useI18n();
    const promptStore = usePromptStore();
    const { prompts, allTags, allPlatforms } = storeToRefs(promptStore);

    const { savePrompts, updateAllTags, updateAllPlatforms } =
      promptStore;

    const router = useRouter();
    const formStore = useFormStore();

    const isPromptDialogOpen = ref(false); // Dialog state

    // Thresholds
    const characterThreshold = 400;

    // Dialog states for adding tags and platforms
    const isAddPlatformDialogOpen = ref(false);
    const isAddTagDialogOpen = ref(false);
    const newPlatformText = ref("");
    const newTagText = ref("");
    const currentPromptForPlatform = ref<Prompt | null>(null);
    const currentPromptForTag = ref<Prompt | null>(null);

    const showPinnedOnly = ref(false);

    // Dialog states for renaming tags and platforms
    const isRenameTagDialogOpen = ref(false);
    const isRenamePlatformDialogOpen = ref(false);

    // Variables for the current tag/platform being renamed and the new name
    const tagToRename = ref("");
    const newTagName = ref("");
    const platformToRename = ref("");
    const newPlatformName = ref("");

    // Snackbar state variables
    const snackbar = ref(false);
    const snackbarMessage = ref("");

    // Confirmation Dialog state
    const isConfirmDialogOpen = ref(false);

    // Define a default empty Prompt object
    const defaultEmptyPrompt: Prompt = {
      id: generateUniqueId(),
      description: "",
      prompt: "",
      comment: "",
      platforms: [],
      tags: [],
      isFavorite: false,
      createdAt: "",
      updatedAt: "",
    };

    // To track the original prompt data for unsaved changes
    const originalPrompt = ref<Prompt>(defaultEmptyPrompt);
    const hasUnsavedChanges = ref(false);


    const formPrompt = ref<Prompt>({ ...defaultEmptyPrompt });

    // Function to show snackbar
    const showSnackbar = (message: string, _color: string = "info") => {
      snackbarMessage.value = message;
      snackbar.value = true;
    };

    // Reactive variable to control the visibility of the button
    const showScrollToTop = ref(false);

    // Method to scroll to the top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Scroll event handler
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      showScrollToTop.value = scrollTop > 300; // Button appears after  300px scrolling
    };

    // Function to open the New Prompt dialog
    const addNewPrompt = () => {
      // prepare new prompt
      formPrompt.value = {
        ...defaultEmptyPrompt,
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      originalPrompt.value = { ...formPrompt.value }; // keep original state
      isPromptDialogOpen.value = true; // open dialog
    };


    // Watch for changes in currentPrompt to set hasUnsavedChanges
    watch(
      () => formPrompt.value,
      (newVal) => {
        hasUnsavedChanges.value = !isEqual(newVal, originalPrompt.value);
      },
      { deep: true },
    );

    // Watch for changes in prompts and auto-save
    watch(
      prompts,
      async () => {
        await savePrompts();
      },
      { deep: true },
    );

    watch(
      prompts,
      (newPrompts, oldPrompts) => {
        // find added prompt
        // const newPromptIds = newPrompts.map(p => p.id);
        const oldPromptIds = oldPrompts.map(p => p.id);
        const addedPrompts = newPrompts.filter(p => !oldPromptIds.includes(p.id));

        // for each added prompt
        addedPrompts.forEach(prompt => {
          isHydrated.value[prompt.id] = false;
        });

        // Delay observation to ensure the DOM has been updated
        nextTick(() => {
          addedPrompts.forEach(prompt => {
            const el = lazyHydrateRefs.value[prompt.id];
            if (el) {
              observer?.observe(el);
            }
          });
        });
      },
      { deep: true }
    );

    // Save current prompt
    const savePrompt = (prompt: Prompt) => {
      if (!prompt.description.trim() && !prompt.prompt.trim()) {
        showSnackbar(t('promptManager.snackbar-missing-information'), "error");
        return;
      }

      const now = new Date().toISOString();

      if (prompt.id) {
        const index = prompts.value.findIndex((p) => p.id === prompt.id);
        if (index !== -1) {
          prompt.updatedAt = now;
          prompts.value[index] = { ...prompt };
        } else {
          prompts.value.unshift({ ...prompt });
        }
      } else {
        prompt.id = generateUniqueId();
        prompt.createdAt = now;
        prompt.updatedAt = now;
        prompts.value.unshift({ ...prompt });
      }

      // Initialize the hydration status of the new prompt
      isHydrated.value[prompt.id] = false;

      // Delay observation to ensure the DOM element exists
      setTimeout(() => {
        const el = lazyHydrateRefs.value[prompt.id];
        if (el) {
          // console.log(`Observing element for ID: ${prompt.id}`); // Debug
          observer?.observe(el);
        } else {
          console.error(`Element not found for ID: ${prompt.id}`); // Debug
        }
      }, 0);

      isPromptDialogOpen.value = false;
      hasUnsavedChanges.value = false;
      savePrompts();

      showSnackbar(t('promptManager.edit-prompt-save-success'), "success");
    };

    // Function to attempt closing the dialog
    const attemptCloseDialog = () => {
      if (hasUnsavedChanges.value) {
        // Show confirmation dialog for unsaved changes
        isConfirmDialogOpen.value = true;
      } else {
        // Close the dialog and reset the formPrompt
        isPromptDialogOpen.value = false;
        formPrompt.value = { ...defaultEmptyPrompt };
      }
    };

    const discardChanges = () => {
      isConfirmDialogOpen.value = false;
      isPromptDialogOpen.value = false;
      hasUnsavedChanges.value = false;
      formPrompt.value = { ...defaultEmptyPrompt }; // Zurücksetzen
    };

    // User cancels the discard action
    const cancelDiscard = () => {
      isConfirmDialogOpen.value = false;
      // Keep the dialog open
    };

    // Delete prompt
    const deletePrompt = (id: number) => {
      const index = prompts.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        prompts.value.splice(index, 1);
        savePrompts();
        showSnackbar(t('promptManager.snackbar-deleted-success'), "success");
      }
    };

    const duplicatePrompt = (prompt: Prompt) => {
      const newPrompt = JSON.parse(JSON.stringify(prompt));
      newPrompt.id = Date.now() + Math.random();
      newPrompt.description += " (Copy)";
      const now = new Date().toISOString();
      newPrompt.createdAt = now;
      newPrompt.updatedAt = now;
      const index = prompts.value.findIndex((p) => p.id === prompt.id);
      if (index !== -1) {
        prompts.value.splice(index + 1, 0, newPrompt);
      } else {
        prompts.value.push(newPrompt);
      }

      isHydrated.value[newPrompt.id] = false;

      // intentional delay
      setTimeout(() => {
        const el = lazyHydrateRefs.value[newPrompt.id];
        if (el) {
          observer?.observe(el); // Beobachte das neue Element
        }
      });
      savePrompts();
      // showSnackbar("Prompt duplicated successfully!", "success");
    };

    // Toggle favorite status
    const togglePromptFavoriteStatus = (prompt: Prompt) => {
      prompt.isFavorite = !prompt.isFavorite;
      prompt.updatedAt = new Date().toISOString();
      const promptIndex = prompts.value.findIndex((p) => p.id === prompt.id);
      if (promptIndex !== -1) {
        prompts.value.splice(promptIndex, 1, { ...prompt });
      }
      savePrompts();
      // showSnackbar(`Prompt ${prompt.isFavorite ? "added to" : "removed from"} favorite list`,"info", );
    };

    // Open prompt dialog for editing
    const openPromptDialog = (prompt: Prompt) => {
      formPrompt.value = { ...prompt };
      originalPrompt.value = { ...prompt }; // Store original state
      isPromptDialogOpen.value = true;
    };

    // Format date for display
    const formatDate = (isoString: string) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      //return format(date, "yyyy-MM-dd HH:mm:ss (EEEE)", { locale: de });
      const localeString = t('promptManager.edit-prompt-date-format-locale');
      const locale = localeString === 'de' ? de : enGB; // Add more locale mappings as needed
      return format(date, t('promptManager.edit-prompt-date-format'), { locale });
    };

    // Copy text to clipboard
    const copyToClipboard = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // showSnackbar("Text copied to clipboard!", "success");
        })
        .catch((err) => {
          console.error("Could not copy text to clipboard: ", err);
          //showSnackbar("Failed to copy text.", "error");
        });
    };

    // Copy to ProtectedWorkbench.vue and navigate
    const copyToProtectedWorkbench = (promptText: string) => {
      formStore.currentPrompt = promptText;
      router.push({ name: "privatize" });
      // showSnackbar("Prompt copied to Privatize tab!", "info");
    };

    // Delete tag from prompt
    const deleteTagFromPrompt = (prompt: Prompt, tag: string) => {
      const index = prompt.tags.indexOf(tag);
      if (index !== -1) {
        prompt.tags.splice(index, 1);
        savePrompts();
        //showSnackbar("Tag deleted successfully!", "success");
      }
    };

    // Delete platform from prompt
    const deletePlatformFromPrompt = (prompt: Prompt, platform: string) => {
      const index = prompt.platforms.indexOf(platform);
      if (index !== -1) {
        prompt.platforms.splice(index, 1);
        savePrompts();
        //showSnackbar("Platform deleted successfully!", "success");
      }
    };

    // Open add tag dialog
    const openAddTagDialog = (prompt: Prompt) => {
      currentPromptForTag.value = prompt;
      newTagText.value = "";
      isAddTagDialogOpen.value = true;
    };

    const saveNewTag = () => {
      const prompt = currentPromptForTag.value;
      const newTag = newTagText.value.trim();

      if (prompt && newTag) {
        if (!prompt.tags.includes(newTag)) {
          prompt.tags.push(newTag);
          updateAllTags();
          savePrompts();
          // showSnackbar("New tag added successfully!", "success");
        } else {
          showSnackbar(t('promptManager.snackbar-tag-already-exists'), "error");
        }
      } else {
        showSnackbar(t('promptManager.snackbar-tag-must-not-be-empty'), "error");
      }
      isAddTagDialogOpen.value = false;
      newTagText.value = "";
      currentPromptForTag.value = null;
    };

    const cancelNewTag = () => {
      isAddTagDialogOpen.value = false;
      newTagText.value = "";
      currentPromptForTag.value = null;
    };

    // Open add platform dialog
    const openAddPlatformDialog = (prompt: Prompt) => {
      currentPromptForPlatform.value = prompt;
      newPlatformText.value = "";
      isAddPlatformDialogOpen.value = true;
    };

    const saveNewPlatform = () => {
      const prompt = currentPromptForPlatform.value;
      const newPlatform = newPlatformText.value.trim();

      if (prompt && prompt.platforms && newPlatform) {
        if (!prompt.platforms.includes(newPlatform)) {
          prompt.platforms.push(newPlatform);
          updateAllPlatforms();
          savePrompts();
          // showSnackbar("New platform added successfully!", "success");
        } else {
          showSnackbar(t('promptManager.snackbar-platform-already-exists'), "error");
        }
      }
      else {
        showSnackbar(t('promptManager.snackbar-platform-must-not-be-empty'), "error");
      }
      isAddPlatformDialogOpen.value = false;
      newPlatformText.value = "";
      currentPromptForPlatform.value = null;
    };

    const cancelNewPlatform = () => {
      isAddPlatformDialogOpen.value = false;
      newPlatformText.value = "";
      currentPromptForPlatform.value = null;
    };

    // Open rename tag dialog
    const openRenameTagDialog = (tag: string) => {
      tagToRename.value = tag;
      newTagName.value = tag; // Pre-fill current name
      isRenameTagDialogOpen.value = true;
    };

    // Confirm tag rename
    const confirmRenameTag = () => {
      const oldTag = tagToRename.value;
      const newTag = newTagName.value.trim();

      // Validation: Check for empty input
      if (!newTag) {
        showSnackbar(t('promptManager.snackbar-tag-must-not-be-empty'), "error");
        return;
      }

      // Check for duplicate tag
      if (allTags.value.includes(newTag) && newTag !== oldTag) {
        showSnackbar(t('promptManager.snackbar-tag-already-exists'), "error");
        return;
      }

      // Update tags in all prompts
      prompts.value.forEach((prompt) => {
        const index = prompt.tags.indexOf(oldTag);
        if (index !== -1) {
          prompt.tags.splice(index, 1, newTag);
        }
      });

      // Update allTags
      updateAllTags();

      // Close dialog
      isRenameTagDialogOpen.value = false;

      // Save changes
      savePrompts();

      // Provide feedback
      // showSnackbar(`Tag "${oldTag}" has been renamed to "${newTag}".`,"success",);
    };

    const cancelRenameTag = () => {
      isRenameTagDialogOpen.value = false;
      tagToRename.value = "";
      newTagName.value = "";
    };

    // Open rename platform dialog
    const openRenamePlatformDialog = (platform: string) => {
      platformToRename.value = platform;
      newPlatformName.value = platform; // Pre-fill current name
      isRenamePlatformDialogOpen.value = true;
    };

    // Confirm platform rename
    const confirmRenamePlatform = () => {
      const oldPlatform = platformToRename.value;
      const newPlatform = newPlatformName.value.trim();

      // Validation: Check for empty input
      if (!newPlatform) {
        showSnackbar(t('promptManager.snackbar-platform-must-not-be-empty'), "error");
        return;
      }

      // Check for duplicate platform
      if (
        allPlatforms.value.includes(newPlatform) &&
        newPlatform !== oldPlatform
      ) {
        showSnackbar(t('promptManager.snackbar-platform-already-exists'), "error");
        return;
      }

      // Update platforms in all prompts
      prompts.value.forEach((prompt) => {
        const index = prompt.platforms.indexOf(oldPlatform);
        if (index !== -1) {
          prompt.platforms.splice(index, 1, newPlatform);
        }
      });

      // Update allPlatforms
      updateAllPlatforms();

      // Close dialog
      isRenamePlatformDialogOpen.value = false;

      // Save changes
      savePrompts();

      // Provide feedback
      //showSnackbar(`Platform "${oldPlatform}" has been renamed to "${newPlatform}".`,"success",);
    };

    const cancelRenamePlatform = () => {
      isRenamePlatformDialogOpen.value = false;
      platformToRename.value = "";
      newPlatformName.value = "";
    };

    // Hydration Tracking
    const isHydrated = ref<Record<number, boolean>>({});

    const lazyHydrateRefs = ref<Record<number, HTMLElement | null>>({}); // Track each prompt by ID

    let observer: IntersectionObserver | null = null;
    // Mark item as hydrated
    const hydrateItem = (id: number) => {
      //console.log(`Hydrating item with ID: ${id}`); // Debug
      isHydrated.value[id] = true;
      if (lazyHydrateRefs.value[id]) {
        observer?.unobserve(lazyHydrateRefs.value[id] as HTMLElement);
      }
    };

    // Setup observer to watch prompt items
    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = Number(entry.target.getAttribute("data-id"));
              hydrateItem(id);
            }
          });
        },
        { rootMargin: "200px", threshold: 0.1 } // Increased rootMargin and added threshold
      );

      Object.entries(lazyHydrateRefs.value).forEach(([_id, el]) => {
        if (el) observer?.observe(el);
      });
    };

    const showSearch = ref(false);

    function toggleSearch() {
      showSearch.value = !showSearch.value;
    }
    const searchQuery = ref('');
    const selectedTags = ref<string[]>([]);
    const selectedPlatforms = ref<string[]>([]);

    // If you want to gather all available tags from your store:
    const availableTags = computed(() => allTags.value || []);
    const availablePlatforms = computed(() => allPlatforms.value || []);
    // A no-op or custom logic method called by @input="filterPrompts"
    function filterPrompts() {
      // If you filter your prompts in a computed property,
      // you can leave this empty or add your custom logic here.
    }

    // Clears the search text + tags
    function clearSearch() {
      searchQuery.value = '';
    }

    function resetSearch() {
      searchQuery.value = '';
      selectedTags.value = [];
      selectedPlatforms.value = [];
    }

    const filteredPrompts = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      const chosenTags = selectedTags.value;
      const chosenPlatforms = selectedPlatforms.value;

      // Base filtering logic
      let results: Prompt[];
      if (!query && !chosenTags.length && !chosenPlatforms.length) {
        results = prompts.value;
      } else {
        results = prompts.value.filter(prompt => matchesFilter(prompt));
      }

      // Apply pinned-only filter if enabled
      if (showPinnedOnly.value) {
        results = results.filter(prompt => prompt.isFavorite);
      }
      return results;
    });

    const passesFilter = (prompt: Prompt): boolean => {
      // First check against the general filter
      const basePass = matchesFilter(prompt);
      // If pinned-only filter is enabled, ensure the prompt is favorite as well
      return basePass && (!showPinnedOnly.value || prompt.isFavorite);
    };

    function matchesFilter(prompt: Prompt): boolean {
      const query = searchQuery.value.trim().toLowerCase();
      const chosenTags = selectedTags.value;
      const chosenPlatforms = selectedPlatforms.value;

      const matchesText: boolean = Boolean(
        !query ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.prompt.toLowerCase().includes(query) ||
        (prompt.comment && prompt.comment.toLowerCase().includes(query))
      );

      const matchesTags = !chosenTags.length || chosenTags.every(t => prompt.tags.includes(t));

      const matchesPlatforms = !chosenPlatforms.length || chosenPlatforms.every(pf => prompt.platforms.includes(pf));

      return matchesText && matchesTags && matchesPlatforms;
    }

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);

      setTimeout(() => {
        setupObserver();

        // Immediately hydrate elements that are already in view
        Object.entries(lazyHydrateRefs.value).forEach(([id, el]) => {
          if (el) {
            const rect = el.getBoundingClientRect();
            const inView =
              rect.top < (window.innerHeight || document.documentElement.clientHeight) + 200 &&
              rect.bottom > -200;
            if (inView) {
              hydrateItem(Number(id));
              // console.log(`Immediately hydrated element with ID: ${id} as it is in view`);
            } else {
              observer?.observe(el);
              // console.log(`Element with ID: ${id} is not in view and is being observed`);
            }
          }
        });

      },
        // Delay to allow initial rendering. If I set this to 0 I experience display problems 
        100);
    });

    function toggleFilterPinnedPrompts() {
      showPinnedOnly.value = !showPinnedOnly.value;
    }
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    })

    onBeforeUnmount(() => {
      if (observer) observer.disconnect();
    });


    return {
      showScrollToTop,
      scrollToTop,
      prompts,
      isHydrated,
      lazyHydrateRefs,
      isPromptDialogOpen,
      allPlatforms,
      allTags,
      formPrompt,
      deleteTagFromPrompt,
      deletePlatformFromPrompt,
      addNewPrompt,
      savePrompt,
      deletePrompt,
      duplicatePrompt,
      openPromptDialog,
      attemptCloseDialog,
      discardChanges,
      cancelDiscard,
      togglePromptFavoriteStatus,
      formatDate,
      copyToClipboard,
      copyToProtectedWorkbench,
      characterThreshold,
      isAddPlatformDialogOpen,
      isAddTagDialogOpen,
      newPlatformText,
      newTagText,
      currentPromptForPlatform,
      currentPromptForTag,
      openAddTagDialog,
      saveNewTag,
      cancelNewTag,
      openAddPlatformDialog,
      saveNewPlatform,
      cancelNewPlatform,
      isRenameTagDialogOpen,
      isRenamePlatformDialogOpen,
      tagToRename,
      newTagName,
      platformToRename,
      newPlatformName,
      openRenameTagDialog,
      confirmRenameTag,
      cancelRenameTag,
      openRenamePlatformDialog,
      confirmRenamePlatform,
      cancelRenamePlatform,
      snackbar,
      snackbarMessage,
      showSnackbar,
      isConfirmDialogOpen,
      toggleSearch,
      searchQuery,
      selectedTags,
      availableTags,
      availablePlatforms,
      selectedPlatforms,
      filterPrompts,
      clearSearch,
      resetSearch,
      showSearch,
      filteredPrompts,
      passesFilter,
      toggleFilterPinnedPrompts,
      showPinnedOnly
    };
  },
});
</script>

<style scoped>
.container {
  padding: 16px;
  padding-top: 0px;
}

.prompt-manager-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.prompt-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.prompt-item-wrapper {
  margin-bottom: 16px;
}

.prompt-loader {
  margin: 10px 0;
}

.prompt-count {
  font-size: 14px;
}

.custom-placeholder .rounded-rectangle {
  width: 100%;
  height: 232px;
  background-color: rgba(var(--v-theme-formFieldBackground, 1));
  border-radius: 10px;
  margin-left: 49px;
  margin-right: 35px;
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.v-btn {
  transition: opacity 0.3s ease-in-out;
}

.search-area {
  margin-top: 0px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  background-color: rgba(var(--v-theme-formFieldBackground, 1));
  border: 1px solid rgba(var(--v-theme-formFieldBackground, 1));
  border-radius: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}
</style>
