<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- Beta Banner -->
    <div class="beta-banner" role="alert" aria-live="assertive">
      <span>
        0.0.5-beta
        <br>
        <a href="https://boerncke.de/kontakt" target="_blank" rel="noopener noreferrer" class="text-primary">
          Feedback welcome!
        </a>
        <br>
        Features Subject to Change
      </span>
    </div>

    <!-- Existing Header -->
    <header class="app-header">
      <v-container fluid>
        <v-row justify="center">
          <!-- Navigation Tabs -->
          <v-col cols="auto">
            <v-tabs v-model:active="activeTab" background-color="transparent" class="navigation-tabs"
              :hide-slider="activeTab === '/info'">
              <!-- Logo Tab -->
              <v-tab to="/info" class="no-hover" :ripple="false">
                <img alt="Private Prompts Logo" class="logo"
                  src="@assets/icons/private-prompts-logo-orange-bubble-500.png" width="80" height="80">
              </v-tab>
              <!-- Other Tabs -->
              <v-tab to="/privatize" class="centered-tab">
                {{ $t('mainLayout.protected-workbench-line1') }}
                <br>
                {{ $t('mainLayout.protected-workbench-line2') }}
              </v-tab>
              <v-tab to="/prompt-manager" class="centered-tab multiline-tab">
                {{ $t('mainLayout.prompt-manager-line1') }}
                <br>
                {{ $t('mainLayout.prompt-manager-line2') }}
              </v-tab>
              <v-tab to="/rules" class="centered-tab">
                {{ $t('mainLayout.private-data-definitions-line1') }}
                <br>
                {{ $t('mainLayout.private-data-definitions-line2') }}
              </v-tab>
              <v-tab to="/setup" class="centered-tab">
                {{ $t('mainLayout.management-console-line1') }}
                <br>
                {{ $t('mainLayout.management-console-line2') }}
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </header>

    <!-- Main Content Area -->
    <v-container fluid class="pt-0 mt-0">
      <RouterView />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { getPersistence } from '../services/PersistenceProvider';

const { locale } = useI18n();

const route = useRoute();
const activeTab = ref(route.path); // Initialize with the current route

// Watch for route changes to update the active tab
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = newPath;
  },
);

watch(locale, async (newLocale) => {
  const appConfiguration = await getPersistence().loadAppConfiguration();
  appConfiguration.preferredLocale = newLocale;
  await getPersistence().saveAppConfiguration(appConfiguration);
});
</script>

<style scoped>
.main-layout {
  position: relative;
  /* Establishes a positioning context */
}

/* Beta Banner Styling */
.beta-banner {
  position: fixed;
  top: 196px;
  /* Adjust as needed */
  right: -157px;
  /* Adjust to position the banner off the edge */
  width: 500px;
  /* Width of the banner */
  background-color: #ffcc00;
  color: #000;
  padding: 13px 140px 10px 140px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
  /* Rotate the banner diagonally */
  transform-origin: top right;
}

.mr-2 {
  margin-right: 8p 0.75rem;
}

.ml-2 {
  margin-left: 8px;
}

/* Adjust main content to prevent overlap with the fixed banner */
.main-layout>.app-header,
.main-layout>v-container {
  margin-top: 10px;
  /* Equal to banner height */
}

@media (max-width: 700px) {

  /* Target the v-slide-group__content which actually holds the tabs */
  .navigation-tabs .v-slide-group__content {
    overflow-x: auto;
    overflow-y: hidden;
    /* Hide any vertical scrollbar */
    white-space: nowrap;
    /* This ensures you can scroll horizontally if the tabs exceed the width */
  }

  .navigation-tabs .v-slide-group__content>* {
    display: inline-block;
    /* Ensure tabs line up horizontally */
    vertical-align: middle;
  }

  /* Reduce font size, padding, etc. as before */
  .navigation-tabs .v-tab {
    font-size: 0.65rem;
    padding: 0 4px;
    height: 50px !important;
    line-height: 1.2;
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logo {
    width: 50px;
    height: 50px;
  }
}


.app-header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto;
}

/* Set the navigation tabs height to match the logo size */
.navigation-tabs {
  background-color: transparent;
  box-shadow: none;
  height: 80px;
  /* Match the logo size */
}

/* Override Vuetify default tab height and center the content */
.v-tab {
  height: 80px !important;
  /* Force tab height to 80px */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Multiline tab style */
.multiline-tab {
  white-space: pre-wrap;
}
</style>
