// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { createNodeEslintConfig } from '@template/config/eslint/node'

export default createNodeEslintConfig({
  eslint,
  tseslint,
  globals,
  eslintPluginPrettierRecommended,
  tsconfigRootDir: import.meta.dirname,
  ignores: ['eslint.config.mjs'],
  sourceType: 'commonjs',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
  },
})
