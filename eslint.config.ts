import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs } from '@vue/eslint-config-typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import importPlugin from 'eslint-plugin-import';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',

    files: ['**/*.{ts,vue}'],
  },

  {
    name: 'app/files-to-ignore',

    ignores: ['**/dist'],
  },

  ...pluginVue.configs['flat/essential'],

  importPlugin.flatConfigs.recommended,

  {
    rules: {
      'import/newline-after-import': 'error',

      'vue/multi-word-component-names': 'off',
    },
  },

  {
    settings: {
      'import/resolver': {
        typescript: true,

        node: true,
      },
    },
  },
  eslintPluginPrettierRecommended
);
