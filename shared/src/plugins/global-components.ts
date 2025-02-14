// src/plugins/global-components.ts
import type { App } from "vue";
import ActionButton from "../components/ActionButton.vue";

export default {
  install(app: App) {
    app.component("ActionButton", ActionButton);
  },
};
