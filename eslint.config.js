import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['dist']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  prettier,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // Indentation
      indent: ['error', 2],
      // No empty lines at top of file
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
      // Ensure exactly one newline at EOF
      'eol-last': ['error', 'always'],
      // Remove excess whitespace between tokens
      'no-trailing-spaces': 'error',
    },
  },
];
