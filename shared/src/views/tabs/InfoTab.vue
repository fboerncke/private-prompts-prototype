<!-- src/views/tabs/InfoTab.vue -->

<template>
  <v-container class="container">
    <v-card flat class="info-card">
      <v-card-title class="info-header" :style="{ borderBottom: '1px solid rgba(var(--v-theme-formFieldBackground))' }">
        <div style="flex: 1; text-align: left;">
          <h4>{{ $t('about.about-private-prompts') }}</h4>
        </div>
      </v-card-title>
    </v-card>

    <v-card flat>
      <v-card-text class="text-left">
        <p>
          {{ $t('about.information-1') }}
        </p>
        <p>
          {{ $t('about.information-2') }}
        </p>
        <p>
          {{ $t('about.information-3') }}
        </p>
        <v-list>
          <v-list-item link href="https://privateprompts.org" target="_blank">
            - {{ $t('about.private-prompts-homepage') }}
          </v-list-item>
          <v-list-item link href="https://github.com/fboerncke/private-prompts-prototype" target="_blank">
            - {{ $t('about.private-prompts-github') }}
          </v-list-item>
          <v-list-item link href="https://boerncke.de/kontakt" target="_blank">
            - {{ $t('about.frank-boerncke-homepage') }}
          </v-list-item>
          <v-list-item link href="mailto:frank.boerncke@gmail.com">
            - {{ $t('about.contact-frank-boerncke') }}
          </v-list-item>
        </v-list>
        <br>
        <span class="title">{{ $t('about.acknowledgements') }}</span>
        <v-row>
          <v-col cols="12" class="mb-8">
            <v-row class="justify-center">
              <!-- Funding Image 1 -->
              <v-col cols="12" sm="4" class="d-flex justify-center align-center mb-4">
                <img class="funding-image" src="@assets/logos/bmbf_en.jpg" alt="Funded by BMBF">
              </v-col>

              <!-- Funding Image 2 -->
              <v-col cols="12" sm="4" class="d-flex justify-center align-center mb-4">
                <img class="funding-image" src="@assets/logos/logo-okfn.svg" alt="Funded by OKFN">
              </v-col>

              <!-- Funding Image 3 -->
              <v-col cols="12" sm="1" class="d-flex justify-center align-center mb-4">
                <img class="funding-image" src="@assets/logos/PrototypeFund_Logo_smallest.svg"
                  alt="Funded by Prototype Fund">
              </v-col>
            </v-row>

            <v-card-text class="text-left">
              <p>
                {{ $t('about.funding-parties') }}
              </p>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
:root {
  /* Configurable Font Sizes */
  --floating-text-font-size: 16px;
  --code-font-size: 14px;
}

.container {
  padding: 16px;
  padding-top: 0px;
}

.info-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
}

.v-card-title {
  align-items: center;
}

.v-list-item {
  display: flex !important;
  /* Force flex display */
  align-items: center !important;
  text-align: left;
  /* Force vertical alignment */
}

.v-list-item-content {
  flex-grow: 1;
  /* Ensure the content takes up available space */
}

.v-progress-linear {
  border-radius: 5px;
}

@media (max-width: 600px) {
  .title {
    font-size: 1.5rem;
  }
}

/* Additional Styling for Cards */
.pa-4 {
  padding: 1.5rem;
}

.headline {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.mb-8 {
  margin-bottom: 3rem;
}

.mb-6 {
  margin-bottom: 2rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-3 {
  margin-right: 1rem;
}

.mr-4 {
  margin-right: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-left {
  text-align: left;
  font-size: var(--floating-text-font-size);
}

/* Feature and Use Case Cards */
.feature-card,
.usecase-card,
.team-card {
  background-color: var(--v-background-card);
}

/* Code Block Styling */
.code-block {
  background-color: rgba(var(--v-theme-speechBubbleBackground, 255, 255, 255, 1));
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  font-family: "Courier New", Courier, monospace;
  font-size: var(--code-font-size);
}

/* Funding Images Styling */
.funding-image {
  width: 100%;
  height: auto;
  align-content: center;
  object-fit: contain;
  margin: 0 1%;
}

@media (max-width: 600px) {
  .funding-image {
    width: 80%;
    margin: 0 auto 1rem auto;
  }
}

/* Ensure paragraphs have adequate spacing */
p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Dark Mode Compatibility */
@media (prefers-color-scheme: dark) {

  .feature-card,
  .usecase-card,
  .team-card {
    background-color: var(--v-background-card);
  }

  .code-block {
    background-color: #2c2c2c;
    color: #f5f5f5;
  }

  .funding-image {
    /* If needed, adjust image styles for dark mode */
    /* For example, adding a subtle border */
    border: 1px solid #444;
  }
}
</style>
