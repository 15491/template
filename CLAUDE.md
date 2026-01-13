# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供代码库工作指引。

## 项目概述

这是一个结合 **pnpm workspace** 和 **NestJS 微服务架构**的**混合 monorepo**。仓库实现了分层后端系统（Gateway → BFF → Microservices）与多个前端应用。

**核心架构模式：**

- **Gateway（网关）**：所有客户端请求的统一入口（鉴权、限流、路由）
- **BFF（Backend for Frontend）**：按客户端定制的适配层（web/admin/mobile 有不同的 DTOs 和权限）
- **Microservices（微服务）**：具有明确边界的领域逻辑（auth、rbac、user）

## 核心命令

### 根目录操作

```bash
# 安装依赖
pnpm install

# 格式化整个代码库
pnpm format
pnpm format:check  # CI 检查（不写入）

# 格式化特定部分
pnpm format:servers
pnpm format:apps
```

### 前端开发（Vue 3 + Vite）

```bash
# 开发服务器（apps/web）
pnpm --filter @template/web dev

# 构建与类型检查
pnpm --filter @template/web build
pnpm --filter @template/web type-check

# 代码检查与格式化
pnpm --filter @template/web lint
pnpm --filter @template/web format
```

### 后端开发（NestJS）

```bash
# 进入 servers/ 目录
cd servers

# 开发模式（监听文件变化）
nest start gateway --watch
nest start ma-web --watch
nest start ms-auth --watch

# 或使用 package scripts
pnpm start:dev    # 默认应用
pnpm start:debug  # 调试模式

# 构建与生产环境
pnpm build
pnpm start:prod

# 代码检查
pnpm lint

# 测试
pnpm test              # 所有单元测试
pnpm test:watch        # 监听模式
pnpm test:cov          # 覆盖率报告
pnpm test:e2e          # E2E 测试
```

### 针对特定包执行命令

```bash
# 在特定 workspace 中运行命令
pnpm --filter @template/web <command>
pnpm -C apps/web <command>  # 替代语法

# 在 servers 中运行
pnpm -C servers <command>
```

## 架构：核心概念

### 目录结构与边界

```
template/
├── apps/                    # 前端应用（Vue 3）
│   ├── web/                 # 主 Web UI
│   ├── admin/               # 管理后台（占位）
│   └── mobile/              # 移动端应用（占位）
├── servers/                 # 后端 monorepo（NestJS）
│   ├── apps/                # 所有后端应用
│   │   ├── gateway/         # API 网关 - 统一入口
│   │   ├── ma-web/          # Web 客户端的 BFF
│   │   ├── ma-admin/        # 管理后台的 BFF（更严格的 RBAC）
│   │   ├── ma-mobile/       # 移动端的 BFF（优化的负载）
│   │   ├── ms-auth/         # 微服务：认证
│   │   ├── ms-rbac/         # 微服务：权限控制
│   │   └── ms-user/         # 微服务：用户域
│   └── libs/
│       └── shared/          # 仅后端共享代码
├── packages/                # 跨端共享包
│   └── common/              # 共享类型/工具
└── docs/                    # 架构文档
```

**关键边界规则：**

- **`servers/libs/`**：仅后端代码（可使用 NestJS、Node.js、ORM）
- **`packages/`**：跨端代码（避免后端特定依赖）
- **禁止跨服务共享 ORM 实体** - 防止分布式单体反模式

### 后端请求流程

```
客户端（Web/Admin/Mobile）
  ↓
Gateway（apps/gateway）
  - 统一路由
  - 鉴权
  - 限流
  ↓
BFF 层（apps/ma-*）
  - 客户端特定的聚合
  - DTO 转换
  - 客户端特定的鉴权策略
  ↓
微服务（apps/ms-*）
  - 领域逻辑
  - 数据一致性
  - 业务规则
```

**BFF 设计原则**：保持 BFF "薄" - 它们聚合和适配，但不实现业务规则。业务逻辑属于微服务。

### NestJS Monorepo 配置

**文件：`servers/nest-cli.json`**

在单一配置中管理 7 个应用 + 2 个库：

- **应用**：gateway、ma-web、ma-admin、ma-mobile、ms-auth、ms-rbac、ms-user
- **库**：libs、shared

**关键特性：**

- 使用 **SWC 编译器**（比 tsc 更快）
- TypeScript 路径别名：`@app/libs`、`@app/shared`
- 每个应用有自己的 `tsconfig.app.json`

**创建新的 NestJS 应用/库：**

```bash
cd servers
nest generate app <name>      # 新应用
nest generate library <name>  # 新库
nest generate module <name> --project <app>  # 在特定应用中创建模块
```

**重要**：在 Windows 上生成的文件会有 CRLF 行尾符。运行 `pnpm format` 转换为 LF。

### pnpm Workspace + Catalog

**文件：`pnpm-workspace.yaml`**

`catalog` 功能集中管理共享工具的版本：

```yaml
catalog:
  eslint: 9.39.2
  prettier: 3.7.4
  typescript: 5.9.3
  # ... 更多
```

在 `package.json` 中引用：

```json
{
  "devDependencies": {
    "eslint": "catalog:",
    "prettier": "catalog:"
  }
}
```

**优势**：在 `pnpm-workspace.yaml` 中修改一次版本，所有包自动更新。

### 共享配置架构

**Prettier 配置**：

使用根目录的 `prettier.config.cjs` 直接定义配置，所有子项目自动继承：

```javascript
// prettier.config.cjs（根目录）
/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  endOfLine: 'lf',
}
```

**ESLint 配置：** 使用 `@antfu/eslint-config` 直接配置，不再使用共享工厂函数。

```javascript
// 后端 - servers/eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: false,
  formatters: false,  // 继续使用 Prettier
})

// 前端 - apps/web/eslint.config.ts
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: false,
})
```

**添加共享配置时：**

1. **Prettier**：直接修改根目录的 `prettier.config.cjs`（所有子项目自动继承）
2. **ESLint**：直接修改各项目的 `eslint.config.mjs` 或 `eslint.config.ts`
3. 如需要，更新 `pnpm-workspace.yaml` catalog 中的版本
4. 运行 `pnpm install` 传播更改

## 代码风格标准

- **缩进**：2 空格（EditorConfig 强制）
- **行尾符**：LF（EditorConfig + Prettier 强制）
- **引号**：单引号（Prettier）
- **分号**：禁用（Prettier）
- **打印宽度**：100 列（Prettier）
- **尾随逗号**：全部（Prettier）

**ESLint**：使用 flat config（无 `.eslintrc`）。使用 `@antfu/eslint-config` 进行配置。

## TypeScript 模块解析

**后端（servers/tsconfig.json）：**

```json
{
  "paths": {
    "@app/libs": ["libs/libs/src"],
    "@app/libs/*": ["libs/libs/src/*"],
    "@app/shared": ["libs/shared/src"],
    "@app/shared/*": ["libs/shared/src/*"]
  }
}
```

**前端**：路径别名在 Vite 配置中按应用配置。

## 测试策略

**后端（Jest）：**

- 测试文件：`**/*.spec.ts`
- Jest 配置在 `servers/package.json`
- 模块映射与 TypeScript 路径对齐
- 覆盖率输出：`servers/coverage/`

**运行测试：**

```bash
cd servers
pnpm test                    # 所有测试
pnpm test -- <file-pattern> # 特定测试
pnpm test:watch             # 监听模式
pnpm test:cov               # 带覆盖率
```

## 文档结构

**建议阅读顺序：**

1. `docs/01-directories-and-boundaries.md` - 目录与边界
2. `docs/02-backend-layering.md` - Gateway/BFF/微服务流程
3. `docs/03-rbac-audit.md` - 权限模型
4. `docs/04-tooling.md` - pnpm + NestJS 集成
5. `docs/05-roadmap.md` - 演进计划

## 常见开发工作流

### 添加新的后端功能

1. 确定层级（BFF vs 微服务）
2. 创建模块：`cd servers && nest g module <name> --project <app>`
3. 添加 controller、service、DTOs
4. 实现的同时添加测试
5. 如需要，更新 `packages/common/` 中的共享类型
6. 提交前运行 `pnpm format`

### 添加新的前端组件

1. 在 `apps/web/src/components/` 中创建组件
2. 在视图中导入和使用
3. 运行 `pnpm --filter @template/web lint`
4. 使用 `pnpm --filter @template/web dev` 测试

### 更新共享配置

1. **Prettier**：修改根目录 `prettier.config.cjs`（所有子项目自动继承）
2. **ESLint**：直接修改各项目的 `eslint.config.mjs` 或 `eslint.config.ts`
3. 如需要，更新 `pnpm-workspace.yaml` catalog 中的版本
4. 运行 `pnpm install` 传播更改
5. 在各包中使用 `pnpm format` 和 `pnpm lint` 测试

### 创建新的微服务

1. `cd servers && nest generate app ms-<domain>`
2. 定义清晰的领域边界（阅读 `docs/02-backend-layering.md`）
3. 更新 `servers/nest-cli.json`（CLI 自动更新）
4. 根据需要添加到 BFF 层
5. **不要在服务间共享数据库模型**

## Git 与提交规范

遵循 **Conventional Commits**：

```
feat: 添加用户资料端点
feat(bff): 实现 web 特定的缓存
fix(ms-auth): 修正 token 过期逻辑
docs: 更新架构图
```

**PR 要求：**

- 清晰的 what/why 说明
- 可复现/验证步骤
- 前端变更需附带 UI 截图

## 技术栈总结

| 层级        | 技术栈                                     | 关键工具                   |
| ----------- | ------------------------------------------ | -------------------------- |
| 前端        | Vue 3, Vite, Pinia, Vue Router, TypeScript | `vite dev`, `vue-tsc`      |
| Gateway/BFF | NestJS 11, Express, TypeScript, RxJS       | `nest start --watch`       |
| 微服务      | NestJS 11, Express, TypeScript             | `nest start <app>`         |
| 构建        | pnpm workspace, NestJS CLI, SWC            | `pnpm build`               |
| 测试        | Jest, ts-jest                              | `pnpm test`                |
| 代码质量    | ESLint (flat), Prettier, EditorConfig      | `pnpm format`, `pnpm lint` |

## 重要文件参考

- `pnpm-workspace.yaml` - Workspace 包和版本 catalog
- `servers/nest-cli.json` - NestJS monorepo 项目
- `servers/tsconfig.json` - TypeScript 基础配置和路径别名
- `prettier.config.cjs` - 共享 Prettier 配置（根目录）
- `.editorconfig` - 编辑器设置（2 空格，LF）
- `AGENTS.md` - 开发者指南（中文）
- `docs/ARCHITECTURE.md` - 文档索引

## Node.js 版本

要求：`^20.19.0 || >=22.12.0`

检查：`node --version`

## 包管理器

**pnpm 10.17.0**（通过 `packageManager` 字段强制）

安装：`npm install -g pnpm@10.17.0`
