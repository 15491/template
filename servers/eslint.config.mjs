// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // 类型检查配置
    type: 'lib',
    typescript: {
      tsconfigPath: './tsconfig.json',
    },

    // 关闭格式化（继续使用 Prettier）
    formatters: false,

    // 不启用 Vue 支持
    vue: false,

    // 不启用 React 支持
    react: false,

    // 启用 Node.js 环境
    node: true,

    // 忽略文件
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.js',
      '**/*.mjs',
    ],
  },
  {
    // 自定义规则（保留严格规则）
    rules: {
      // TypeScript 严格规则
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',

      // NestJS 特定规则
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Node.js 环境规则
      'node/prefer-global/process': 'off', // NestJS 使用全局 process
      'node/prefer-global/buffer': 'off',

      // 代码质量规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'error',

      // 注意：@antfu 默认允许单行 if 省略大括号
      // 如果想强制大括号，取消下面的注释：
      // 'curly': ['error', 'all'],
    },
  },
)
