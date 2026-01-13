export function createVueEslintConfig({
  globalIgnores,
  defineConfigWithVueTs,
  vueTsConfigs,
  pluginVue,
  skipFormatting,
  name = 'app/files-to-lint',
  files = ['**/*.{vue,ts,mts,tsx}'],
  ignores = ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
} = {}) {
  if (!globalIgnores) throw new Error('createVueEslintConfig: missing `globalIgnores`')
  if (!defineConfigWithVueTs)
    throw new Error('createVueEslintConfig: missing `defineConfigWithVueTs`')
  if (!vueTsConfigs) throw new Error('createVueEslintConfig: missing `vueTsConfigs`')
  if (!pluginVue) throw new Error('createVueEslintConfig: missing `pluginVue`')
  if (!skipFormatting) throw new Error('createVueEslintConfig: missing `skipFormatting`')

  return defineConfigWithVueTs(
    {
      name,
      files,
    },
    globalIgnores(ignores),
    ...pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    skipFormatting,
  )
}
