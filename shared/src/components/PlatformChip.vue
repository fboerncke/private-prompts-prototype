<!-- src/components/PlatformChip.vue -->
<template>
  <v-chip small class="platform-chip" :color="chipColor" @click="emitRename">
    <v-icon left small>mdi-monitor</v-icon>
    &nbsp;
    {{ platform }}
    <v-icon small class="platform-delete-icon" @click="emitDelete">
      mdi-close
    </v-icon>
  </v-chip>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "PlatformChip",
  props: {
    platform: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
  },
  emits: ["rename", "delete"],
  setup(props, { emit }) {
    //const theme = useTheme();

    const emitRename = () => {
      emit("rename", props.platform);
    };

    const emitDelete = () => {
      emit("delete", props.platform);
    };

    const chipColor = computed(() => props.color || "blue");

    return {
      emitRename,
      emitDelete,
      chipColor,
    };
  },
});
</script>

<style scoped>
.platform-chip {
  margin-right: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 12px;
}

.platform-delete-icon {
  opacity: 0;
  margin-left: 4px;
}

.platform-chip:hover .platform-delete-icon {
  opacity: 1;
}
</style>
