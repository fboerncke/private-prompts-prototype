import { HistoryEntry } from "./HistoryEntryInterface";
import { Prompt } from "./PromptInterface";
import { Rule } from "./RuleInterface";

// Base configuration with generic types for prompts, rules, and history
type BaseAppConfiguration<P, R, H> = {
    prompts: P[];
    rules: R[];
    theme: string;
    openAIKey?: string;
    history: H[];
    preferredLocale: string;
    version: string;
};

// Full AppConfiguration with 'id' included
export type AppConfiguration = BaseAppConfiguration<Prompt, Rule, HistoryEntry>;

// PersistableAppConfiguration without 'id' in its fields
export type PersistableAppConfiguration = BaseAppConfiguration<Omit<Prompt, 'id'>, Omit<Rule, 'id'>, Omit<HistoryEntry, 'id'>>;

