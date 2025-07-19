import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import reactCompiler from 'eslint-plugin-react-compiler';

const config = tseslint.config(
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactCompiler.configs.recommended,
      reactHooks.configs['recommended-latest'],
      perfectionist.configs['recommended-natural'],
      eslintConfigPrettier,
    ],
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
    },
    plugins: {
      react,
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          selector: 'variableLike',
        },
        {
          format: ['PascalCase'],
          selector: ['typeLike', 'enumMember'],
        },
        {
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          selector: 'typeProperty',
          trailingUnderscore: 'allow',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      curly: 'error',
      // 아래 자동정렬은 런타임 동작에 영향을 줄 수 있는 것들이에요.
      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-maps': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          newlinesBetween: 'always',
          customGroups: {
            type: {},
            value: {},
          },
        },
      ],
      'react/display-name': [1, { ignoreTranspilerName: false }],
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-compiler/react-compiler': 'warn',
      // perfectionist의 sorting과 겹칠 수 있어서 off해요.
      'sort-imports': 'off',
      'object-shorthand': ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
    settings: {
      'import/external-module-folders': ['node_modules'],
      'import/resolver': {},
      react: {
        version: 'detect',
      },
    },
  },
);

export default config;
