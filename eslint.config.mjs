import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = defineConfig([
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      '*.d.ts',
      'eslint.config.mjs',
      '**/__tests__/**',
      '**/*.test.*',
      '.next/**',
    ],
  },
  {
    extends: compat.extends(
      'next/core-web-vitals',
      'next/typescript',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended'
    ),
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks,
      prettier: prettier,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
        ignore: ['eslint.config.mjs'],
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': [
        'error',
        {
          usePrettierrc: true,
          endOfLine: 'auto',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'default-case': 'error',
      'no-fallthrough': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]);

export default eslintConfig;
