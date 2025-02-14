// src/constants/DefaultAppConfiguration.ts

import { AppConfiguration } from "../interfaces/AppConfigurationInterface";
import { defaultPrompts, defaultRules } from "../services/DefaultDataProvider";

// Name of the main bucket for persistence
export const DEFAULT_BUCKET_NAME: string = "appData";

// Default configuration for a Private Prompts app session 
export const DEFAULT_JSON_CONFIGURATION: AppConfiguration = {
    prompts: defaultPrompts,
    rules: defaultRules,
    theme: "light",
    openAIKey: "",
    history: [],
    preferredLocale: "de",
    version: "0.002"
};

// Placeholder
export const DUMMY: string = "example";
