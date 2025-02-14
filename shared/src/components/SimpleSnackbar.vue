<!-- src/components/SimpleSnackbar.vue -->

<template>
    <v-snackbar v-model="visible" :color="color" top right timeout="3000">
        {{ message }}
        <template #actions>
            <v-btn icon @click="visible = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    message: string;
    color?: string;
    visible: boolean;
}>();

const visible = ref(props.visible);
const color = ref(props.color || 'info');

// Watch for changes in props.visible
watch(
    () => props.visible,
    (newVal) => {
        visible.value = newVal;
    }
);

// Emit event when snackbar visibility changes
const emit = defineEmits(['update:visible']);
watch(visible, (newVal) => {
    emit('update:visible', newVal);
});
</script>

<style scoped></style>