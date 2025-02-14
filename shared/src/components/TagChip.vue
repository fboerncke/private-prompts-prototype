<!-- src/components/TagChip.vue -->
<template>
  <v-chip small class="tag-chip" :color="chipColor" @click="emitRename">
    <v-icon left small>mdi-tag-outline</v-icon>
    &nbsp;&nbsp;
    {{ tag }}

    <v-icon small class="tag-delete-icon" @click="emitDelete">
      mdi-close
    </v-icon>
  </v-chip>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
//import { useTheme } from "vuetify";

export default defineComponent({
  name: "TagChip",
  props: {
    tag: {
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
      emit("rename", props.tag);
    };

    const emitDelete = () => {
      emit("delete", props.tag);
    };

    const chipColor = computed(() => props.color || "green");

    return {
      emitRename,
      emitDelete,
      chipColor,
    };
  },
});
</script>

<style scoped>
.tag-chip {
  margin-right: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 12px;
}

.tag-delete-icon {
  opacity: 0;
  margin-left: 4px;
}

.tag-chip:hover .tag-delete-icon {
  opacity: 1;
}
</style>
