<!-- src/components/ActionButton.vue -->
<template>
  <v-tooltip v-if="tooltipText" location="bottom">
    <template #activator="{ props: tooltipProps }">
      <v-btn v-bind="{ ...tooltipProps, ...attrs }" :color="color" :disabled="disabled || loading" :variant="variant"
        :size="size" class="action-button" elevation="0" @click="handleClick">
        <v-icon v-if="icon" left :color="iconColorComputed">{{ icon }}</v-icon>
        <slot />
        <v-progress-circular v-if="loading" indeterminate size="20" color="white" class="ml-2" />
      </v-btn>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>

  <v-btn v-else v-bind="attrs" :color="color" :disabled="disabled || loading" :variant="variant" :size="size"
    elevation="0" class="action-button" @click="handleClick">
    <v-icon v-if="icon" left :color="iconColorComputed">{{ icon }}</v-icon>
    <slot />
    <v-progress-circular v-if="loading" indeterminate size="20" color="white" class="ml-2" />
  </v-btn>
</template>

<script setup lang="ts">
import { useAttrs, computed } from "vue";
import { useTheme } from "vuetify";

// Define the props with accurate types
const props = defineProps<{
  icon?: string;
  tooltipText?: string;
  iconColor?: string;
  color?: string;
  disabled?: boolean;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  size?: "small" | "default" | "large";
  loading?: boolean;
}>();

const emit = defineEmits(["click"]);

// Use useAttrs to pass additional attributes to the v-btn component
const attrs = useAttrs();

// Get the Vuetify theme to use for default icon colors
const theme = useTheme();

const iconColorComputed = computed(() => {
  if (props.color && props.color !== "transparent") {
    return "white";
  }
  return props.iconColor || theme.global.current.value.colors.onSurface;
});

// Emit the click event when the button is clicked
const handleClick = () => {
  if (!props.loading && !props.disabled) {
    emit("click");
  }
};
</script>

<style scoped>
.action-button {
  min-width: 10px;
  box-shadow: none;
  transition: none;
}

.action-button:focus {
  outline: none;
  box-shadow: none;
}

.small-icon {
  font-size: 19px;
  margin-right: 8px;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
