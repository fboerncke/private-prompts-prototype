<!-- src/components/SectionCard.vue -->
<template>
  <v-card class="section-card" flat>
    <v-card-title>
      <v-icon :color="iconColor" class="mr-2">{{ icon }}</v-icon>
      <span class="section-title">{{ title }}</span>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const _props = defineProps<{
  title: string;
  icon: string;
  iconColor: string;
}>();
</script>

<style scoped>
.section-title {
  font-size: 1.5rem;
  font-weight: 500;
}

.section-card {
  margin-bottom: 24px;
}
</style>
