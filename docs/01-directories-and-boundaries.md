# 目录与边界（约定）

本文档用于说明本仓库的**目录职责**、**共享边界**与**命名约定**，减少“同名目录/同名概念”带来的误解。

---

## 1. 目录职责（约定）

> 用于消除命名歧义，避免“同名目录”导致误读。

- `apps/`：**前端应用**（对外 UI）。
- `servers/`：**后端应用与后端共享库**（对外 API、对内服务）。
  - `servers/*/apps/`：Nest monorepo 下的 **后端应用集合**（这里的 `apps` 属于 Nest 的项目分组，不是前端）。
- `packages/`：**跨端共享包**（前后端都能用，尽量保持“纯 TS / 无 Node-only 依赖”）。
- `servers/libs/`：**仅后端复用**（允许 Nest/Node/DB 等后端依赖）。

---

## 2. 顶层目录结构（当前约定）

```text
.
├─ apps/                  # 前端应用
│  ├─ web/                # 前台 Web（Vue 3 + Vite）
│  ├─ admin/              # Admin 前端（待实现/占位）
│  └─ mobile/             # 移动端前端（待实现/占位）
│
├─ servers/               # 后端服务（NestJS 单一 Monorepo）
│  ├─ apps/               # 所有后端应用（BFF + 微服务统一管理）
│  │  ├─ gateway/         # API 网关：统一入口（鉴权、路由、限流）
│  │  ├─ ma-web/          # BFF for Web：面向前台 Web 的后端适配
│  │  ├─ ma-admin/        # BFF for Admin：面向管理后台（RBAC 强校验 + 审计）
│  │  ├─ ma-mobile/       # BFF for Mobile：面向移动端的后端适配
│  │  ├─ ms-auth/         # 微服务：认证（登录、token、会话管理）
│  │  ├─ ms-rbac/         # 微服务：权限控制（角色、权限、策略）
│  │  └─ ms-user/         # 微服务：用户域（用户信息、用户管理）
│  ├─ libs/               # 仅后端使用的共享库
│  │  └─ shared/          # 共享工具：exception filters、interceptors、response service 等
│  ├─ nest-cli.json       # Nest monorepo 配置（管理所有 apps + libs）
│  ├─ tsconfig.json       # TypeScript 基础配置（路径别名：@app/shared 等）
│  ├─ package.json        # 后端依赖与脚本
│  └─ eslint.config.mjs   # ESLint 配置（使用 @antfu/eslint-config）
│
├─ packages/              # 跨 apps/servers 的共享包（可被前端引用）
│  └─ common/             # 跨端共享 types/工具/错误码等
│
├─ docs/                  # 架构文档、ADR、接口约定
├─ scripts/               # 脚本（如生成代码、检查、发布辅助）
├─ pnpm-workspace.yaml    # pnpm workspace 配置 + catalog 版本管理
├─ .editorconfig          # 编辑器配置（2空格、LF）
└─ prettier.config.cjs    # Prettier 配置（根目录，子项目自动继承）
```

**命名约定说明：**

- `ma-*`：Multi-App 或 Main-App 的 BFF 应用，按客户端分离（web/admin/mobile）
- `ms-*`：Microservice 微服务，按业务域分离（auth/rbac/user）
- `gateway`：API 网关，无前缀，作为统一入口

---

## 3. 共享边界（规则）

目标：既能复用能力，又避免把多个服务绑成“分布式单体”。

- 放在 `servers/libs/`：server-only（logger、Nest guard/interceptor、DB/observability 封装等）
- 放在 `packages/`：跨端可复用（DTO/契约、错误码、枚举、types、纯工具函数等）
- 避免共享：ORM Entity / Prisma Model（会把多个服务绑成“分布式单体”）

---

## 4. 当前进度说明（截至 2026-01-13）

- `servers/apps/*`：所有后端应用骨架已搭建（7个应用：1网关 + 3 BFF + 3微服务）
- `servers/libs/shared`：共享库基础结构已创建（exception filter、interceptor、response service）
- `pnpm workspace` + `catalog`：版本管理已配置（eslint、prettier、typescript 统一版本）
- `prettier.config.cjs`：Prettier 配置在根目录（所有子项目自动继承）
- `apps/web`：前端应用已搭建（Vue 3 + Vite）
- `apps/admin`、`apps/mobile`：前端应用目录已创建（待实现/占位）
