
module.exports = {
  parser: 'vue-eslint-parser', // Use TypeScript parser
  parserOptions: {
    parser: '@typescript-eslint/parser', // Delegate script parsing to TypeScript parser
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],  // Recognize .vue files
  },
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',           // Vue 3 recommended rules
    'plugin:@typescript-eslint/recommended', // TypeScript recommended rules
  ],
  rules: {
    // Enable strict rules for unused variables and unreachable code
    'no-unused-vars': 'off', // Off in favor of TypeScript rule below
    '@typescript-eslint/no-unused-vars': ['error',
      {
        argsIgnorePattern: '^_', varsIgnorePattern: '^_'
      }
    ],
    'no-unreachable': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/require-self-closing': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION', // is, v-for, etc.
          'LIST_RENDERING', // v-if, v-else-if, v-else, v-show, v-cloak
          'CONDITIONALS', // v-if, v-else-if, v-else
          'RENDER_MODIFIERS', // v-once, v-pre
          'GLOBAL', // id
          'UNIQUE', // ref, key, slot
          'TWO_WAY_BINDING', // v-model
          'OTHER_DIRECTIVES', // custom directives
          'OTHER_ATTR', // class, style, etc.
          'EVENTS', // v-on
          'CONTENT', // v-text, v-html
        ],
        alphabetical: false, // Set to `true` if you want alphabetical ordering
      },
    ],
  },
  overrides: [
    {
      files: ['.eslintrc.js'],  // Apply specific env only for this file
      env: { node: true }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "build/",
    "dist/",
    'dev-server.js',
    'tsc.js',
    'build.js',
    'vite.config.js',
    'flatten.js',
    'shared/src/shims-vue.d.ts',
    ".eslintrc.js"
  ]

};