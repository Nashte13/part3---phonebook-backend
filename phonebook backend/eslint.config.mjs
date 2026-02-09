import globals from "globals";
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {...globals.node},
      ecmaVersions: 'latest',
    } 
  },

  {
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
  }
]);
