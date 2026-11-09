// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/**', '.features-gen/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ...playwright.configs['flat/recommended'], files: ['**/*.ts'] },
  {
    files: ['**/*.ts'],
    rules: {
      // In BDD the assertions sit in step definitions, not inside test() blocks.
      'playwright/no-standalone-expect': 'off',
      'playwright/expect-expect': 'off',
      // No hard waits, no forced clicks, no networkidle. These cause most flaky tests.
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
);
