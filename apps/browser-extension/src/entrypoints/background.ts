// src/entrypoints/background.ts

// Ensure that defineBackground is called and exported as the default
declare function defineBackground(callback: () => void): void;

export default defineBackground(() => {
  // Background script logic
  console.log("I'm the background script");
});
