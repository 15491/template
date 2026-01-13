import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // 启用 Vue 3 支持
    vue: true,

    // TypeScript 配置
    typescript: {
      tsconfigPath: './tsconfig.app.json',
    },

    // 关闭格式化（继续使用 Prettier）
    formatters: false,

    // 忽略文件
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.vite/**'],
  },
  {
    // 自定义规则
    rules: {
      // Vue 规则（保持你的偏好）
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],

      // TypeScript 规则 - 前端稍微宽松
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off', // Vue 组件类型推断问题
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // 代码质量规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },
)
