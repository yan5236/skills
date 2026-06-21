---
name: development-standards
description: 开发规范管理。在项目根目录维护 docs/ 标准文档（README、ARCHITECTURE、SECURITY、STYLE），确保编码前阅读并遵守项目规范，保持架构一致性、代码安全性与风格统一。
---

# 开发规范 (Development Standards)

本技能用于在项目中建立和维护开发规范文档，确保所有开发工作在统一的约束下进行。

## 核心原则

- **先读文档，再写代码**：任何修改前必须阅读相关规范文档
- **文档驱动开发**：架构、安全、风格决策记录在 docs/ 中，团队成员共享
- **持续更新**：项目变更时同步更新文档，保持文档与代码一致

## 目录结构

目标项目应保持以下结构：

```text
docs/
├── README.md          # 项目背景与技术栈
├── ARCHITECTURE.md    # 架构设计与模块说明
├── SECURITY.md        # 安全规范与漏洞检查
└── STYLE.md           # 代码风格与可维护性
```

所有文件使用**全大写**命名。

## 标准流程

### 1. 检查 docs/ 目录

进入项目时，首先检查根目录是否存在 `docs/` 文件夹及其四份核心文档：

```
docs/README.md
docs/ARCHITECTURE.md
docs/SECURITY.md
docs/STYLE.md
```

### 2. 创建缺失的文档

如果 `docs/` 目录不存在或文档不完整，从模板创建：

```bash
# 创建 docs 目录并复制模板
mkdir -p <project-root>/docs
cp <skill-dir>/assets/README.md <project-root>/docs/README.md
cp <skill-dir>/assets/ARCHITECTURE.md <project-root>/docs/ARCHITECTURE.md
cp <skill-dir>/assets/SECURITY.md <project-root>/docs/SECURITY.md
cp <skill-dir>/assets/STYLE.md <project-root>/docs/STYLE.md
```

模板来源固定为：

- [assets/README.md](assets/README.md)
- [assets/ARCHITECTURE.md](assets/ARCHITECTURE.md)
- [assets/SECURITY.md](assets/SECURITY.md)
- [assets/STYLE.md](assets/STYLE.md)

### 3. 开发前阅读文档

根据任务类型，选择性阅读相关文档：

| 任务类型 | 必读文档 | 说明 |
|----------|----------|------|
| 首次接触项目 | `README.md` | 了解项目背景、目标、技术栈 |
| 新增功能/模块 | `ARCHITECTURE.md` | 理解模块划分、依赖关系、对接规则 |
| 修改现有功能 | `ARCHITECTURE.md` + `STYLE.md` | 确保改动符合架构和风格 |
| 涉及认证/授权/数据 | `SECURITY.md` | 检查安全约束 |
| 涉及数据持久化 | `SECURITY.md` + `ARCHITECTURE.md` | 数据安全 + 数据流设计 |
| 任何代码编写 | `STYLE.md` | 遵守命名、格式、模块化规则 |

### 4. 遵守规范编码

编码时严格遵守文档中定义的各项规范：

- 架构约束：新模块的位置、接口设计、依赖方向
- 安全约束：输入校验、权限检查、敏感数据处理
- 风格约束：命名规则、文件结构、注释要求

## 各文档说明

### README.md — 项目背景

描述项目的基本信息，是新人了解项目的入口。

必须包含：
- 项目名称与一句话简介
- 业务背景与项目目标
- 技术栈完整清单（语言、框架、数据库、中间件、第三方服务）
- 环境要求与版本限制
- 快速启动步骤
- 相关链接（代码仓库、文档、CI/CD 等）

### ARCHITECTURE.md — 架构设计

描述项目的技术架构，是开发新功能时的参考基准。

必须包含：
- 整体架构图（优先使用 Mermaid 语法）
- 每个模块的职责说明
- 模块之间的依赖关系（依赖方向、接口约定）
- 核心数据流与关键接口
- 当前各模块的功能状态（已完成、进行中、待开发、已废弃）
- 新增功能的对接规则：
  - 代码应放在哪个目录/包下
  - 需要遵循的接口契约
  - 如何避免与现有模块冲突
  - 需要更新的配置或依赖

### SECURITY.md — 安全规范

描述项目的安全要求，是防范漏洞的检查清单。

必须包含：
- 安全设计原则（最小权限、纵深防御、默认安全）
- 认证与会话管理机制
- 授权与权限模型
- 数据保护策略（传输加密、存储加密、敏感数据脱敏）
- 输入校验规范（防 XSS、SQL 注入、命令注入）
- 依赖安全审计流程
- 敏感信息管理（密钥、令牌、证书的存储与轮换）
- 常见漏洞检查清单（参考 OWASP Top 10）

### STYLE.md — 代码风格

描述项目的代码风格约定，确保代码库风格统一。

必须包含：
- 命名规范（文件、目录、变量、函数、类、常量）
- 目录结构约定
- 模块化原则（文件最大行数、函数最大行数、职责单一）
- 注释规范（何时写、写什么、格式要求）
- 错误处理模式
- 测试规范（测试文件位置、命名、覆盖率要求）
- 代码审查要点

## 执行规则

### 新功能开发

1. 先读 `README.md` + `ARCHITECTURE.md`
2. 确认功能所属模块及对接点
3. 读 `STYLE.md` 确认代码风格
4. 如果涉及安全敏感操作，读 `SECURITY.md`
5. 编写代码
6. 如果有架构级变更，更新 `ARCHITECTURE.md`

### Bug 修复

1. 读 `ARCHITECTURE.md` 了解相关模块
2. 读 `STYLE.md` 保持修复代码风格一致
3. 如果 bug 涉及安全漏洞，读 `SECURITY.md` 并做安全回归检查

### 代码审查

1. 对照 `STYLE.md` 检查代码风格
2. 对照 `ARCHITECTURE.md` 检查是否有架构偏离
3. 对照 `SECURITY.md` 检查安全合规

## 文档维护原则

- **随代码更新**：架构变更、新增安全策略、风格调整时，同步更新对应文档
- **保持精炼**：每个文档聚焦自身主题，不交叉冗余
- **标注状态**：架构文档中的模块状态要及时更新，避免误导新成员
- **模板为基础**：初始使用模板创建，后续根据项目实际情况填充具体内容
