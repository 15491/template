# 架构文档索引

这份索引用于快速定位“目录职责 / 分层边界 / 权限模型 / 工具链 / 演进路线”等文档。

## 阅读顺序（建议）

1. [目录与边界（约定）](./01-directories-and-boundaries.md)
2. [后端分层与调用链（Gateway / BFF / Microservices）](./02-backend-layering.md)
3. [权限与审计（RBAC）](./03-rbac-audit.md)
4. [工程与工具链（pnpm workspace + Nest monorepo）](./04-tooling.md)
5. [演进路线（分阶段落地）](./05-roadmap.md)
6. [编码规范与最佳实践](./06-coding-standards.md)

## 关键约定（摘要）

- `apps/`：前端应用（Vue 3 + Vite）
- `servers/`：后端服务（NestJS 单一 monorepo）
- `servers/apps/gateway`：对外 API 网关入口
- `servers/apps/ma-*`：BFF 层（ma-web、ma-admin、ma-mobile）
- `servers/apps/ms-*`：微服务层（ms-auth、ms-rbac、ms-user）
- `packages/`：跨端共享（纯 TS、避免 Node-only 依赖）
- `servers/libs/`：仅后端复用（Nest/Node/DB 等后端依赖）
- `@template/config`：统一的 Prettier 配置（ESLint 使用 @antfu/eslint-config）
- `pnpm catalog`：统一版本管理（eslint、prettier、typescript）
