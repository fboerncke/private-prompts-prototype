<!-- src/components/PromptItem.vue -->
<template>
    <div :key="prompt.id" class="prompt-row mt-0 w-100 flex">
        <!-- Drag Handle -->
        <div class="drag-handle-wrapper d-flex p-0">
            <span class="drag-handle">☰</span>
        </div>

        <!-- Prompt Description and Preview -->
        <div class="form-field-wrapper flex-grow-1">
            <!-- Prompt Header with Description and Action Buttons -->
            <div class="prompt-header d-flex justify-space-between align-center">
                <!-- Prompt Title -->
                <div class="prompt-title cursor-pointer" @click="handleOpenPromptDialog">
                    {{ prompt.description }}
                </div>

                <!-- Action Buttons -->
                <div v-once class="action-buttons d-flex align-center">
                    <ActionButton v-once icon="mdi-content-duplicate" size="default" variant="flat"
                        :color="'rgba(var(--v-theme-secondary), 1)'" @click="handleDuplicate" />
                    &nbsp;
                    <ActionButton v-once icon="mdi-delete-outline" size="default" variant="flat"
                        :color="'rgba(var(--v-theme-secondary), 1)'" @click="handleDelete" />
                    &nbsp;
                    <ActionButton v-once icon="mdi-content-copy" size="default" variant="flat"
                        :color="'rgba(var(--v-theme-secondary), 1)'" @click="handleCopyToClipboard" />
                    &nbsp;
                    <ActionButton v-once icon="mdi-arrow-left-bottom" size="default" variant="flat"
                        :color="'rgba(var(--v-theme-secondary), 1)'" @click="handleCopyToProtectedWorkbench" />
                    &nbsp;
                    <ActionButton v-once :color="'rgba(var(--v-theme-secondary), 1)'" size="default"
                        @click="handleToggleFavorite">
                        <v-icon color="white">
                            {{ prompt.isFavorite ? 'mdi-pin' : 'mdi-pin-outline' }}
                        </v-icon>
                    </ActionButton>
                </div>
            </div>

            <!-- Prompt Preview -->
            <div class="preview-container cursor-pointer" @click="handleOpenPromptDialog">
                <div class="prompt-preview" :class="{ 'is-truncated': isTruncated }">
                    {{ truncatedPrompt }}
                </div>
                <div v-if="prompt.prompt.length > characterThreshold" class="character-count">
                    {{ prompt.prompt.length }} Characters
                </div>
            </div>

            <!-- Tags Display -->
            <div class="tags-container">
                <div class="tag-chips">
                    <TagChip v-for="tag in prompt.tags" :key="tag" :tag="tag" @rename="handleRenameTag(tag)"
                        @delete="handleDeleteTag(prompt, tag)" />
                    <button class="add-tag-button" style="background-color: #53b256;" @click="handleOpenAddTagDialog">
                        <span class="mdi mdi-plus" style="font-size: 20px;" />
                    </button>
                </div>
            </div>

            <!-- Platforms Display -->
            <div class="platforms-container">
                <div class="platform-chips">
                    <PlatformChip v-for="platform in prompt.platforms" :key="platform" :platform="platform"
                        @rename="handleRenamePlatform(platform)" @delete="handleDeletePlatform(prompt, platform)" />
                    <button class="add-platform-button" style="background-color: #299af3;"
                        @click="handleOpenAddPlatformDialog">
                        <span class="mdi mdi-plus" style="font-size: 20px;" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineAsyncComponent } from "vue";

const ActionButton = defineAsyncComponent(() => import('./ActionButton.vue'));
const TagChip = defineAsyncComponent(() => import('./TagChip.vue'));
const PlatformChip = defineAsyncComponent(() => import('./PlatformChip.vue'));


interface PromptItemStructure {
    id: number;
    description: string;
    prompt: string;
    comment: string;
    platforms: string[];
    tags: string[];
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}


export default defineComponent({

    name: 'PromptItem',
    components: {
        ActionButton,
        TagChip,
        PlatformChip,
    },
    memo: true,
    props: {
        prompt: {
            type: Object as () => PromptItemStructure,
            required: true,
        },
        characterThreshold: {
            type: Number,
            default: 400,
        },
    },
    emits: [
        'openPromptDialog',
        'duplicatePrompt',
        'deletePrompt',
        'copyToClipboard',
        'copyToProtectedWorkbench',
        'togglePromptFavoriteStatus',
        'openRenameTagDialog',
        'deleteTagFromPrompt',
        'openAddTagDialog',
        'openRenamePlatformDialog',
        'deletePlatformFromPrompt',
        'openAddPlatformDialog',
    ],
    setup(props, { emit }) {
        const isTruncated = computed(() => {
            return props.prompt.prompt.length > props.characterThreshold;
        });

        const truncatedPrompt = computed(() => {
            if (isTruncated.value) {
                return props.prompt.prompt.slice(0, props.characterThreshold) + '...';
            }
            return props.prompt.prompt;
        });

        const handleDuplicate = () => {
            emit('duplicatePrompt', props.prompt);
        };

        const handleDelete = () => {
            emit('deletePrompt', props.prompt.id);
        };

        const handleCopyToClipboard = () => {
            emit('copyToClipboard', props.prompt.prompt);
        };

        const handleCopyToProtectedWorkbench = () => {
            emit('copyToProtectedWorkbench', props.prompt.prompt);
        };

        const handleToggleFavorite = () => {
            emit('togglePromptFavoriteStatus', props.prompt);
        };

        const handleOpenPromptDialog = () => {
            emit('openPromptDialog', props.prompt);
        };

        const handleOpenAddTagDialog = () => {
            emit('openAddTagDialog', props.prompt);
        };


        // Tag actions
        const handleRenameTag = (tag: string) => {
            emit('openRenameTagDialog', tag);
        };

        const handleDeleteTag = (prompt: PromptItemStructure, tag: string) => {
            emit('deleteTagFromPrompt', prompt, tag);
        };


        // Platform actions
        const handleRenamePlatform = (platform: string) => {
            emit('openRenamePlatformDialog', platform);
        };

        const handleDeletePlatform = (prompt: PromptItemStructure, platform: string) => {
            emit('deletePlatformFromPrompt', prompt, platform);
        };

        const handleOpenAddPlatformDialog = () => {
            emit('openAddPlatformDialog', props.prompt);
        };
        return {
            isTruncated,
            truncatedPrompt,
            handleDuplicate,
            handleDelete,
            handleCopyToClipboard,
            handleCopyToProtectedWorkbench,
            handleToggleFavorite,
            handleOpenPromptDialog,
            // Tag actions
            handleRenameTag,
            handleDeleteTag,
            handleOpenAddTagDialog,
            // Platform actions
            handleRenamePlatform,
            handleDeletePlatform,
            handleOpenAddPlatformDialog,
        };
    },
});
</script>

<style scoped>
.prompt-row {
    margin-left: 20px;
    align-items: center;
    display: flex;
    padding: 3px;
}

.prompt-row .action-buttons {
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 5px;
    opacity: 0;
}

.prompt-row:hover .action-buttons {
    opacity: 1;
    background-color: rgba(var(--v-theme-formFieldBackground, 1));
}

.drag-handle-wrapper {
    padding: 1px;
}

.drag-handle {
    cursor: ns-resize;
    margin: 0;
    padding-bottom: 17px;
}

.form-field-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
    background-color: rgba(var(--v-theme-formFieldBackground, 1));
    border: 1px solid rgba(var(--v-theme-formFieldBackground, 1));
    border-radius: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
    margin-left: 10px;
    margin-right: 50px;
}

.prompt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.prompt-title {
    font-weight: 700;
    font-size: 1.2em;
    margin-bottom: 5px;
}

.action-buttons {
    display: flex;
    align-items: center;
}

.action-buttons .v-btn {
    margin-left: 4px;
}

.prompt-preview {
    font-size: 1rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.cursor-pointer {
    cursor: pointer;
}

.preview-container {
    display: flex;
    flex-direction: column;
}


.is-truncated {
    overflow: hidden;
    text-overflow: ellipsis;
}

.character-count {
    font-size: 0.9em;
    color: gray;
}

.platforms-container {
    margin-top: 8px;
    display: flex;
    align-items: center;
}

.platforms-container span {
    margin-right: 8px;
}

.platform-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.tags-container {
    margin-top: 8px;
    display: flex;
    align-items: center;
}

.tags-container span {
    margin-right: 8px;
}

.tag-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.add-tag-button,
.add-platform-button {
    padding: 3px;
    min-width: 20px;
    min-height: 20px;
    width: 25px;
    height: 25px;
    box-shadow: none;
    opacity: 0;
    transition:
        opacity 0.2s ease-in-out,
        transform 0.2s ease-in-out;
    pointer-events: none;
    border: none;
    border-radius: 50%;
    margin: 0px;
    cursor: pointer;
    align-items: center;
    display: flex;
    color: white;
}

.prompt-row:hover .add-tag-button,
.prompt-row:hover .add-platform-button {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1.1);
}
</style>