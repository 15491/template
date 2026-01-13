# 架构文档索引

这份索引用于快速定位“目录职责 / 分层边界 / 权限模型 / 工具链 / 演进路线”等文档。

## 阅读顺序（建议）

1. [目录与边界（约定）](./01-directories-and-boundaries.md)
2. [后端分层与调用链（Gateway / BFF / Microservices）](./02-backend-layering.md)
3. [权限与审计（RBAC）](./03-rbac-audit.md)
4. [工程与工具链（pnpm workspace + Nest monorepo）](./04-tooling.md)
5. [演进路线（分阶段落地）](./05-roadmap.md)

## 关键约定（摘要）

- `apps/`：前端应用。
- `servers/`：后端应用与后端共享库。
- `servers/bff/apps/gateway`：对外 API 网关入口。
- `packages/`：跨端共享（尽量纯 TS、避免 Node-only 依赖）。
- `servers/libs/`：仅后端复用（允许 Nest/Node/DB 等后端依赖）。
