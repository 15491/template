# 项目架构设计（Monorepo / NestJS / REST / 3 个 BFF）

本文是“目录级”的整体架构设计：在你当前仓库结构基础上，给出推荐的顶层目录、`servers/` 的拆分方式、以及 `packages/` 的共享边界。

> 目标：同一套后端能力同时支持 **前台 Web**、**Admin 后台**、**移动端**；前期可快速落地，后期可平滑演进为微服务。

---

## 1. 顶层目录（建议）

```text
.
├─ apps/                  # 前端应用
│  ├─ web/                # 前台 Web（Vue 3 + Vite）
│  ├─ admin/              # Admin 后台（待实现）
│  └─ mobile/             # 移动端（待实现）
│
├─ servers/               # 后端服务（NestJS）
│  ├─ bff/                # BFF 层（Nest monorepo）
│  │  ├─ apps/            # BFF 应用集合
│  │  │  ├─ web/          # 面向前台 Web 的 BFF
│  │  │  ├─ admin/        # 面向 Admin 的 BFF（RBAC 强校验 + 审计）
│  │  │  └─ mobile/       # 面向移动端的 BFF
│  │  └─ nest-cli.json    # Nest monorepo 配置
│  ├─ libs/               # 仅后端使用的共享库
│  │  ├─ common/          # logger、exception、validation、traceId 等（server-only）
│  │  └─ ...              # 其他 server-only 库（例如 db、observability）
│  ├─ microservices/      # 领域微服务层（Nest monorepo）
│  │  ├─ apps/            # 微服务应用集合（⚠️ 当前仅搭建骨架，业务逻辑待实现）
│  │  │  ├─ auth/         # 身份认证：登录、token
│  │  │  ├─ rbac/         # 授权数据：角色/权限/策略
│  │  │  ├─ user/         # 用户域
│  │  │  ├─ catalog/      # 商品/内容域（待添加）
│  │  │  └─ orders/       # 订单域（待添加）
│  │  └─ nest-cli.json    # Nest monorepo 配置
│  └─ jobs/               # 可选：定时任务 / 异步消费 worker（待实现）
│
├─ packages/              # 跨 apps/servers 的共享包（可被前端引用）
│  ├─ config/             # 共享配置
│  ├─ contracts/          # DTO/错误码/分页模型/接口契约（待建设）
│  └─ ...                 # 其他可跨端复用的包（例如 ui、sdk、types）
│
├─ docs/                  # 架构文档、ADR、接口约定
└─ scripts/               # 脚本（如生成代码、检查、发布辅助）
```

> ⚠️ **当前进度说明**：
> - `servers/bff/apps/*`：BFF 层骨架已搭建，可正常启动
> - `servers/microservices/apps/*`：微服务骨架已搭建，但业务逻辑尚未实现，后续将按业务域逐步完善
> - `apps/admin`、`apps/mobile`：前端应用目录已创建，待实现

说明：
- `apps/*` 代表“前端应用”，`servers/*` 代表“后端服务”，`packages/*` 代表“跨项目共享代码”。
- `docs/` 不放部署方案也可以；这里只建议放“契约/约定/ADR”，便于团队协作。

---

## 2. `servers/` 设计（3 个 BFF + 领域服务）

### 2.1 总体原则

- **按客户端拆 BFF（边缘层）**：Web / Admin / Mobile 的接口形状、聚合编排、权限与审计不同，差异放在 BFF。
- **按业务域拆服务（领域层）**：用户、订单、商品等稳定能力下沉到领域服务，避免被页面/端侧需求拖着走。
- **BFF 保持“薄”**：聚合编排、DTO 适配、缓存/限流、鉴权接入；不沉业务规则。
- **领域服务是“真相来源”**：业务规则、数据一致性、写模型由领域服务负责；BFF 不直连数据库。

### 2.2 请求流（同步 REST 调用为主）

```text
Web / Admin / Mobile
        |
        v
   BFF (REST)
   - 鉴权接入
   - 聚合编排
   - DTO 适配
        |
        v
领域服务 (内部 REST)
   - 业务规则
   - 数据读写
```

---

## 3. Admin 的 RBAC 放置（推荐）

- `services/auth`：身份认证（登录、签发/刷新 token）
- `services/rbac`：授权数据（角色/权限/策略）管理与查询
- `bff-admin`：对每个管理端路由做强制权限校验（并可加操作审计）

RBAC 基础建模建议：
- `Permission`: `order:read` / `order:write` 等
- `Role`: `ops` / `admin` 等
- `UserRole`、`RolePermission` 两张关系表

---

## 4. `servers/libs/` 与 `packages/` 的共享边界（避免边界失效）

建议共享“工程能力”，避免共享“领域数据结构”：

- 放在 `servers/libs/`：server-only（logger、Nest guard/interceptor、DB/observability 封装等）
- 放在 `packages/`：跨端可复用（DTO/契约 `contracts`、错误码、枚举、前端可用的 types）
- 避免共享：ORM Entity / Prisma Model（会把多个服务绑成“分布式单体”）

---

## 5. 分阶段落地（不一开始拆太细）

- 阶段 1：3 个 BFF + 2~4 个核心领域服务（例如 `auth(+rbac)`、`users`、`orders`、`catalog`）
- 阶段 2：当发布/性能/团队协作出现瓶颈，再继续拆分 `files`、`notifications`、`payments` 等

---

## 6. Monorepo 工具链：`pnpm workspace` + `Nest CLI monorepo`（建议）

你可以**同时**使用：
- `pnpm workspace`：负责依赖安装、跨包引用（`workspace:*`）、统一 lockfile、`--filter` 按包执行脚本。
- `Nest CLI monorepo`：负责把多个 Nest 应用/库作为一个 Nest 工作区来编排（统一 build/start/test 的项目选择）。

两者的关系是：**pnpm 管“包与依赖”，Nest CLI 管“Nest 项目编排”。**

### 6.1 当前仓库结构

目前 `servers/` 采用 **BFF 与微服务分别独立 Nest monorepo** 的方式：
- `servers/bff/` 有独立的 `nest-cli.json`，管理 `apps/admin`、`apps/web`、`apps/mobile` 三个 BFF 应用
- `servers/microservices/` 有独立的 `nest-cli.json`，管理 `apps/auth`、`apps/rbac`、`apps/user` 等微服务应用
- `pnpm-workspace.yaml` 已把相关目录纳入 workspace

### 6.2 当前目录结构

```text
servers/
  bff/
    nest-cli.json        # BFF 层 Nest monorepo 配置
    apps/
      admin/             # BFF-Admin
      web/               # BFF-Web
      mobile/            # BFF-Mobile
  microservices/
    nest-cli.json        # 微服务层 Nest monorepo 配置
    apps/
      auth/              # 认证微服务
      rbac/              # RBAC 微服务
      user/              # 用户微服务
  libs/
    common/              # 后端共享库
```

每个 Nest monorepo（`bff/` 和 `microservices/`）都有独立的 `nest-cli.json`，通过 `projects` 配置管理其下的应用。

建议固定一套"项目名（Nest project） <-> 包名（pnpm package） <-> 目录"的映射，便于沟通与脚本编排：

| Nest project | pnpm package name | path | 状态 |
|---|---|---|---|
| `admin` | `@project-template/bff-admin` | `servers/bff/apps/admin` | ✅ 骨架已搭建 |
| `web` | `@project-template/bff-web` | `servers/bff/apps/web` | ✅ 骨架已搭建 |
| `mobile` | `@project-template/bff-mobile` | `servers/bff/apps/mobile` | ✅ 骨架已搭建 |
| `auth` | `@project-template/ms-auth` | `servers/microservices/apps/auth` | ⚠️ 骨架已搭建，业务待实现 |
| `rbac` | `@project-template/ms-rbac` | `servers/microservices/apps/rbac` | ⚠️ 骨架已搭建，业务待实现 |
| `user` | `@project-template/ms-user` | `servers/microservices/apps/user` | ⚠️ 骨架已搭建，业务待实现 |
| `server-common` | `@project-template/server-common` | `servers/libs/common` | ✅ 可用 |

`servers/bff/nest-cli.json` 示例：

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "monorepo": true,
  "root": "apps/admin",
  "sourceRoot": "apps/admin/src",
  "projects": {
    "admin": {
      "type": "application",
      "root": "apps/admin",
      "entryFile": "main",
      "sourceRoot": "apps/admin/src"
    },
    "web": {
      "type": "application",
      "root": "apps/web",
      "entryFile": "main",
      "sourceRoot": "apps/web/src"
    },
    "mobile": {
      "type": "application",
      "root": "apps/mobile",
      "entryFile": "main",
      "sourceRoot": "apps/mobile/src"
    }
  }
}
```

### 6.3 推荐的日常使用方式

**方式 A（在各 monorepo 目录使用 Nest CLI）**
- 在 `servers/bff/` 目录执行：`nest start admin --watch`
- 在 `servers/microservices/` 目录执行：`nest start auth --watch`

**方式 B（使用 pnpm filter）**
- 在仓库根目录用 `pnpm --filter <pkgName> <script>` 执行
- 例如：`pnpm --filter @project-template/bff-admin start:dev`

### 6.4 迁移边界（建议先定规则再动代码）

为了避免"名义 monorepo、实则各自为政"，建议逐步统一：
- `TypeScript` 基础配置（例如 `servers/tsconfig.base.json`，各项目 `extends`）
- 统一的构建输出目录约定（dist 结构一致，便于部署脚本）
- server-only 共享能力统一沉到 `servers/libs/*`（跨端共享仍然放 `packages/*`）
