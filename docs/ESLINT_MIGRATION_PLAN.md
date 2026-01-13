# @antfu/eslint-config 迁移实施计划

**日期：** 2026-01-13
**项目：** template monorepo
**目标：** 从自定义 ESLint 配置迁移到 @antfu/eslint-config

---

## 📋 项目结构分析

### 当前配置架构

```
project-template/
├── pnpm-workspace.yaml          # catalog 版本管理
├── package.json                  # 根目录格式化脚本
├── packages/config/              # 共享配置包 ⚠️
│   ├── eslint/
│   │   ├── node.mjs             # createNodeEslintConfig 工厂函数
│   │   └── vue.mjs              # createVueEslintConfig 工厂函数
│   └── prettier/
│       └── index.cjs            # Prettier 配置
├── servers/                      # NestJS 后端
│   ├── eslint.config.mjs        # 使用 createNodeEslintConfig
│   └── package.json
└── apps/web/                     # Vue 前端
    ├── eslint.config.ts         # 使用 createVueEslintConfig
    └── package.json
```

### 现有依赖

**pnpm catalog:**

- `eslint: 9.39.2`
- `typescript-eslint: 8.20.0`
- `@eslint/js: 9.39.2`
- `eslint-config-prettier: 10.0.1`
- `eslint-plugin-prettier: 5.2.2`

**Vue 特定 (apps/web):**

- `@vue/eslint-config-typescript: 14.6.0`
- `@vue/eslint-config-prettier: 10.2.0`
- `eslint-plugin-vue: ~10.6.2`

---

## 🎯 迁移目标

### 用户需求（已确认）

1. ✅ 接受单行 if 语句省略大括号
2. ✅ 继续使用 Prettier（formatters: false）
3. ✅ import 自动排序可以接受

### 技术目标

- ✅ 使用 @antfu/eslint-config 替代自定义配置
- ✅ 保留 Prettier 配置不变
- ✅ 简化配置，减少依赖
- ✅ 保持或提升代码质量标准

---

## 📊 迁移策略

### 策略选择：简化架构（推荐）⭐

**删除共享配置包中的 ESLint 工厂函数**

**理由：**

1. @antfu/eslint-config 本身设计为简单配置
2. 自定义工厂函数增加不必要的复杂度
3. 直接使用符合社区实践
4. 更容易维护和更新

**保留：**

- Prettier 共享配置（`packages/config/prettier`）
- catalog 版本管理

---

## 🔄 详细迁移步骤

### 阶段 1: 准备工作（备份）

**1.1 备份当前配置**

```bash
# 备份共享配置
cp packages/config/eslint/node.mjs packages/config/eslint/node.mjs.backup
cp packages/config/eslint/vue.mjs packages/config/eslint/vue.mjs.backup

# 备份项目配置
cp servers/eslint.config.mjs servers/eslint.config.mjs.backup
cp apps/web/eslint.config.ts apps/web/eslint.config.ts.backup
```

**1.2 创建迁移文档**

- [x] 已创建 `docs/ESLINT_OPTIONS_2026.md`
- [x] 已创建 `docs/ESLINT_ANTFU_MIGRATION.md`
- [x] 当前文档：`docs/ESLINT_MIGRATION_PLAN.md`

---

### 阶段 2: 更新依赖和 catalog

**2.1 更新 pnpm-workspace.yaml**

添加到 catalog：

```yaml
catalog:
  # ... 现有依赖
  '@antfu/eslint-config': ^4.4.0 # 最新版本
```

**2.2 移除/标记废弃的 catalog 条目**

考虑移除（因为 @antfu 已包含）：

- ~~`@eslint/js`~~ - 保留，其他工具可能需要
- ~~`eslint-config-prettier`~~ - 保留，备用
- ~~`eslint-plugin-prettier`~~ - 保留，继续使用 Prettier
- ~~`typescript-eslint`~~ - 保留，备用

**建议：暂时保留所有现有 catalog 条目**，避免其他包受影响。

---

### 阶段 3: 更新共享配置包

**3.1 更新 packages/config/package.json**

```json
{
  "name": "@template/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./prettier": "./prettier/index.cjs"
  }
}
```

**变更说明：**

- ❌ 删除 `./eslint/node` 和 `./eslint/vue` 导出
- ✅ 保留 `./prettier` 导出

**3.2 标记 ESLint 配置为废弃（可选）**

选项 A：直接删除

```bash
rm -rf packages/config/eslint/
```

选项 B：标记为废弃（保守）

```bash
mv packages/config/eslint/ packages/config/eslint.deprecated/
echo "已废弃：请直接使用 @antfu/eslint-config" > packages/config/eslint.deprecated/README.md
```

**推荐：选项 A（直接删除）**

---

### 阶段 4: 迁移后端配置 (servers/)

**4.1 更新 servers/package.json**

添加依赖：

```json
{
  "devDependencies": {
    "@antfu/eslint-config": "catalog:",
    "eslint": "catalog:",
    "typescript": "catalog:"
    // 移除不再需要的
    // "@template/config": "workspace:*" - 仍保留（Prettier 需要）
  }
}
```

**4.2 重写 servers/eslint.config.mjs**

```javascript
// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // 类型检查配置
    type: 'lib', // 或 'app'
    typescript: {
      tsconfigPath: './tsconfig.json',
    },

    // 关闭格式化（继续使用 Prettier）
    formatters: false,

    // 不启用 Vue 支持
    vue: false,

    // 不启用 React 支持
    react: false,

    // 启用 Node.js 全局变量
    node: true,

    // 忽略文件
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.js', // 忽略 JS 文件（如 eslint.config.mjs）
    ],
  },
  {
    // 自定义规则（保留你的严格规则）
    rules: {
      // TypeScript 严格规则
      '@typescript-eslint/no-explicit-any': 'error', // 从 warn 升级到 error
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',

      // NestJS 特定规则
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 代码质量规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'error',

      // 注意：@antfu 默认允许单行 if 省略大括号，这符合你的需求
      // 如果想强制大括号，取消下面的注释：
      // 'curly': ['error', 'all'],

      // @antfu 默认强制 === （符合需求）
      // 'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },
)
```

**关键配置说明：**

- `formatters: false` - 继续使用 Prettier
- `typescript: true` - 启用 TypeScript 支持
- `vue: false` - 后端不需要 Vue
- `node: true` - 启用 Node.js 环境

---

### 阶段 5: 迁移前端配置 (apps/web/)

**5.1 更新 apps/web/package.json**

```json
{
  "devDependencies": {
    "@antfu/eslint-config": "catalog:",
    "eslint": "catalog:",
    "typescript": "catalog:",

    // 移除不再需要的
    // "@vue/eslint-config-typescript": "^14.6.0",
    // "@vue/eslint-config-prettier": "^10.2.0",
    // "eslint-plugin-vue": "~10.6.2",

    // 保留
    "@template/config": "workspace:*", // Prettier 需要
    "prettier": "catalog:"
  }
}
```

**5.2 重写 apps/web/eslint.config.ts**

```typescript
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

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'warn', // 前端可以稍微宽松

      // 代码质量规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },
)
```

---

### 阶段 6: 安装依赖

**6.1 更新 pnpm-workspace.yaml**

```bash
# 手动编辑或使用命令
```

**6.2 安装依赖**

```bash
# 在项目根目录
pnpm install

# 验证安装
pnpm list @antfu/eslint-config
```

---

### 阶段 7: 运行 Lint 并修复

**7.1 后端 - 先测试**

```bash
cd servers
pnpm lint 2>&1 | tee lint-result.txt
```

**预期变化：**

- ✅ import 语句会自动排序
- ✅ 单行 if 可以省略大括号（会自动移除）
- ⚠️ 可能有新的警告（TypeScript 类型问题）

**7.2 后端 - 自动修复**

```bash
cd servers
pnpm lint --fix
```

**7.3 前端 - 测试和修复**

```bash
cd apps/web
pnpm lint 2>&1 | tee lint-result.txt
pnpm lint --fix
```

**7.4 检查 git diff**

```bash
git diff --stat
git diff servers/
git diff apps/web/
```

---

### 阶段 8: 验证和测试

**8.1 类型检查**

```bash
# 后端
cd servers
pnpm tsc --noEmit

# 前端
cd apps/web
pnpm type-check
```

**8.2 运行测试**

```bash
# 后端
cd servers
pnpm test

# 前端
cd apps/web
pnpm test:unit
```

**8.3 本地开发验证**

```bash
# 启动后端
cd servers
pnpm start:dev

# 启动前端
cd apps/web
pnpm dev
```

**8.4 格式化检查**

```bash
# 根目录
pnpm format:check
```

---

## 📝 清理工作

### 删除备份文件（确认无问题后）

```bash
rm packages/config/eslint/*.backup
rm servers/eslint.config.mjs.backup
rm apps/web/eslint.config.ts.backup
```

### 删除废弃的共享配置

```bash
rm -rf packages/config/eslint/
```

### 更新文档

- [ ] 更新 `CLAUDE.md` - 修改 lint 相关说明
- [ ] 更新 `docs/04-tooling.md` - 更新 ESLint 配置章节
- [ ] 更新 `docs/06-coding-standards.md` - 更新 ESLint 规则说明

---

## ⚠️ 风险和注意事项

### 潜在问题

**1. Import 自动排序可能导致冲突**

- **风险：** 大量文件的 import 顺序改变
- **缓解：** 分批提交，逐个检查

**2. 单行 if 大括号移除**

- **风险：** 可能改变某些边缘情况的语义
- **缓解：** 仔细检查 git diff，运行完整测试

**3. TypeScript 类型检查更严格**

- **风险：** 可能发现之前隐藏的类型错误
- **缓解：** 逐个修复，必要时添加类型注解

**4. @antfu 默认规则可能与当前不同**

- **风险：** 大量新的 lint 错误
- **缓解：** 通过自定义 rules 覆盖不合适的规则

### 回滚策略

**如果出现重大问题：**

```bash
# 恢复备份
cp servers/eslint.config.mjs.backup servers/eslint.config.mjs
cp apps/web/eslint.config.ts.backup apps/web/eslint.config.ts

# 恢复共享配置
git checkout packages/config/

# 重新安装依赖
pnpm install

# 恢复代码变更
git checkout servers/ apps/web/
```

---

## 📈 预期结果

### 成功指标

- ✅ `pnpm lint` 在后端和前端都能运行无错误
- ✅ `pnpm type-check` 通过
- ✅ `pnpm format:check` 通过
- ✅ 所有测试通过
- ✅ 开发环境正常启动
- ✅ Git diff 显示的变更合理

### 改进效果

**配置简化：**

- 从 ~150 行自定义工厂函数 → ~50 行配置
- 减少 3-5 个 ESLint 插件依赖

**代码质量：**

- ✅ import 自动排序（提升可读性）
- ✅ 更现代的代码风格
- ✅ 更严格的 TypeScript 类型检查

**维护性：**

- ✅ 使用社区标准配置，更容易招聘和交接
- ✅ 跟随 @antfu/eslint-config 更新，获得最新最佳实践
- ✅ 配置更简单，减少维护成本

---

## 🚀 执行时间估算

| 阶段           | 预估时间       | 说明                     |
| -------------- | -------------- | ------------------------ |
| 准备工作       | 15 分钟        | 备份、阅读文档           |
| 更新依赖       | 10 分钟        | 修改配置文件             |
| 更新共享配置   | 10 分钟        | 删除/重构                |
| 迁移后端配置   | 20 分钟        | 编写新配置               |
| 迁移前端配置   | 20 分钟        | 编写新配置               |
| 安装依赖       | 5 分钟         | pnpm install             |
| 运行 lint 修复 | 30 分钟        | 自动修复 + 人工检查      |
| 验证测试       | 30 分钟        | 类型检查、测试、本地运行 |
| 清理和文档     | 20 分钟        | 删除备份、更新文档       |
| **总计**       | **2.5-3 小时** | 不包括解决意外问题的时间 |

---

## ✅ 准备开始？

当前状态：**计划已完成，等待执行**

**下一步操作：**

1. **确认计划** - 请确认此计划符合你的预期
2. **开始执行** - 我可以逐步执行每个阶段
3. **调整计划** - 如有需要，可以调整某些步骤

**执行方式选择：**

- **A. 全自动执行** - 我一次性完成所有步骤（风险较高）
- **B. 分阶段执行** - 每完成一个阶段，暂停并让你确认（推荐）⭐
- **C. 手动执行** - 我提供命令，你手动执行（最安全）

**请选择：A / B / C**
