# 2026 年流行 ESLint 配置方案对比

**日期：** 2026-01-13
**适用于：** TypeScript + NestJS + Vue 3 技术栈

---

## 方案概览

| 方案                            | ESLint 9 支持 | 维护状态 | 严格程度 | 配置复杂度 | 推荐指数   |
| ------------------------------- | ------------- | -------- | -------- | ---------- | ---------- |
| 🏆 **@antfu/eslint-config**     | ✅ 原生       | 🟢 积极  | 中等可调 | 简单       | ⭐⭐⭐⭐⭐ |
| 🥈 **XO**                       | ✅ 原生       | 🟢 积极  | 很严格   | 简单       | ⭐⭐⭐⭐   |
| 🥉 **typescript-eslint strict** | ✅ 原生       | 🟢 官方  | 非常严格 | 中等       | ⭐⭐⭐⭐   |
| **Standard**                    | ⚠️ 兼容层     | 🟡 缓慢  | 宽松     | 简单       | ⭐⭐⭐     |
| ❌ **Airbnb**                   | ❌ 不支持     | 🔴 停滞  | 严格     | 复杂       | ⭐         |

---

## 方案 1：@antfu/eslint-config 🏆

> **最推荐！** 专为现代 TypeScript/Vue 项目设计

### 特点

- ✅ **原生支持 ESLint 9 flat config**
- ✅ **自动检测 TypeScript、Vue、React**
- ✅ **包含格式化规则**（可选择替代 Prettier）
- ✅ **自动排序 import**
- ✅ **支持 monorepo**
- ✅ **配置极简**（一行代码即可）
- ✅ **积极维护**（Anthony Fu 是 Vue 核心团队成员）

### 代码风格

```typescript
// 单引号，无分号
const foo = 'bar'

// 允许单行 if 省略大括号（可配置）
if (condition) return true

// import 自动排序
import { computed, ref } from 'vue'
import type { User } from './types'
```

### 配置示例（超简单）

```javascript
// servers/eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: false, // 后端不需要 Vue
  formatters: false, // 继续使用 Prettier
})
```

### 适用场景

- ✅ Vue 3 项目（完美支持）
- ✅ TypeScript 项目
- ✅ 全栈 monorepo
- ✅ 喜欢现代化工具链

### 社区

- GitHub Stars: 4k+
- 周下载量: 50k+
- 使用者：Vue 生态系统很多项目

---

## 方案 2：XO 🥈

> **最严格！** ESLint wrapper，开箱即用

### 特点

- ✅ **原生支持 ESLint 9**
- ✅ **捆绑大量插件**（unicorn、import、ava 等）
- ✅ **零配置**
- ✅ **非常严格的规则**
- ✅ **自动修复**
- ⚠️ **固执己见**（不太灵活）

### 代码风格

```typescript
// 单引号，分号（注意：有分号！）
const foo = 'bar'

// 强制大括号
if (condition) {
  return true
}

// 4 空格缩进（可配置为 2）
function test() {
  return true
}
```

### 配置示例

```javascript
// package.json
{
  "scripts": {
    "lint": "xo"
  },
  "xo": {
    "space": 2, // 改为 2 空格
    "prettier": true
  }
}
```

### 适用场景

- ✅ 喜欢严格规则
- ✅ 想要开箱即用
- ⚠️ 需要适应 4 空格（默认）
- ⚠️ 需要分号

### 社区

- GitHub Stars: 7.6k+
- 周下载量: 20k+
- 使用者：Sindre Sorhus（1000+ npm 包作者）维护

---

## 方案 3：typescript-eslint strict 🥉

> **官方方案！** TypeScript 官方严格配置

### 特点

- ✅ **官方维护**（typescript-eslint 团队）
- ✅ **原生支持 ESLint 9**
- ✅ **类型安全规则最全**
- ✅ **灵活可扩展**
- ⚠️ **需要自己组合插件**（Vue、Prettier 等）
- ⚠️ **配置较复杂**

### 代码风格

```typescript
// 不强制格式（需配合 Prettier）
const foo = 'bar'

// 强制明确类型
function greet(name: string): string {
  return `Hello ${name}`
}

// 禁止不安全的类型操作
const data: unknown = {}
// data.foo  // ❌ Error: unsafe member access
```

### 配置示例

```javascript
// servers/eslint.config.mjs
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      // 你的自定义规则
    },
  },
)
```

### 适用场景

- ✅ 追求类型安全
- ✅ TypeScript 深度使用者
- ✅ 需要灵活配置
- ⚠️ 需要自己组合生态

### 社区

- GitHub Stars: 15k+
- 周下载量: 30M+
- 使用者：TypeScript 官方推荐

---

## 方案 4：Standard

> **零配置风格** - 但更新较慢

### 特点

- ⚠️ **需要兼容层支持 ESLint 9**
- ✅ **零配置**
- ✅ **规则较宽松**
- 🔴 **更新缓慢**
- 🔴 **TypeScript 支持一般**

### 代码风格

```javascript
// 单引号，无分号，2 空格
const foo = 'bar'

// 强制大括号
if (condition) {
  return true
}
```

### 配置示例

```javascript
// 需要使用兼容层
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()

export default [...compat.extends('standard')]
```

### 适用场景

- ⚠️ 传统项目
- ⚠️ 不推荐新项目使用

---

## 详细对比

### 规则严格度对比

| 规则类别            | @antfu      | XO      | TS Strict   | Standard |
| ------------------- | ----------- | ------- | ----------- | -------- |
| TypeScript 类型安全 | 🟡 中等     | 🟢 严格 | 🔴 非常严格 | 🟢 宽松  |
| 代码格式            | 🟡 灵活     | 🟢 严格 | ⚪ 不管     | 🟡 中等  |
| 未使用变量          | 🟢 自动删除 | 🔴 报错 | 🔴 报错     | 🟡 警告  |
| 单行 if             | ✅ 允许     | ❌ 禁止 | ✅ 允许     | ❌ 禁止  |
| 分号                | ❌ 无       | ✅ 有   | ⚪ 不管     | ❌ 无    |

### 生态支持对比

| 生态     | @antfu  | XO      | TS Strict | Standard  |
| -------- | ------- | ------- | --------- | --------- |
| Vue 3    | 🟢 完美 | 🟡 基础 | 🟡 需配置 | 🟡 需配置 |
| NestJS   | 🟢 很好 | 🟢 很好 | 🟢 完美   | 🟡 一般   |
| Monorepo | 🟢 完美 | 🟢 支持 | 🟢 支持   | 🟡 基础   |
| Prettier | 🟢 兼容 | 🟢 兼容 | 🟢 兼容   | 🟢 兼容   |

### 学习曲线

```
简单 ←----------------------------------------→ 复杂
  Standard  →  @antfu  →  XO  →  TS Strict
```

---

## 我的推荐排序（针对你的项目）

### 🥇 第一推荐：@antfu/eslint-config

**理由：**

1. ✅ 完美支持 TypeScript + Vue 3
2. ✅ 配置最简单（3 行代码）
3. ✅ 积极维护，社区活跃
4. ✅ 规则现代且灵活
5. ✅ 改动小（保守配置下）

**预估工作量：** 2-4 小时
**改动规模：** 🟢 小（主要是 import 排序）

---

### 🥈 第二推荐：typescript-eslint strict

**理由：**

1. ✅ 官方方案，最权威
2. ✅ 类型安全最强
3. ✅ 灵活可定制
4. ⚠️ 配置较复杂（需要自己组合插件）

**预估工作量：** 4-6 小时
**改动规模：** 🟡 中（需要修复类型问题）

---

### 🥉 第三推荐：XO

**理由：**

1. ✅ 开箱即用，零配置
2. ✅ 捆绑大量实用插件
3. ⚠️ 使用分号（与你当前风格不同）
4. ⚠️ 规则非常严格，改动较大

**预估工作量：** 6-8 小时
**改动规模：** 🔴 大（格式风格变化）

---

## 最终建议

**我强烈推荐：@antfu/eslint-config**

配置方案：

```javascript
// 后端 - servers/eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: false,
  formatters: false, // 保留 Prettier
  lessOpinionated: false, // 采用社区最佳实践
}, {
  rules: {
    // 你的自定义规则（保留你喜欢的严格规则）
    '@typescript-eslint/no-explicit-any': 'error', // 从 warn 升级到 error
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  }
})

// 前端 - apps/web/eslint.config.ts
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true, // 启用 Vue 支持
  formatters: false,
  lessOpinionated: false,
}, {
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  }
})
```

**优势总结：**

- ✅ 2-4 小时完成迁移
- ✅ 改动小，风险低
- ✅ 获得现代化工具链
- ✅ 保留你的 Prettier 和严格规则
- ✅ 自动 import 排序（提升代码质量）

---

## 快速决策表

**选择 @antfu/eslint-config，如果你：**

- ✅ 想要现代化、简单配置
- ✅ 使用 Vue 3 + TypeScript
- ✅ 希望改动小、风险低
- ✅ 接受社区最佳实践

**选择 typescript-eslint strict，如果你：**

- ✅ 追求极致类型安全
- ✅ TypeScript 资深用户
- ✅ 愿意花时间配置
- ✅ 不介意较大改动

**选择 XO，如果你：**

- ✅ 喜欢极其严格的规则
- ✅ 接受使用分号
- ✅ 想要开箱即用
- ✅ 愿意大幅改动代码

---

## 参考资料

- [@antfu/eslint-config GitHub](https://github.com/antfu/eslint-config)
- [XO - JavaScript/TypeScript linter](https://github.com/xojs/xo)
- [typescript-eslint Strict Config](https://typescript-eslint.io/users/configs/)
- [StandardJS vs XO Comparison](https://tombye.github.io/eslint-config-compare/)
- [ESLint 9 Flat Config Tutorial](https://dev.to/aolyang/eslint-9-flat-config-tutorial-2bm5)
- [Modern Linting in 2025](https://advancedfrontends.com/eslint-flat-config-typescript-javascript/)
