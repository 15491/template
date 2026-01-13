# ESLint 配置改进说明

**日期：** 2026-01-13
**版本：** 阶段 1 - 渐进式收紧
**影响范围：** 所有使用 `@template/config` 的项目

---

## 改进目标

1. 提高代码质量标准
2. 减少潜在 bug
3. 统一代码风格
4. 符合行业最佳实践

---

## 主要变更

### 1. TypeScript 类型安全规则

| 规则                                         | 之前  | 现在   | 说明                 |
| -------------------------------------------- | ----- | ------ | -------------------- |
| `@typescript-eslint/no-explicit-any`         | `off` | `warn` | 警告使用 `any` 类型  |
| `@typescript-eslint/no-unsafe-assignment`    | -     | `warn` | 警告不安全的赋值     |
| `@typescript-eslint/no-unsafe-member-access` | -     | `warn` | 警告不安全的成员访问 |
| `@typescript-eslint/no-unsafe-call`          | -     | `warn` | 警告不安全的函数调用 |
| `@typescript-eslint/no-unused-vars`          | -     | `warn` | 警告未使用的变量     |

**影响：**

- 使用 `any` 类型时会看到警告（不会阻止编译）
- 鼓励使用明确的类型定义
- 可以使用 `_` 前缀忽略未使用变量（如 `_unusedParam`）

### 2. 代码质量规则（新增）

| 规则           | 级别    | 说明                                       | 示例                                    |
| -------------- | ------- | ------------------------------------------ | --------------------------------------- |
| `no-console`   | `warn`  | 禁止 `console.log`（允许 `warn`、`error`） | ✅ `console.error()` ❌ `console.log()` |
| `no-debugger`  | `warn`  | 禁止 `debugger` 语句                       | ❌ `debugger;`                          |
| `no-alert`     | `error` | 禁止 `alert`、`confirm`、`prompt`          | ❌ `alert('hi')`                        |
| `prefer-const` | `error` | 优先使用 `const`（不可变引用）             | ✅ `const x = 1` ❌ `let x = 1`         |
| `no-var`       | `error` | 禁止使用 `var`                             | ✅ `let x` ❌ `var x`                   |

**影响：**

- 需要删除代码中的 `console.log`（用于调试）
- 不可变的变量必须使用 `const`
- 禁止使用 `var`

### 3. 代码风格规则（新增）

| 规则     | 级别    | 说明           | 示例                                |
| -------- | ------- | -------------- | ----------------------------------- |
| `curly`  | `error` | 强制使用大括号 | ✅ `if (x) { y() }` ❌ `if (x) y()` |
| `eqeqeq` | `error` | 强制使用 `===` | ✅ `x === y` ❌ `x == y`            |

**影响：**

- 所有 `if`、`for`、`while` 必须使用大括号
- 必须使用 `===` 和 `!==`（除了与 `null` 比较）

### 4. Vue 特定规则（新增）

| 规则                                    | 级别    | 说明                              |
| --------------------------------------- | ------- | --------------------------------- |
| `vue/component-api-style`               | `error` | 优先使用 `<script setup>`         |
| `vue/component-name-in-template-casing` | `error` | 组件标签使用 PascalCase           |
| `vue/custom-event-name-casing`          | `error` | 自定义事件使用 camelCase          |
| `vue/define-macros-order`               | `error` | `defineProps` 在 `defineEmits` 前 |
| `vue/no-unused-components`              | `warn`  | 警告未使用的组件                  |
| `vue/require-prop-types`                | `warn`  | Props 应有类型定义                |

**影响：**

- 组件应使用 `<script setup>` 语法
- 模板中组件标签使用大驼峰：`<UserProfile />` 而非 `<user-profile />`

---

## 如何应对

### 1. 自动修复

大部分规则可以自动修复：

```bash
# 修复所有后端代码
cd servers
pnpm lint

# 修复前端代码
pnpm --filter @template/web lint
```

### 2. 手动修复常见问题

#### 问题 1：`any` 类型警告

```typescript
// ❌ 之前
function process(data: any) {
  return data.value
}

// ✅ 现在
function process(data: unknown) {
  if (isValidData(data)) {
    return data.value
  }
}

// 或使用泛型
function process<T>(data: T) {
  return data
}
```

#### 问题 2：`console.log` 警告

```typescript
// ❌ 之前
console.log('Debug info:', data)

// ✅ 现在 - 选项 1：使用 logger
this.logger.debug('Debug info:', data)

// ✅ 现在 - 选项 2：使用 console.error（仅用于错误）
console.error('Error:', error)

// ✅ 现在 - 选项 3：使用 eslint-disable（临时调试）
// eslint-disable-next-line no-console
console.log('Temporary debug')
```

#### 问题 3：缺少大括号

```typescript
// ❌ 之前
if (condition) return true

// ✅ 现在
if (condition) {
  return true
}
```

#### 问题 4：使用 `==` 而非 `===`

```typescript
// ❌ 之前
if (x == y) {
}

// ✅ 现在
if (x === y) {
}

// ✅ 与 null/undefined 比较仍可使用 ==
if (x == null) {
} // 等同于 x === null || x === undefined
```

#### 问题 5：Vue 组件标签

```vue
<!-- ❌ 之前 -->
<template>
  <user-profile />
  <my-button />
</template>

<!-- ✅ 现在 -->
<template>
  <UserProfile />
  <MyButton />
</template>
```

### 3. 临时禁用规则（不推荐）

如果确实需要，可以临时禁用：

```typescript
// 单行禁用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = {}

// 整个文件禁用（非常不推荐）
/* eslint-disable @typescript-eslint/no-explicit-any */
```

---

## 迁移策略

### 阶段 1：适应期（当前，2 周）

- 所有新代码必须通过 ESLint 检查
- 旧代码的警告可以暂时忽略
- 重点关注 `error` 级别的问题

### 阶段 2：清理期（2 周后）

- 逐步修复现有代码的警告
- 将 `@typescript-eslint/no-explicit-any` 从 `warn` 改为 `error`

### 阶段 3：严格期（1 个月后）

- 考虑启用更多严格规则
- 可能采用 `@antfu/eslint-config` 等更严格的配置

---

## 常见问题

### Q: 为什么禁止 `console.log`？

**A:**

- 生产环境不应有调试信息
- 应使用专业的日志库（如 `winston`、`pino`）
- 避免敏感信息泄露

### Q: 可以继续使用 `any` 吗？

**A:**

- 可以，但会有警告
- 鼓励使用 `unknown`、泛型或明确的类型
- 如果确实需要，使用 `// eslint-disable-next-line` 注释说明原因

### Q: 如何临时关闭 ESLint？

**A:**

```typescript
// 单行
// eslint-disable-next-line rule-name

// 多行
/* eslint-disable rule-name */
// 代码...
/* eslint-enable rule-name */
```

### Q: 老项目代码太多，无法全部修复怎么办？

**A:**

- 新代码必须符合规范
- 旧代码可以逐步修复
- 可以在根目录 `.eslintignore` 中暂时排除某些文件

---

## 配置文件位置

- Node/NestJS: `packages/config/eslint/node.mjs`
- Vue: `packages/config/eslint/vue.mjs`
- 使用示例: `servers/eslint.config.mjs`、`apps/web/eslint.config.ts`

---

## 相关文档

- [编码规范文档](./06-coding-standards.md)
- [ESLint 官方文档](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Vue ESLint Plugin](https://eslint.vuejs.org/)

---

## 反馈与建议

如果对这些规则有疑问或建议，请：

1. 在团队会议中提出
2. 创建 Issue 讨论
3. 提出更合理的替代方案
