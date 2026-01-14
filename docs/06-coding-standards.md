# 编码规范与最佳实践

本文档统一说明代码风格、文件命名、模块组织、导入导出等编码规范。

---

## 1. 代码风格规范

### 1.1 基础格式（自动化）

**工具强制：**

- **EditorConfig**：2 空格缩进、LF 行尾符、UTF-8 编码
- **Prettier**：单引号、无分号、100 列宽度、尾随逗号
- **ESLint**：使用 `@antfu/eslint-config` 统一配置

**配置位置：**

```
.editorconfig              # 编辑器配置（根目录）
prettier.config.cjs        # Prettier 配置（根目录）
servers/eslint.config.mjs  # 后端 ESLint（使用 @antfu/eslint-config）
apps/web/eslint.config.ts  # 前端 ESLint（使用 @antfu/eslint-config）
```

**自动格式化：**

```bash
# 格式化整个项目
pnpm format

# 格式化特定包
pnpm --filter @template/web format
pnpm -C servers format
```

### 1.2 命名约定

#### 文件和目录命名

| 类型                | 规范                     | 示例                                    |
| ------------------- | ------------------------ | --------------------------------------- |
| **目录**            | 小写 + 短横线            | `user-profile/`, `order-management/`    |
| **TypeScript 文件** | 小写 + 短横线 + 类型后缀 | `user.service.ts`, `auth.controller.ts` |
| **Vue 组件**        | PascalCase 或 kebab-case | `UserProfile.vue`, `user-profile.vue`   |
| **配置文件**        | 小写 + 点分隔            | `nest-cli.json`, `tsconfig.app.json`    |
| **测试文件**        | 对应文件名 + `.spec.ts`  | `user.service.spec.ts`                  |

#### 代码命名

| 类型          | 规范                        | 示例                                 |
| ------------- | --------------------------- | ------------------------------------ |
| **类**        | PascalCase                  | `UserService`, `AuthController`      |
| **接口**      | PascalCase（前缀 `I` 可选） | `User`, `IUserRepository`            |
| **类型**      | PascalCase                  | `UserDto`, `CreateUserRequest`       |
| **枚举**      | PascalCase                  | `UserStatus`, `OrderType`            |
| **常量**      | UPPER_SNAKE_CASE            | `MAX_RETRY_COUNT`, `API_BASE_URL`    |
| **变量/函数** | camelCase                   | `userId`, `getUserById()`            |
| **私有成员**  | 前缀 `_` 或 `#`             | `_internalCache`, `#privateMethod()` |

#### 应用命名规范

| 前缀   | 说明                             | 示例                              |
| ------ | -------------------------------- | --------------------------------- |
| `ma-`  | BFF 应用（Multi-App / Main-App） | `ma-web`, `ma-admin`, `ma-mobile` |
| `ms-`  | 微服务（Microservice）           | `ms-auth`, `ms-rbac`, `ms-user`   |
| 无前缀 | 网关或工具                       | `gateway`, `scripts`              |

---

## 2. 文件组织规范

### 2.1 NestJS 应用结构

```
servers/apps/ms-user/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── ms-user.module.ts          # 根模块
│   ├── user/                      # 功能模块
│   │   ├── user.controller.ts     # 控制器
│   │   ├── user.service.ts        # 服务
│   │   ├── user.module.ts         # 模块定义
│   │   ├── dto/                   # 数据传输对象
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/              # 实体（如需要）
│   │   │   └── user.entity.ts
│   │   └── user.service.spec.ts   # 测试
│   └── common/                    # 应用内共享
│       ├── filters/
│       ├── guards/
│       └── interceptors/
├── test/                          # E2E 测试
└── tsconfig.app.json
```

### 2.2 Vue 应用结构

```
apps/web/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── App.vue                    # 根组件
│   ├── views/                     # 页面级组件
│   │   ├── HomeView.vue
│   │   └── UserView.vue
│   ├── components/                # 可复用组件
│   │   ├── common/                # 通用组件
│   │   └── user/                  # 业务组件
│   ├── composables/               # 组合式函数
│   ├── stores/                    # Pinia stores
│   ├── router/                    # 路由配置
│   ├── api/                       # API 调用
│   └── types/                     # TypeScript 类型
├── public/                        # 静态资源
└── tsconfig.app.json
```

### 2.3 共享库结构

```
packages/common/
├── src/
│   ├── index.ts                   # 统一导出
│   ├── types/                     # 类型定义
│   ├── utils/                     # 工具函数
│   ├── constants/                 # 常量
│   └── errors/                    # 错误定义
└── package.json
```

---

## 3. 导入导出规范

### 3.1 导入顺序

```typescript
// 1. Node.js 内置模块
import { readFile } from 'fs/promises'

// 2. 第三方库
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

// 3. Workspace 包（@template/*）
import { ErrorCode } from '@template/common'

// 4. 路径别名（@app/*）
import { SharedService } from '@app/shared'

// 5. 相对路径（同级或上级）
import { UserDto } from './dto/user.dto'
import { BaseService } from '../base/base.service'
```

### 3.2 导出规范

**推荐使用命名导出：**

```typescript
// ✅ 推荐
export class UserService {}
export interface UserDto {}
export const MAX_USERS = 100

// ❌ 避免默认导出（除了 Vue 组件和 NestJS 模块）
export default UserService
```

**共享库统一导出：**

```typescript
// packages/common/src/index.ts
export * from './types'
export * from './utils'
export * from './constants'
export * from './errors'
```

---

## 4. TypeScript 编码规范

### 4.1 类型定义

**明确类型注解：**

```typescript
// ✅ 推荐：函数参数和返回值明确类型
function getUserById(id: string): Promise<User | null> {
  return userRepository.findById(id)
}

// ❌ 避免：依赖类型推导（公共 API）
function getUserById(id) {
  return userRepository.findById(id)
}
```

**使用 interface 和 type：**

```typescript
// ✅ 对象结构用 interface
interface User {
  id: string
  name: string
  email: string
}

// ✅ 联合类型、工具类型用 type
type UserStatus = 'active' | 'inactive' | 'suspended'
type PartialUser = Partial<User>
```

### 4.2 类型导入

```typescript
// ✅ 推荐：使用 type 关键字导入类型
import type { User, UserDto } from './types'

// ✅ 混合导入
import { UserService, type UserDto } from './user.service'
```

### 4.3 避免 any

```typescript
// ❌ 避免
function process(data: any) {}

// ✅ 使用 unknown + 类型守卫
function process(data: unknown) {
  if (isValidData(data)) {
    // 类型安全处理
  }
}

// ✅ 使用泛型
function process<T>(data: T) {}
```

---

## 5. 共享边界规范

### 5.1 什么可以共享

| 位置             | 可共享内容               | 示例                                         |
| ---------------- | ------------------------ | -------------------------------------------- |
| `packages/*`     | 跨端代码（前后端都能用） | 类型定义、工具函数、常量、错误码             |
| `servers/libs/*` | 仅后端代码               | NestJS filters、guards、interceptors、logger |

**原则：**

- ✅ **可共享**：DTO、接口定义、枚举、纯函数、常量
- ❌ **禁止共享**：ORM 实体、数据库模型、Prisma Schema（避免分布式单体）

### 5.2 模块导入规范

```typescript
// ✅ 推荐：使用路径别名
import { SharedService } from '@app/shared'
import { ErrorCode } from '@template/common'

// ❌ 避免：深层相对路径
import { SharedService } from '../../../libs/shared/src/shared.service'
```

---

## 6. NestJS 特定规范

### 6.1 模块组织

```typescript
// user.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // 导入其他模块
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 需要被其他模块使用时导出
})
export class UserModule {}
```

### 6.2 依赖注入

```typescript
// ✅ 推荐：构造函数注入
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
}

// ❌ 避免：属性注入
@Injectable()
export class UserService {
  @Inject()
  private userRepository: Repository<User>
}
```

### 6.3 装饰器使用

```typescript
// ✅ 推荐：装饰器顺序
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id)
  }
}
```

---

## 7. Vue 特定规范

### 7.1 组件定义

```vue
<!-- ✅ 推荐：使用 <script setup> -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/types'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  update: [user: User]
}>()

const isActive = computed(() => props.user.status === 'active')
</script>

<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 16px;
}
</style>
```

### 7.2 Composables 命名

```typescript
// ✅ 推荐：use 前缀
export function useUser() {
  const user = ref<User | null>(null)

  async function fetchUser(id: string) {
    user.value = await api.getUser(id)
  }

  return {
    user,
    fetchUser,
  }
}
```

---

## 8. 错误处理规范

### 8.1 后端错误处理

```typescript
// ✅ 推荐：使用自定义异常
import { NotFoundException, BadRequestException } from '@nestjs/common'

async getUserById(id: string): Promise<User> {
  const user = await this.userRepository.findById(id)

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`)
  }

  return user
}

// ✅ 推荐：使用自定义异常类
export class UserNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`User with ID ${id} not found`)
  }
}
```

### 8.2 前端错误处理

```typescript
// ✅ 推荐：统一错误处理
try {
  const user = await api.getUser(id)
  return user
} catch (error) {
  if (error instanceof ApiError) {
    ElMessage.error(error.message)
  } else {
    ElMessage.error('未知错误')
    console.error(error)
  }
  throw error
}
```

---

## 9. 注释规范

### 9.1 JSDoc 注释

````typescript
/**
 * 根据 ID 获取用户信息
 *
 * @param id - 用户 ID
 * @returns 用户对象，如果不存在则返回 null
 * @throws {NotFoundException} 当用户不存在时抛出
 *
 * @example
 * ```typescript
 * const user = await getUserById('user-123')
 * ```
 */
async function getUserById(id: string): Promise<User | null> {
  // 实现
}
````

### 9.2 注释原则

- ✅ **注释"为什么"**，而非"做什么"（代码本身说明"做什么"）
- ✅ 复杂逻辑需要注释
- ✅ 公共 API 必须有 JSDoc
- ❌ 避免无用注释（如 `// 创建用户` 在 `createUser()` 函数上）

```typescript
// ❌ 无用注释
// 创建用户
function createUser(dto: CreateUserDto) {}

// ✅ 有用注释
// 注意：创建用户前需要先验证邮箱唯一性，避免重复注册
function createUser(dto: CreateUserDto) {
  // 实现
}
```

---

## 10. 测试规范

### 10.1 测试文件命名

```
user.service.ts      → user.service.spec.ts      # 单元测试
user.controller.ts   → user.controller.spec.ts   # 单元测试
app.e2e-spec.ts                                  # E2E 测试
```

### 10.2 测试结构

```typescript
describe('UserService', () => {
  let service: UserService
  let repository: MockRepository<User>

  beforeEach(() => {
    // 设置
  })

  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      // Arrange
      const userId = 'user-123'
      const expectedUser = { id: userId, name: 'John' }
      repository.findById.mockResolvedValue(expectedUser)

      // Act
      const result = await service.getUserById(userId)

      // Assert
      expect(result).toEqual(expectedUser)
      expect(repository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(service.getUserById('invalid-id')).rejects.toThrow(NotFoundException)
    })
  })
})
```

---

## 11. Git 提交规范

### 11.1 Conventional Commits

```bash
# 格式
<type>(<scope>): <subject>

# 示例
feat(ms-auth): 添加 JWT token 刷新功能
fix(ma-web): 修复用户列表分页错误
docs: 更新 API 文档
refactor(shared): 重构异常过滤器
test(ms-user): 添加用户服务单元测试
chore: 升级 NestJS 到 11.0.2
```

### 11.2 Type 类型

| Type       | 说明                         |
| ---------- | ---------------------------- |
| `feat`     | 新功能                       |
| `fix`      | Bug 修复                     |
| `docs`     | 文档更新                     |
| `style`    | 代码格式（不影响功能）       |
| `refactor` | 重构（不是新功能也不是修复） |
| `perf`     | 性能优化                     |
| `test`     | 测试相关                     |
| `chore`    | 构建、工具、依赖更新         |

### 11.3 Scope 范围（可选）

```
ma-web, ma-admin, ma-mobile    # BFF 应用
ms-auth, ms-rbac, ms-user      # 微服务
shared, config                  # 共享包
docs                            # 文档
```

---

## 12. 代码审查清单

提交 PR 前自查：

- [ ] 代码已通过 `pnpm lint` 检查
- [ ] 代码已通过 `pnpm format` 格式化
- [ ] 添加了必要的单元测试
- [ ] 公共 API 有 JSDoc 注释
- [ ] 没有 `console.log` 等调试代码
- [ ] 没有提交敏感信息（密钥、token）
- [ ] 遵循命名约定
- [ ] 导入语句有序
- [ ] 类型注解完整
- [ ] 提交信息符合 Conventional Commits

---

## 13. 工具链自动化

### 13.1 Pre-commit Hooks（建议配置）

```bash
# 安装 husky 和 lint-staged
pnpm add -D husky lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### 13.2 IDE 配置建议

**VS Code 推荐插件：**

- ESLint
- Prettier
- EditorConfig for VS Code
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)

**VS Code 设置：**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 参考资源

- [EditorConfig 配置](.editorconfig)
- [Prettier 配置](../prettier.config.cjs)
- [NestJS 最佳实践](https://docs.nestjs.com/)
- [Vue 风格指南](https://vuejs.org/style-guide/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
