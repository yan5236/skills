# Skills

一个面向 AI 编码助手的技能集合，覆盖软件开发全流程与小说创作领域。每个技能都是一个独立的 `SKILL.md`，定义了特定场景下的执行规则、工作流和检查清单。

## 目录结构

```text
skills/
├── decoupling-discipline/      # 架构解耦纪律
├── development-standards/      # 开发规范管理
├── novel-related_items/        # 小说创作技能合集
│   ├── character-design/       # 人物设定
│   ├── content-writing/         # 正文编写
│   ├── novel-writing/          # 小说创作
│   └── outline-creation/       # 大纲创作
├── project-memory/             # 项目记忆管理
├── spec-driven-development/    # 规范驱动开发
└── super-review/               # 深度代码审查
```

## 软件开发技能

### development-standards — 开发规范管理

在项目根目录维护 `docs/` 标准文档（README、ARCHITECTURE、SECURITY、STYLE），确保编码前阅读并遵守项目规范，保持架构一致性、代码安全性与风格统一。

- **触发**：进入新项目、新增功能、修改现有功能、代码审查
- **产出**：四份标准文档模板与阅读流程

### spec-driven-development — 规范驱动开发

为功能建立规范驱动开发三件套：`requirements.md`、`design.md`、`tasks.md`。在缺少 `specs/` 目录时自动创建结构、模板和功能骨架。

- **触发**：用户要求先写规格再实现、补齐需求文档、编写技术方案、拆解实施任务
- **产出**：`specs/<编号>-<feature-slug>/` 下的三份文档

### decoupling-discipline — 架构解耦纪律

软件复杂度随代码量呈平方级增长，本技能提供五项结构性戒律，避免"改一行崩三处"的屎山：

1. 依赖接口而非实现
2. 单一职责模块化
3. 组合优于继承
4. 渐进开发，每步测试
5. 避免全局状态，多写纯函数

- **触发**：编码、模块设计、接口定义、AI 生成代码、重构降耦合、架构设计
- **产出**：接口契约文档、模块边界定义、AI 编码三步协议

### super-review — 深度代码审查

执行结构性代码审查，先分析 Diff 后输出带风险分级的 Markdown 审查报告（P0/P1/P2/No issues），覆盖数据流、异常流、用户体验、测试缺口、安全隐私五类风险。

- **触发**：用户要求"审阅代码""Code Review""Review""代码审查""合并前检查"等
- **产出**：含六要素（文件、行号、触发条件、原因、影响、修复建议）的审查报告

### project-memory — 项目记忆管理

存储项目上下文信息（架构、决策、约定等），避免重复告知。随对话累积记忆，让智能体越来越了解项目。

- **触发**：开始新项目、对话结束提炼记忆、项目代码重大变更
- **产出**：`.project-memory/` 目录下的索引与记忆文件

## 小说创作技能

`novel-related_items/` 下的四个技能相互配合，建议全部安装以发挥最佳效果：

| 技能 | 职责 |
|------|------|
| `novel-writing` | 基于小说三要素（人物、情节、环境）提供创作总纲 |
| `outline-creation` | 大纲结构设计、细纲编写、情节规划 |
| `character-design` | 人物三维模型、性格塑造、成长规划 |
| `content-writing` | 细纲转正文，叙述与交流的写作方法 |

## 开发流程协作

软件开发类技能形成链式协作，覆盖从项目启动到代码审查的完整流程：

```text
1. development-standards    → 项目启动：确保 docs/ 规范文档就位
2. spec-driven-development  → 功能启动：编写 specs/ 需求/设计/任务文档
3. decoupling-discipline     → 编码中：  每个模块按解耦戒律实现
4. super-review             → 编码完成：深度审查，兜底检查遗漏问题
```

`project-memory` 贯穿全流程，持续累积项目上下文。

## 安装与使用

将 `skills/` 下任意子目录作为技能目录加载到支持 SKILL.md 规范的 AI 编码助手中即可。每个技能目录内的 `SKILL.md` 是入口文件，`assets/` 存放模板，`scripts/` 存放辅助脚本。
