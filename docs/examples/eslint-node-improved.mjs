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
        // ===== TypeScript 规则（渐进式收紧）=====
        // 阶段 1：warn（当前阶段，给团队适应时间）
        '@typescript-eslint/no-explicit-any': 'warn', // 改为 warn
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',

        // 阶段 2：逐步启用（可选，根据团队情况）
        '@typescript-eslint/explicit-function-return-type': 'off', // 函数返回类型（可选）
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 导出函数类型（可选）
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],

        // ===== 代码质量规则 =====
        'no-console': ['warn', { allow: ['warn', 'error'] }], // 禁止 console.log
        'no-debugger': 'warn',
        'no-alert': 'error',
        'prefer-const': 'error',
        'no-var': 'error',

        // ===== 代码风格规则（与 Prettier 协调）=====
        curly: ['error', 'all'], // 强制使用大括号
        eqeqeq: ['error', 'always', { null: 'ignore' }], // 强制使用 ===
        'no-else-return': 'error', // 简化 if-else

        // ===== NestJS 特定规则 =====
        '@typescript-eslint/interface-name-prefix': 'off', // 接口命名不需要 I 前缀
        '@typescript-eslint/no-inferrable-types': 'off', // 允许显式类型注解

        // 用户自定义规则可以覆盖
        ...rules,
      },
    },
  )
}
