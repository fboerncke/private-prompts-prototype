// src/router/index.ts

import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouterHistory,
} from "vue-router";
import { PlatformType } from "../interfaces/PlatformInterface";
import MainLayout from "../layouts/MainLayout.vue";
import { getPlatform } from "../services/PlatformProvider";
import InfoTab from "../views/tabs/InfoTab.vue";
import PromptManagerTab from "../views/tabs/PromptManagerTab.vue";
import ProtectedWorkbenchTab from "../views/tabs/ProtectedWorkbenchTab.vue";
import RulesTab from "../views/tabs/RulesTab.vue";
import SetupTab from "../views/tabs/SetupTab.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainLayout,
    children: [
      { path: "", name: "default", redirect: "privatize" },
      { path: "privatize", name: "privatize", component: ProtectedWorkbenchTab },
      {
        path: "prompt-manager",
        name: "prompt-manager",
        component: PromptManagerTab,
      },
      { path: "rules", name: "rules", component: RulesTab },
      { path: "setup", name: "setup", component: SetupTab },
      { path: "info", name: "info", component: InfoTab },
    ],
  },
];

// Function to detect the environment
function getRouterHistory(): RouterHistory {
  const platform = getPlatform();

  if (platform.getPlatform() === PlatformType.WEB) {
    return createWebHistory();
  } else if (platform.getPlatform() === PlatformType.ELECTRON) {
    return createWebHashHistory();
  } else if (platform.getPlatform() === PlatformType.PLUGIN) {
    return createWebHashHistory();
  } else {
    // this should not happen
    return createWebHashHistory();
  }
}

const router = createRouter({
  history: getRouterHistory(),
  routes,
});

export default router;
