import { defineConfig } from "wxt";
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  outDir: "dist",
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    permissions: ["storage"],
    icons: {
      16: 'icon/private-prompts-logo-orange-bubble-16.png',
      48: 'icon/private-prompts-logo-orange-bubble-48.png',
      128: 'icon/private-prompts-logo-orange-bubble-128.png'
    },
  },
  alias: {
    '@private-prompts/shared': path.resolve(__dirname, '../../shared/src'),
    '@assets': path.resolve(__dirname, '../../assets'),
  },
  vite: () => ({
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, '../../assets/icons/*.png'),
            dest: 'icon',
          },
        ],
      }),
    ],
  }),
});
