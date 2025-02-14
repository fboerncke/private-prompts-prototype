import { setPlatform } from '@private-prompts/shared/services/PlatformProvider';
import { Platform } from "./Platform";
import { setPersistence } from '@private-prompts/shared/services/PersistenceProvider';
import { Persistence } from './Persistence';
setPlatform(new Platform());
setPersistence(new Persistence());

import '@assets/styles/style.css';
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "@private-prompts/shared/App.vue";
import i18n from '@private-prompts/shared/locales/i18n';
import { getPersistence } from "@private-prompts/shared/services/PersistenceProvider";
import globalComponents from "@private-prompts/shared/plugins/global-components";
import vuetify from "@private-prompts/shared/plugins/vuetify";
import { useHistoryStore } from "@private-prompts/shared/store/historyStore";
import { usePromptStore } from "@private-prompts/shared/store/promptStore";
import { useRulesStore } from "@private-prompts/shared/store/rulesStore";
import { loadTheme } from "@private-prompts/shared/services/ThemeManager";

(async () => {
  try {
    console.log("Vue app loading");
    // Load all data before mounting the app
    await loadTheme();
    console.log("Theme loaded");

    // Load stored config from persistent storage
    const config = await getPersistence().loadAppConfiguration();
    // Set the i18n locale to user's preferred locale, defaulting to 'de'
    i18n.global.locale.value = config.preferredLocale as 'en' | 'de';

    const app = createApp(App);
    app.use(vuetify);
    const { default: router } = await import("@private-prompts/shared/router");
    app.use(router);
    app.use(i18n);
    app.use(globalComponents); // Use the global components plugin
    app.use(createPinia());

    Promise.all([
      usePromptStore().loadPrompts(),
      useHistoryStore().loadHistory(),
      useRulesStore().loadRules(),
    ]).then(() => {
      app.mount("#app");
    });
    console.log("Vue app mounted");

  } catch (error) {
    console.error("Error loading theme:", error);

  }
})();
