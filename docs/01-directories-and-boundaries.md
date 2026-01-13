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
├─ servers/               # 后端服务（NestJS）
│  ├─ bff/                # BFF + 网关层（Nest monorepo）
│  │  ├─ apps/            # 后端应用集合（Nest 项目分组）
│  │  │  ├─ gateway/      # 对外 API 网关（统一入口：鉴权接入、路由、限流等）
│  │  │  ├─ web/          # 面向前台 Web 的 BFF
│  │  │  ├─ admin/        # 面向 Admin 的 BFF（RBAC 强校验 + 审计）
│  │  │  └─ mobile/       # 面向移动端的 BFF
│  │  └─ nest-cli.json    # Nest monorepo 配置
│  ├─ microservices/      # 领域微服务层（Nest monorepo）
│  │  ├─ apps/            # 后端应用集合（Nest 项目分组）
│  │  │  ├─ auth/         # 认证微服务：登录、token
│  │  │  ├─ rbac/         # 授权数据：角色/权限/策略
│  │  │  └─ user/         # 用户域
│  │  └─ nest-cli.json    # Nest monorepo 配置
│  ├─ libs/               # 仅后端使用的共享库
│  │  ├─ common/          # 例：异常/校验/traceId 等（server-only）
│  │  ├─ database/        # 例：数据库/ORM/迁移等（server-only）
│  │  └─ logger/          # 例：日志封装（server-only）
│  └─ jobs/               # 可选：定时任务 / 异步消费 worker（待实现）
│
├─ packages/              # 跨 apps/servers 的共享包（可被前端引用）
│  ├─ common/             # 跨端共享 types/工具/错误码等
│  ├─ config/             # 跨端共享配置/约定（不限定实现形式）
│  └─ ...                 # 其他可跨端复用的包（例如 contracts、sdk、types）
│
├─ docs/                  # 架构文档、ADR、接口约定
└─ scripts/               # 脚本（如生成代码、检查、发布辅助）
```

---

## 3. 共享边界（规则）

目标：既能复用能力，又避免把多个服务绑成“分布式单体”。

- 放在 `servers/libs/`：server-only（logger、Nest guard/interceptor、DB/observability 封装等）
- 放在 `packages/`：跨端可复用（DTO/契约、错误码、枚举、types、纯工具函数等）
- 避免共享：ORM Entity / Prisma Model（会把多个服务绑成“分布式单体”）

---

## 4. 当前进度说明（截至 2026-01-09）

- `servers/bff/apps/*`：BFF 与网关目录骨架已搭建
- `servers/microservices/apps/*`：微服务目录骨架已搭建（业务逻辑按域逐步完善）
- `apps/admin`、`apps/mobile`：前端应用目录已创建（待实现/占位）
