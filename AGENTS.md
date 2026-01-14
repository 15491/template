# Repository Guidelines

## 项目结构与模块组织

- `apps/web/`：Vue 3 + Vite 前端（`src/`、`public/`）。
- `servers/bff/`：NestJS BFF/网关层（`apps/gateway`、`apps/web`、`apps/admin`、`apps/mobile`）。
- `servers/microservices/`：NestJS 微服务层（`apps/auth`、`apps/rbac`、`apps/user`）。
- `servers/libs/`：仅后端共享代码（如 Prisma/DB：`servers/libs/database/`）。
- `packages/common/`：跨端共享代码（类型、工具等）。
- `docs/`：架构与边界约定（建议从 `docs/ARCHITECTURE.md` 开始）。

## 构建、测试与本地开发命令

- 安装依赖：`pnpm install`（仓库使用 `pnpm@10.17.0`）。
- 启动 Web：`pnpm --filter @template/web dev`（或 `pnpm -C apps/web dev`）。
- Web 构建/类型检查：`pnpm --filter @template/web build`、`pnpm --filter @template/web type-check`。
- 启动 BFF（watch）：`pnpm --filter @template/bff start:dev`。
- 启动微服务（watch）：`pnpm -C servers/microservices start:dev`（或在目录内 `nest start auth --watch`）。
- Lint/格式化：`pnpm --filter @template/web lint`、`pnpm --filter @template/bff lint`、`pnpm --filter @template/web format`。

## 代码风格与命名约定

- 基础格式：2 空格缩进、LF 换行、去除行尾空格（见 `.editorconfig`）。
- Prettier：单引号、无分号、`printWidth: 100`（见根目录 `prettier.config.cjs`）。
- ESLint：使用 `@antfu/eslint-config`（各项目有独立的 eslint.config 文件）；优先通过 `pnpm <pkg> lint` 自动修复。
- 命名：目录保持小写（例如 `servers/microservices/apps/user/`），避免随意调整公共导出 API。

## 测试指南

- Nest 应用使用 Jest：单测文件 `**/*.spec.ts`；覆盖率与 e2e 由脚本提供。
- 常用命令：`pnpm -C servers/bff test`、`test:watch`、`test:e2e`、`test:cov`（`servers/microservices/` 同理）。
- 新增接口/服务：同 PR 内补齐对应测试用例，优先放在所属 app 的 `apps/<app>/` 下。

## 提交与 PR 规范

- 提交信息遵循 Conventional Commits（历史中常见）：`feat: ...`、`fix: ...`、`docs: ...`（可选 scope：`feat(bff): ...`）。
- PR 必须包含：变更说明（what/why）、可复现的验证步骤（明确命令）、UI 改动附截图（`apps/web/`）。

## 安全与配置提示

- 不要提交真实密钥或生产连接串；`.env` 仅用于本地开发，新增必需变量请同步提供脱敏的 `.env.example`。
