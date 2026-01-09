# 工程与工具链（pnpm workspace + Nest monorepo）

本文档说明：如何同时使用 `pnpm workspace` 与 Nest CLI 的 monorepo 模式，以及日常执行方式与边界约定。

---

## 1. 工具职责分工

你可以**同时**使用：

- `pnpm workspace`：负责依赖安装、跨包引用（`workspace:*`）、统一 lockfile、`--filter` 按包执行脚本。
- `Nest CLI monorepo`：负责把多个 Nest 应用/库作为一个 Nest 工作区来编排（统一 build/start/test 的项目选择）。

两者的关系是：**pnpm 管“包与依赖”，Nest CLI 管“Nest 项目编排”。**

---

## 2. 当前仓库结构（后端）

目前 `servers/` 采用 **BFF 与微服务分别独立 Nest monorepo** 的方式：

- `servers/bff/` 有独立的 `nest-cli.json`，管理多个后端应用（`apps/*`）
- `servers/microservices/` 有独立的 `nest-cli.json`，管理多个后端应用（`apps/*`）

目录职责与共享边界详见：[目录与边界（约定）](./01-directories-and-boundaries.md)

---

## 3. Nest 项目名与目录（建议固定映射）

> 这里的“项目名”指 `nest-cli.json` 里的 project name，方便团队沟通与脚本编排。

### 3.1 BFF / 网关层（`servers/bff`）

| Nest project | path | 说明 |
|---|---|---|
| `gateway` | `servers/bff/apps/gateway` | 对外 API 网关入口 |
| `web` | `servers/bff/apps/web` | 面向前台 Web 的 BFF |
| `admin` | `servers/bff/apps/admin` | 面向 Admin 的 BFF |
| `mobile` | `servers/bff/apps/mobile` | 面向移动端的 BFF |

### 3.2 微服务层（`servers/microservices`）

| Nest project | path | 说明 |
|---|---|---|
| `auth` | `servers/microservices/apps/auth` | 认证微服务 |
| `rbac` | `servers/microservices/apps/rbac` | RBAC 微服务 |
| `user` | `servers/microservices/apps/user` | 用户微服务 |

---

## 4. 推荐的日常使用方式

**方式 A（在各 monorepo 目录使用 Nest CLI）**

- 在 `servers/bff/` 目录执行：`nest start gateway --watch`
- 在 `servers/bff/` 目录执行：`nest start admin --watch`
- 在 `servers/microservices/` 目录执行：`nest start auth --watch`

**方式 B（使用 pnpm filter）**

- 在仓库根目录用 `pnpm --filter <pkgName> <script>` 执行（适用于存在对应 `package.json` 的 workspace 包）
- 示例（以仓库当前的后端包为例）：`pnpm --filter @template/bff start:dev`

---

## 5. 迁移边界（建议先定规则再动代码）

为了避免“名义 monorepo、实则各自为政”，建议逐步统一：

- `TypeScript` 基础配置（例如 `servers/tsconfig.base.json`，各项目 `extends`）
- 统一的构建输出目录约定（dist 结构一致，便于部署脚本）
- server-only 共享能力统一沉到 `servers/libs/*`（跨端共享仍然放 `packages/*`）