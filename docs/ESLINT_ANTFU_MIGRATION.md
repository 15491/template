# 迁移到 @antfu/eslint-config 方案

**日期：** 2026-01-13
**方案：** 从当前配置迁移到 @antfu/eslint-config

---

## 为什么选择 @antfu/eslint-config

### ❌ 不选择 Airbnb 的原因

- [官方配置已 3-4 年未更新](https://github.com/airbnb/javascript/issues/2961)
- [不支持 ESLint 9 flat config](https://github.com/airbnb/javascript/issues/2804)
- 主要面向 React，不适合 NestJS + Vue 技术栈
- 需要兼容性层，配置复杂

### ✅ @antfu/eslint-config 的优势

- ✅ 原生支持 ESLint 9 flat config
- ✅ 自动检测 TypeScript 和 Vue
- ✅ 包含格式化规则（可选择保留或替代 Prettier）
- ✅ 积极维护，社区活跃
- ✅ 配置简单，开箱即用
- ✅ 支持 monorepo
- ✅ 有"不那么固执"模式（`lessOpinionated`）

---

## 主要差异对比

| 特性             | 当前配置               | @antfu/eslint-config        |
| ---------------- | ---------------------- | --------------------------- |
| **分号**         | `semi: false`          | 无分号（一致）              |
| **引号**         | `singleQuote: true`    | 单引号（一致）              |
| **缩进**         | 2 空格（默认）         | 2 空格（一致）              |
| **尾随逗号**     | `trailingComma: 'all'` | 仅多行（**差异**）          |
| **大括号风格**   | 强制 `curly: 'all'`    | 允许单行省略（**差异**）    |
| **未使用导入**   | 警告                   | 自动移除（**差异**）        |
| **Vue 组件命名** | PascalCase             | PascalCase（一致）          |
| **自动排序**     | 无                     | import 自动排序（**新增**） |

---

## 改动大小评估

### 🟢 小改动（格式类）

- ✅ 分号、引号、缩进 - 完全一致
- ✅ Vue 组件规则 - 基本一致
- ⚠️ 尾随逗号 - 可能需要调整少量代码

### 🟡 中等改动（风格类）

- ⚠️ 单行 if 语句 - 目前强制大括号，Antfu 允许省略
- ⚠️ import 排序 - Antfu 会自动排序，可能重新排列导入

### 🔴 需要决策的改动

1. **是否保留 Prettier？**
   - 选项 A：保留 Prettier + @antfu/eslint-config
   - 选项 B：只用 @antfu/eslint-config（内置格式化）

2. **是否启用 `lessOpinionated` 模式？**
   - 启用：接近你当前的规则
   - 不启用：采用 Antfu 的最佳实践

---

## 迁移方案（三选一）

### 方案 1：保守迁移（推荐）⭐

**特点：** 保留 Prettier + 启用 `lessOpinionated`

**优势：**

- 改动最小
- 团队适应成本低
- 保持现有格式风格

**配置示例：**

```javascript
// servers/eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    lessOpinionated: true, // 减少固执规则
    formatters: false, // 继续使用 Prettier
    typescript: true,
    vue: false, // 后端不需要 Vue
  },
  {
    rules: {
      // 保留你的自定义规则
      curly: ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
)
```

### 方案 2：标准迁移

**特点：** 保留 Prettier + 使用 Antfu 默认规则

**优势：**

- 采用社区最佳实践
- 代码风格更现代

**改动：**

- 允许单行 if 省略大括号
- import 会自动排序

### 方案 3：激进迁移

**特点：** 完全使用 @antfu/eslint-config（替代 Prettier）

**优势：**

- 工具链简化
- 配置统一
- 性能更好

**劣势：**

- 格式风格改变较大
- 需要调整所有代码

---

## 实际代码改动示例

### 当前代码风格

```typescript
// ✅ 当前必须这样写
if (condition) {
  return true
}

// ✅ import 顺序随意
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { Injectable } from '@nestjs/common'
```

### Antfu 默认风格

```typescript
// ✅ 允许单行省略大括号（可配置）
if (condition) return true

// ✅ import 自动排序
import { Injectable, Module } from '@nestjs/common'
import { UserService } from './user.service'
```

---

## 迁移步骤（方案 1 - 保守迁移）

### 1. 安装依赖

```bash
cd servers
pnpm add -D @antfu/eslint-config

# 前端项目
cd ../apps/web
pnpm add -D @antfu/eslint-config
```

### 2. 更新共享配置

修改 `packages/config/eslint/node.mjs`

### 3. 运行并修复

```bash
pnpm lint --fix
```

### 4. 人工检查

检查 git diff，确认改动合理

---

## 我的建议

**建议使用：方案 1 - 保守迁移**

理由：

1. ✅ 改动最小（主要是 import 排序）
2. ✅ 保持你现有的严格规则（大括号、分号等）
3. ✅ 团队无需重新适应
4. ✅ 获得 Antfu 配置的优势（TypeScript/Vue 支持）

**预估工作量：**

- 配置修改：1-2 小时
- 代码调整：自动修复为主，人工检查 30 分钟
- 测试验证：1 小时

**总计：** 2-4 小时

---

## 问题与决策

请回答以下问题，我会根据你的答案生成具体配置：

1. **是否接受单行 if 语句省略大括号？**
   - A. 不接受，保持强制大括号
   - B. 接受，采用更灵活的风格

2. **是否继续使用 Prettier？**
   - A. 是，保留 Prettier
   - B. 否，完全使用 @antfu/eslint-config

3. **import 自动排序可以接受吗？**
   - A. 可以接受
   - B. 不接受，保持现状

4. **改动规模期望？**
   - A. 最小改动，保守迁移
   - B. 中等改动，标准迁移
   - C. 激进改动，完全采用 Antfu

---

## 参考资料

- [@antfu/eslint-config GitHub](https://github.com/antfu/eslint-config)
- [ESLint v9 Support Issue](https://github.com/airbnb/javascript/issues/2961)
- [Flat Config Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Best eslint-config-airbnb Alternatives](https://stackshare.io/npm-eslint-config-airbnb/alternatives)
