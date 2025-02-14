// src/locales/i18n.ts
import { createI18n } from 'vue-i18n';

// Import your locale files (TypeScript will parse the .json if configured)
import de from './de.json';
import en from './en.json';
import fr from './fr.json';
import pl from './pl.json';

const i18n = createI18n({
    legacy: false, // recommended for Vue 3 Composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        de,
        en,
        fr,
        pl
    },
});

export default i18n;