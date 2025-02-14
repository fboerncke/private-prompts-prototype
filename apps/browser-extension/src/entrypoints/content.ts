declare function defineContentScript(options: {
  matches: string[];
  runAt: string;
  main(): void;
}): void;

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  runAt: 'document_start',
  main() {
    // Your content script logic here
  },
});
