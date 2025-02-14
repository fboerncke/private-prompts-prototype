// shared/src/services/ThemeManager.ts

import { ref } from "vue";
import { PersistenceService } from './PersistenceService';

import vuetify from "../plugins/vuetify";

/**
 * Reactive variable holding the current theme, defaulting to 'light'.
 */
const currentTheme = ref("light");

/**
 * Loads the theme from persistent storage and applies it to Vuetify.
 * Falls back to 'light' theme if loading fails.
 */
const loadTheme = async () => {
  let startupTheme = "light"; // default value
  try {
    const persistenceService = new PersistenceService();
    startupTheme = await persistenceService.loadTheme();
  } catch {
    // Error intentionally ignored
  }
  currentTheme.value = startupTheme || "light";
  vuetify.theme.global.name.value = currentTheme.value;
};

/**
 * Saves the provided theme to persistent storage and applies it immediately.
 * @param newTheme - The new theme string to apply and save.
 */
const saveTheme = async (newTheme: string) => {
  currentTheme.value = newTheme;
  vuetify.theme.global.name.value = newTheme;
  const persistenceService = new PersistenceService();

  await persistenceService.saveTheme(newTheme);
};

/**
 * Toggles the current theme between 'light' and 'dark', then saves it.
 */
const toggleTheme = async () => {
  const newTheme = currentTheme.value === "light" ? "dark" : "light";
  await saveTheme(newTheme);
};

export { currentTheme, loadTheme, saveTheme, toggleTheme };
