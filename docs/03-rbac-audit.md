# 权限与审计（RBAC）

本文档说明 Admin 场景下 RBAC 的推荐放置方式与基础建模。

---

## 1. 放置建议

- `ms-auth`：身份认证微服务（登录、签发/刷新 token、会话管理）
- `ms-rbac`：授权数据微服务（角色/权限/策略管理与查询）
- `ma-admin`：管理后台 BFF，对每个管理端路由做强制权限校验（并可加操作审计）

---

## 2. RBAC 基础建模建议

- `Permission`: `order:read` / `order:write` 等
- `Role`: `ops` / `admin` 等
- `UserRole`、`RolePermission` 两张关系表
