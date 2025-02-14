const vue = require('@vitejs/plugin-vue');  // Import Vite plugin for Vue
const vuetify = require('vite-plugin-vuetify');
const { defineConfig } = require('vite');  // Import defineConfig function from Vite
const { nodePolyfills } = require('vite-plugin-node-polyfills');  // Import node polyfills plugin for Vite
const Path = require('path');  // Import path module for handling file paths

/**
 * https://vitejs.dev/config
 */
module.exports = defineConfig({
  root: Path.join(__dirname, 'src', 'renderer'),  // Set the root directory for the project
  base: './', // Add this line

  //publicDir: 'public',  // Specify the public directory for static assets
  publicDir: Path.join(__dirname, 'public'),
  server: {
    port: 8080,  // Set the development server port to 8080
  },
  open: false,  // Do not open the browser automatically
  build: {
    asar: true,
    cssCodeSplit: true,
    outDir: Path.join(__dirname, 'build', 'renderer'),  // Output directory for build files
    emptyOutDir: true,  // Empty the output directory before each build
    rollupOptions: {
      external: ['electron', 'electron-store'],  // Exclude built-in modules from the bundle
      treeshake: true,
    },
    minify: 'esbuild',
    extraResources: [],
    extraFiles: []
  },
  resolve: {
    alias: {
      '@': Path.resolve(__dirname, './src/renderer'),  // Create an alias for the src/renderer directory
      '@private-prompts/shared': Path.resolve(__dirname, '../../shared/src'),
      '@assets': Path.resolve(__dirname, '../../assets'),
    },
  },
  plugins: [
    nodePolyfills({
      protocolImports: true,  // Enable protocol imports in the node polyfills plugin
    }),
    vue(),  // Enable Vue plugin for Vite
    vuetify({ autoImport: true, treeshake: true }),

  ],
});
