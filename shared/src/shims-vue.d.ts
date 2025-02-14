// shared/src/shims-vue.d.ts

/**
 * This file provides TypeScript support for importing `.vue` files.
 * TypeScript doesn't natively understand `.vue` modules, so this declaration
 * tells the compiler that any `.vue` file exports a Vue component.
 * Without this, importing `.vue` files would result in TypeScript errors.
 */

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

