<!-- src/components/ConfirmationDialog.vue -->
<template>
  <v-dialog v-model="internalModelValue" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="onCancel">Cancel</v-btn>
        <v-btn color="red" variant="text" @click="onConfirm">Discard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from "vue";

export default defineComponent({
  name: "ConfirmationDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Confirm",
    },
    message: {
      type: String,
      default: "Are you sure?",
    },
  },
  emits: ["update:modelValue", "confirm", "cancel"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const internalModelValue = ref(props.modelValue);

    // Watch for changes in the parent prop to update internal state
    watch(modelValue, (newVal) => {
      internalModelValue.value = newVal;
    });

    // Watch for internal changes to emit updates to the parent
    watch(internalModelValue, (newVal) => {
      emit("update:modelValue", newVal);
    });

    const onConfirm = () => {
      emit("confirm");
      emit("update:modelValue", false); // Close the dialog
    };

    const onCancel = () => {
      emit("cancel");
      emit("update:modelValue", false); // Close the dialog
    };

    return {
      internalModelValue,
      onConfirm,
      onCancel,
    };
  },
});
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>
