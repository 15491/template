import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

import { createVueEslintConfig } from '@template/config/eslint/vue'

export default createVueEslintConfig({
  globalIgnores,
  defineConfigWithVueTs,
  vueTsConfigs,
  pluginVue,
  skipFormatting,
})
