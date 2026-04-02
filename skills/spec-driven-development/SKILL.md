---
name: spec-driven-development
description: 为功能建立规范驱动开发三件套 requirements.md、design.md、tasks.md，并在缺少规范目录时自动创建 specs 结构、模板和功能骨架。用于用户要求先写规格再实现、补齐需求文档、编写技术方案、拆解实施任务、按验收标准推进开发的场景。
---

# 规范驱动开发

按以下流程工作，不要跳过文档阶段直接实现。

## 核心约束

- 始终以三个文档为交付核心：`requirements.md`、`design.md`、`tasks.md`。
- 始终使用目录结构 `specs/<三位编号>-<feature-slug>/`。
- 始终在项目内维护 `specs/.templates/`，其中放置三个模板文件。
- 如果目标项目缺少 `specs/`、`.templates/` 或对应功能目录，直接运行 [scripts/create_spec_scaffold.py](scripts/create_spec_scaffold.py) 创建，不要手工零散补目录。
- 只有在三份文档已经存在且彼此一致时，才进入实现或修改代码阶段。

## 目录契约

目标项目应保持以下结构：

```text
specs/
├── 001-login-feature/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── .templates/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

模板来源固定为：

- [assets/requirements.md](assets/requirements.md)
- [assets/design.md](assets/design.md)
- [assets/tasks.md](assets/tasks.md)

模板文件只保留文档骨架，不在模板内写“编写要点”。所有编写规则、约束和质量标准统一以本 `SKILL.md` 为准。

## 标准流程

### 1. 先检查项目结构

检查目标项目是否已有：

- `specs/`
- `specs/.templates/requirements.md`
- `specs/.templates/design.md`
- `specs/.templates/tasks.md`
- 当前功能对应的 `specs/<编号>-<feature-slug>/`

如果任一项缺失，直接执行：

```bash
python "<skill-dir>/scripts/create_spec_scaffold.py" --project-root "<target-project>" --feature-name "<功能名称>" --feature-slug "<feature-slug>"
```

必要时补充 `--sequence 001` 或 `--force`。

### 2. 再编写 `requirements.md`

使用 EARS 语法编写需求与验收标准。

必须满足：

- 使用 `SHALL`，不要使用 `Should`。
- 每个 `WHEN / IF / WHERE` 条目都必须能转成可测试场景。
- 避免“快速”“友好”“稳定”等模糊词，改成明确指标或行为。
- 每条需求都要有用户故事和验收标准。
- 非功能约束单独记录在“技术约束”章节。

优先使用以下句式：

1. `WHEN [事件/条件] THEN 系统 SHALL [系统响应]`
2. `WHEN [事件/条件] AND [附加条件] THEN 系统 SHALL [响应]`
3. `IF [特定条件] THEN 系统 SHALL [响应]`
4. `WHERE [特定场景] WHEN [事件] THEN 系统 SHALL [响应]`

### 3. 再编写 `design.md`

使用 `Why-How-What` 结构描述技术方案。

必须覆盖：

- 问题陈述与当前状态
- 架构模式与选型原因
- 组件、接口、数据模型或 API 设计
- 决策记录与取舍
- 风险与待解决问题

必须记录：

- 为什么选择当前方案
- 为什么没有选择备选方案

优先加入 Mermaid 图来表达流程、时序或架构。

### 4. 最后编写 `tasks.md`

把设计拆成可执行、可验证、可并行的原子任务。

必须满足：

- 使用 Markdown 复选框 `- [ ]`
- 任务按阶段组织
- 每个任务写清依赖关系
- 验收任务直接引用 `requirements.md` 的条目编号
- 任务粒度要足够小，能让另一个智能体单独执行

任务命名要面向动作，不要写成模糊目标。

## 执行规则

### 新功能建模

当用户提出新功能时：

1. 先确定功能名与 `feature-slug`
2. 检查并必要时运行脚手架脚本
3. 在功能目录内完成三份文档
4. 确认需求、设计、任务三者可追溯
5. 再进入实现阶段

### 已有功能迭代

当用户要修改已有功能时：

1. 先读取该功能目录下的三份文档
2. 若需求变化，先改 `requirements.md`
3. 若方案变化，补充 `design.md` 的决策与取舍
4. 若实施范围变化，更新 `tasks.md`
5. 最后才修改代码

### 实现前核对

在开始编码前，至少确认：

- `tasks.md` 中存在与本次实现直接对应的任务
- `design.md` 已覆盖本次涉及的接口、数据结构或模块边界
- `requirements.md` 中存在明确的验收标准可供验证

如果以上任一项不成立，先补文档，不要直接写代码。

## 文件编写要求

### `requirements.md`

- 采用 [assets/requirements.md](assets/requirements.md) 模板
- 面向需求与验收，不混入实现细节
- 验收标准尽量编号清晰，方便在 `tasks.md` 中引用
- 使用 `SHALL` 定义强制行为，不要使用 `Should`
- 避免使用“快速”“友好”“稳定”等模糊描述，改成可测试标准
- 每个 `WHEN / IF / WHERE` 条目都必须对应一个可验证场景

### `design.md`

- 采用 [assets/design.md](assets/design.md) 模板
- 聚焦架构、接口、数据流、技术取舍
- 不要把实现步骤混写成任务清单
- 必须写明“为什么没选另一个方案”
- 优先使用 Mermaid 图表达流程、时序或架构
- 决策记录要能支撑后续实现，不要写成空泛结论

### `tasks.md`

- 采用 [assets/tasks.md](assets/tasks.md) 模板
- 聚焦实施顺序、依赖和验证动作
- 每个任务都要尽量能单独完成并独立验收
- 使用 `- [ ]` 和 `- [x]` 管理状态
- 每个任务要足够原子化，便于并行执行
- 用 `[依赖: X.X]` 标记前置任务
- 用 `[验证 Req X]` 或更细编号直接挂钩 `requirements.md`

## 脚本说明

[scripts/create_spec_scaffold.py](scripts/create_spec_scaffold.py) 负责：

- 创建 `specs/`
- 创建 `specs/.templates/`
- 将 `assets` 下的三个模板复制到 `.templates/`
- 创建 `specs/<编号>-<feature-slug>/`
- 为该功能生成三份初始文档

当项目结构不完整时，优先运行脚本，而不是手工补文件。
