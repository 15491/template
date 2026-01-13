export function createNodeEslintConfig({
  eslint,
  tseslint,
  globals,
  eslintPluginPrettierRecommended,
  tsconfigRootDir,
  ignores = ['eslint.config.mjs'],
  sourceType = 'commonjs',
  rules = {},
} = {}) {
  if (!eslint) throw new Error('createNodeEslintConfig: missing `eslint`')
  if (!tseslint) throw new Error('createNodeEslintConfig: missing `tseslint`')
  if (!globals) throw new Error('createNodeEslintConfig: missing `globals`')
  if (!eslintPluginPrettierRecommended) {
    throw new Error('createNodeEslintConfig: missing `eslintPluginPrettierRecommended`')
  }
  if (!tsconfigRootDir) {
    throw new Error('createNodeEslintConfig: missing `tsconfigRootDir`')
  }

  return tseslint.config(
    {
      ignores,
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType,
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        ...rules,
      },
    },
  )
}
