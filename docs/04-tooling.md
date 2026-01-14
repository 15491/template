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

目前 `servers/` 采用 **单一 Nest monorepo** 的方式，所有后端应用（BFF + 微服务）在同一个 Nest 工作区中管理：

- `servers/nest-cli.json` 统一管理所有后端应用（`apps/*`）和共享库（`libs/*`）
- 所有 BFF 应用和微服务共享同一套构建配置和 TypeScript 路径别名
- 使用命名前缀区分应用类型：
  - `ma-*`：BFF 应用（ma-web、ma-admin、ma-mobile）
  - `ms-*`：微服务（ms-auth、ms-rbac、ms-user）
  - `gateway`：API 网关（统一入口）

目录职责与共享边界详见：[目录与边界（约定）](./01-directories-and-boundaries.md)

---

## 3. Nest 项目名与目录（当前配置）

> 这里的"项目名"指 `nest-cli.json` 里的 project name，方便团队沟通与脚本编排。

| Nest project | path                     | 类型     | 说明                                    |
| ------------ | ------------------------ | -------- | --------------------------------------- |
| `gateway`    | `servers/apps/gateway`   | API 网关 | 对外统一入口（鉴权、路由、限流）        |
| `ma-web`     | `servers/apps/ma-web`    | BFF      | 面向前台 Web 的后端适配                 |
| `ma-admin`   | `servers/apps/ma-admin`  | BFF      | 面向管理后台的后端适配（RBAC 强校验）   |
| `ma-mobile`  | `servers/apps/ma-mobile` | BFF      | 面向移动端的后端适配                    |
| `ms-auth`    | `servers/apps/ms-auth`   | 微服务   | 认证服务（登录、token、会话管理）       |
| `ms-rbac`    | `servers/apps/ms-rbac`   | 微服务   | 权限控制服务（角色、权限、策略）        |
| `ms-user`    | `servers/apps/ms-user`   | 微服务   | 用户域服务（用户信息、用户管理）        |
| `shared`     | `servers/libs/shared`    | 共享库   | 后端共享工具（filters、interceptors等） |

---

## 4. 推荐的日常使用方式

**方式 A（在 servers/ 目录使用 Nest CLI）**

```bash
cd servers

# 启动网关（开发模式）
nest start gateway --watch

# 启动 Web BFF
nest start ma-web --watch

# 启动认证微服务
nest start ms-auth --watch

# 构建所有项目
nest build

# 构建特定项目
nest build ma-admin

# 测试
pnpm test
pnpm test:watch
```

**方式 B（使用 pnpm filter）**

```bash
# 在仓库根目录执行

# 启动 servers 开发模式
pnpm --filter servers start:dev

# 运行 servers 测试
pnpm --filter servers test

# 构建 servers
pnpm --filter servers build
```

**方式 C（直接在 servers/ 目录使用 pnpm）**

```bash
cd servers

# 使用 package.json 中的脚本
pnpm start:dev
pnpm build
pnpm lint
pnpm test
```

---

## 5. 配置统一与版本管理

### 5.1 pnpm Catalog（版本管理）

项目使用 pnpm catalog 功能统一管理代码质量工具的版本（`pnpm-workspace.yaml`）：

```yaml
catalog:
  eslint: 9.39.2
  prettier: 3.7.4
  typescript: 5.9.3
  '@eslint/js': 9.39.2
  eslint-config-prettier: 10.0.1
  eslint-plugin-prettier: 5.2.2
  globals: 16.0.0
  typescript-eslint: 8.20.0
```

在各包的 `package.json` 中使用：

```json
{
  "devDependencies": {
    "eslint": "catalog:",
    "prettier": "catalog:",
    "typescript": "catalog:"
  }
}
```

**优势**：

- 所有包使用相同版本的工具，避免版本不一致
- 升级工具时只需修改 `pnpm-workspace.yaml` 一处
- 自动应用到所有引用了 `catalog:` 的包

### 5.2 共享配置管理

项目使用根目录的配置文件统一管理代码风格。各子项目自动继承根目录配置。

**ESLint 配置（Node.js/NestJS）：**

```javascript
// servers/eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    typescript: true,
    vue: false,
    node: true,
    formatters: false, // 继续使用 Prettier
  },
  {
    rules: {
      // 自定义严格规则
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      // ... 其他规则
    },
  },
)
```

**ESLint 配置（Vue）：**

```javascript
// apps/web/eslint.config.ts
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    formatters: false, // 继续使用 Prettier
  },
  {
    rules: {
      // Vue 特定规则
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // ... 其他规则
    },
  },
)
```

**Prettier 配置：**

所有子项目自动继承根目录的 `prettier.config.cjs`：

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

### 5.3 TypeScript 配置

`servers/tsconfig.json` 定义路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@app/libs": ["libs/libs/src"],
      "@app/libs/*": ["libs/libs/src/*"],
      "@app/shared": ["libs/shared/src"],
      "@app/shared/*": ["libs/shared/src/*"]
    }
  }
}
```

各应用的 `tsconfig.app.json` 继承基础配置：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/apps/ma-web"
  },
  "include": ["src/**/*"]
}
```

---

## 6. 迁移边界与演进建议

当前已完成：

- ✅ 单一 Nest monorepo 结构（所有应用在 `servers/apps/`）
- ✅ TypeScript 路径别名配置（`@app/shared` 等）
- ✅ pnpm catalog 版本管理
- ✅ 统一的 Prettier 和 ESLint 配置（根目录 + 子项目）
- ✅ 统一的 EditorConfig 配置

建议后续完善：

- 📋 完善 `servers/libs/shared` 的功能（logger、database、common utils）
- 📋 建立统一的错误码和响应格式
- 📋 配置 pre-commit hooks（husky + lint-staged）
- 📋 建立 E2E 测试框架
- 📋 配置 Docker 和 CI/CD 流程
