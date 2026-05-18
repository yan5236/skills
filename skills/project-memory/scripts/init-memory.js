const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

async function questionrl(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function init() {
    console.log('开始初始化项目记忆目录...\n');

    if (fs.existsSync(memoryPath)) {
        console.log(`记忆目录已存在：${memoryPath}`);
        const answer = await questionrl('是否重新初始化？(y/N): ');
        if (answer.toLowerCase() !== 'y') {
            console.log('取消初始化');
            return;
        }
    }

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

## 最近更新

| 日期 | 记忆ID | 更新内容 |
|------|--------|----------|
| ${today} | 001 | 初始化项目 |

## 使用说明

本索引文件是项目记忆的入口点。当需要了解项目时，首先阅读此文件，然后根据记忆ID找到对应的详细记忆文件。
`;

    fs.writeFileSync(path.join(memoryPath, 'INDEX.md'), indexContent, 'utf8');

    const initMemory = `# 项目初始化

- **创建时间**：${today}
- **更新时间**：${today}
- **版本**：v1.0
- **关键词**：初始化、项目创建

## 概述
项目初始化时创建的记忆文件，记录项目的基本信息。

## 详细内容

### 项目信息
- 项目路径：${path.resolve(projectPath)}
- 创建时间：${today}

### 待补充
- [ ] 项目具体名称
- [ ] 项目类型
- [ ] 使用的技术栈
- [ ] 项目的主要功能
- [ ] 目标用户或使用场景

### 技术栈初步判断
[根据项目目录结构初步判断使用的技术栈]

## 相关记忆
无
`;

    fs.writeFileSync(path.join(memoriesDir, '001-项目初始化.md'), initMemory, 'utf8');

    const templateContent = `# [记忆标题]

- **创建时间**：YYYY-MM-DD
- **更新时间**：YYYY-MM-DD
- **版本**：v1.0
- **关键词**：关键词1, 关键词2, 关键词3

## 概述
[简要说明这段记忆的主要内容，一句话概括]

## 详细内容

### [子主题1]
[提炼后的关键信息]

### [子主题2]
[提炼后的关键信息]

## 相关记忆
- 001-项目初始化.md

## 待补充
- [ ] 待补充的信息1
`;

    fs.writeFileSync(path.join(assetsDir, 'memory-template.md'), templateContent, 'utf8');

    console.log('========================================');
    console.log('项目记忆目录初始化完成！');
    console.log('========================================');
    console.log('');
    console.log(`记忆目录位置：${memoryPath}`);
    console.log('');
    console.log('目录结构：');
    console.log(`  ${memoryPath}`);
    console.log('  ├── INDEX.md              # 索引文件');
    console.log('  ├── memories/            # 记忆文件目录');
    console.log('  │   └── 001-项目初始化.md');
    console.log('  └── assets/');
    console.log('      └── memory-template.md');
    console.log('');
    console.log('请编辑 INDEX.md 和 001-项目初始化.md 来补充项目信息。');
}

init();
