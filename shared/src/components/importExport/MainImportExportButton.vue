<template>
    <div>
        <ActionButton :icon="icon" variant="flat" :color="color" :tooltip-text="tooltipText" size="default"
            @click="handleClick">
            <slot>
                <template v-if="icon && label">&nbsp;</template>
                {{ label }}
            </slot>
        </ActionButton>
        <input v-if="props.isImport" ref="fileInput" type="file" hidden :accept="accept" @change="handleFileChange">
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Defining props
const props = defineProps({
    label: {
        type: String,
        default: "some label text",
    },
    icon: {
        type: String,
        default: "icon definition",
    },
    color: {
        type: String,
        default: "primary",
    },
    tooltipText: {
        type: String,
        default: "toolTipText",
    },
    isImport: {
        type: Boolean,
        default: false,
    },
    accept: {
        type: String,
        default: ".json",
    },
    // eslint-disable-next-line vue/require-default-prop
    onAction: Function, // Function to handle import/export logic
});

const fileInput = ref<HTMLInputElement | null>(null);

// Trigger file input for imports
const triggerFileInput = () => {
    if (fileInput.value) fileInput.value.click();
};

// Handle button click
const handleClick = () => {
    if (props.isImport) {
        triggerFileInput();
    } else {
        props.onAction?.(); // Call export action
    }
};

// Handle file input change (for imports)
const handleFileChange = (event: Event) => {
    props.onAction?.(event); // Pass the event to parent logic
};
</script>
