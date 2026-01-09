# 权限与审计（RBAC）

本文档说明 Admin 场景下 RBAC 的推荐放置方式与基础建模。

---

## 1. 放置建议

- `services/auth`：身份认证（登录、签发/刷新 token）
- `services/rbac`：授权数据（角色/权限/策略）管理与查询
- `bff-admin`：对每个管理端路由做强制权限校验（并可加操作审计）

---

## 2. RBAC 基础建模建议

- `Permission`: `order:read` / `order:write` 等
- `Role`: `ops` / `admin` 等
- `UserRole`、`RolePermission` 两张关系表