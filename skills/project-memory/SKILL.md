---
name: "project-memory"
description: "项目记忆管理技能。存储项目上下文信息（架构、决策、约定等），避免重复告知。调用时机：开始新项目时、每次对话结束时提炼记忆、项目代码有重大变更时。"
---

# 项目记忆 (Project Memory)

本技能用于管理和维护项目的"记忆"，让智能体能够随着时间推移越来越了解项目，无需用户重复告知相同信息。

## 核心概念

### 什么是项目记忆？
- **不是对话日志**：不存储完整对话内容
- **是提炼精华**：从对话中提取关键信息（架构决策、技术选型、项目约定、已知问题等）
- **持续累积**：每次交互后更新，使记忆越来越详尽

### 记忆文件结构
```
project-memory/
├── INDEX.md                    # 索引文件（必需）
├── memories/                   # 记忆文件目录
│   ├── 001-架构概览.md
│   ├── 002-代码规范.md
│   ├── 003-技术栈.md
│   └── ...
└── assets/
    └── memory-template.md      # 记忆文件模板
```

## 文件说明

### 1. INDEX.md（索引文件）

```markdown
# 项目记忆索引

> 最后更新：YYYY-MM-DD

## 记忆文件列表

| ID | 文件名 | 描述 | 关键词 |
|----|--------|------|--------|
| 001 | 001-架构概览.md | 项目整体架构和模块划分 | 架构、模块、目录结构 |
| 002 | 002-代码规范.md | 代码风格、命名约定等 | 规范、命名、风格 |
| ... | ... | ... | ... |

## 项目概要

- **项目名称**：
- **项目类型**：
- **核心技术栈**：
- **版本**：
```

### 2. 记忆文件模板

```markdown
# [记忆标题]

- **创建时间**：YYYY-MM-DD
- **更新时间**：YYYY-MM-DD
- **版本**：v1.0
- **关键词**：关键词1, 关键词2

## 概述
[简要说明这段记忆的主要内容]

## 详细内容
[提炼后的关键信息]

## 相关记忆
- 相关记忆ID或链接
```

## 使用流程

### 1. 初始化项目记忆（首次使用时）

当用户开始新项目或首次调用此技能时，执行初始化：

```
1. 检查 .project-memory/ 目录是否存在
2. 如不存在，创建目录结构
3. 创建 INDEX.md 索引文件
4. 创建初始记忆文件（如 001-项目初始化.md）
```

### 2. 添加新记忆（对话结束时）

当一段对话完成后，智能体应该：
1. 提炼对话中的关键信息
2. 确定应存入哪个记忆文件（或新建）
3. 更新记忆文件内容
4. 更新 INDEX.md 索引

### 3. 查询记忆（需要了解项目时）

当用户提到项目相关话题或智能体需要了解项目上下文时：
1. 读取 INDEX.md 索引
2. 根据关键词找到相关记忆文件
3. 读取相关记忆文件内容
4. 结合记忆内容回复用户

## 记忆提炼原则

### 应该存入记忆的内容
- 项目架构和目录结构
- 使用的技术栈和框架
- 代码规范和命名约定
- 重要的设计决策
- 已知的问题和限制
- 配置文件的位置和作用
- 第三方服务/接口的使用方式
- 团队特定的开发习惯

### 不应该存入记忆的内容
- 具体的对话内容
- 临时性的测试代码
- 可以通过代码直接读取的信息（如某个函数的具体实现）
- 过时或已废弃的信息（应及时删除或标记）

## 脚本工具

### Node.js 脚本

#### 1. 初始化记忆目录 `init-memory.js`

```javascript
const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const memoryPath = path.join(projectPath, '.project-memory');
const memoriesDir = path.join(memoryPath, 'memories');
const assetsDir = path.join(memoryPath, 'assets');

const today = new Date().toISOString().split('T')[0];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function init() {
    ensureDir(memoriesDir);
    ensureDir(assetsDir);

    const indexContent = `# 项目记忆索引

> 最后更新：${today}

## 项目概要

- **项目名称**：待填写
- **项目类型**：待填写
- **核心技术栈**：待填写
- **主要功能**：待填写
- **版本**：v1.0.0

## 记忆文件列表

| ID | 文件名 | 描述 | 关键词 |
|----|--------|------|--------|
| 001 | 001-项目初始化.md | 初始项目信息 | 初始化、创建 |
`;

    fs.writeFileSync(path.join(memoryPath, 'INDEX.md'), indexContent, 'utf8');
    // ... 创建其他文件
    console.log('项目记忆目录初始化完成！');
}

init();
```

#### 2. 添加记忆 `add-memory.js`

```javascript
// 用法: node add-memory.js <项目路径> <标题> [描述] [关键词1,关键词2]
const projectPath = process.argv[2] || '.';
const title = process.argv[3];
const description = process.argv[4] || '';
const keywords = process.argv[5]?.split(',').map(k => k.trim()) || [];

// ... 实现添加记忆逻辑
```

#### 3. 查询记忆 `query-memory.js`

```javascript
// 用法: node query-memory.js <项目路径> [关键词] [--list]
// 示例: node query-memory.js . --list
// 示例: node query-memory.js . 架构

const projectPath = process.argv[2] || '.';
const keyword = process.argv[3] || '';
// ... 实现查询记忆逻辑
```

#### 4. 更新记忆 `update-memory.js`

```javascript
// 用法: node update-memory.js <项目路径> <记忆ID> [新内容] [--interactive]
// 示例: node update-memory.js . 001 "新增了用户模块"

const projectPath = process.argv[2] || '.';
const memoryId = process.argv[3];
const newContent = process.argv[4] || '';
// ... 实现更新记忆逻辑
```

### 使用示例

```bash
# 初始化项目记忆
node scripts/init-memory.js /path/to/project

# 添加新记忆
node scripts/add-memory.js /path/to/project "架构设计" "采用模块化架构" "架构,模块"

# 查询所有记忆
node scripts/query-memory.js /path/to/project --list

# 搜索记忆
node scripts/query-memory.js /path/to/project 架构

# 更新记忆
node scripts/update-memory.js /path/to/project 001 --interactive
```

## 最佳实践

1. **定期更新**：每次重要对话后更新记忆
2. **及时索引**：新增记忆后更新 INDEX.md
3. **合并相似**：相似内容合并到同一文件，避免碎片化
4. **清理过期**：删除或标记过时的记忆
5. **关键词管理**：保持关键词准确，便于检索

## 示例场景

### 场景1：新项目初始化
```
用户：帮我创建一个 Vue + TypeScript 的后台管理系统项目
智能体：调用 project-memory 技能，初始化记忆目录，记录技术栈为 Vue + TypeScript
```

### 场景2：对话中获取项目信息
```
用户：我的项目结构是怎样的？
智能体：读取 001-架构概览.md，返回项目结构信息
```

### 场景3：对话结束提炼记忆
```
用户：好的，我们完成了这个功能的开发
智能体：提炼关键信息（新增了哪些文件、修改了哪些配置），
       更新对应的记忆文件（架构记忆、规范记忆等）
```
