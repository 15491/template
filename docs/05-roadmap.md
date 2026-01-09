# 演进路线（分阶段落地）

本文档用于描述从“快速落地”到“按业务域演进”的建议路径，避免一开始拆得过细。

---

- 阶段 1：3 个 BFF + 2~4 个核心领域服务（例如 `auth(+rbac)`、`users`、`orders`、`catalog`）
- 阶段 2：当发布/性能/团队协作出现瓶颈，再继续拆分 `files`、`notifications`、`payments` 等