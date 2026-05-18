const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const title = process.argv[3];
const description = process.argv[4] || '';
const keywordsArg = process.argv[5] || '';
const keywords = keywordsArg ? keywordsArg.split(',').map(k => k.trim()) : [];

const memoryPath = path.join(projectPath, '.project-memory');
const memoriesDir = path.join(memoryPath, 'memories');
const indexFile = path.join(memoryPath, 'INDEX.md');

const today = new Date().toISOString().split('T')[0];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getNextId() {
    if (!fs.existsSync(memoriesDir)) {
        return '001';
    }
    const files = fs.readdirSync(memoriesDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) return '001';
    const maxId = files.reduce((max, file) => {
        const match = file.match(/^(\d+)/);
        if (match) {
            const num = parseInt(match[1], 10);
            return num > max ? num : max;
        }
        return max;
    }, 0);
    return String(maxId + 1).padStart(3, '0');
}

function safeFilename(str) {
    return str.replace(/[^\w\u4e00-\u9fff-]/g, '').replace(/\s+/g, '-');
}

function updateIndex(newId, fileName, title, keywords) {
    if (!fs.existsSync(indexFile)) return;

    let content = fs.readFileSync(indexFile, 'utf8');

    const newEntry = `| ${newId} | ${fileName} | ${title} | ${keywords.join('、')} |`;
    const tableMatch = content.match(/(## 记忆文件列表\n\| ID.*?\n)(\|.*?\|(?:\n\|.*?\|)*)/);
    if (tableMatch) {
        content = content.replace(tableMatch[0], tableMatch[1] + newEntry + '\n' + tableMatch[2]);
    }

    const recentEntry = `| ${today} | ${newId} | 添加记忆：${title} |`;
    const recentMatch = content.match(/(## 最近更新\n\| 日期.*?\n)(\|.*?\|(?:\n\|.*?\|)*)/);
    if (recentMatch) {
        content = content.replace(recentMatch[0], recentMatch[1] + recentEntry + '\n' + recentMatch[2]);
    }

    content = content.replace(/> 最后更新：.*?>/, `> 最后更新：${today}>`);

    fs.writeFileSync(indexFile, content, 'utf8');
}

function addMemory() {
    if (!fs.existsSync(memoryPath)) {
        console.log('记忆目录不存在，请先运行 init-memory.js 初始化');
        return;
    }

    if (!title) {
        console.log('用法: node add-memory.js <项目路径> <标题> [描述] [关键词1,关键词2,...]');
        console.log('示例: node add-memory.js . "架构设计" "项目采用模块化架构" "架构,模块"');
        return;
    }

    ensureDir(memoriesDir);

    const nextId = getNextId();
    const safeTitle = safeFilename(title);
    const fileName = `${nextId}-${safeTitle}.md`;
    const keywordsStr = keywords.length > 0 ? keywords.join(', ') : '待添加';

    const memoryContent = `# ${title}

- **创建时间**：${today}
- **更新时间**：${today}
- **版本**：v1.0
- **关键词**：${keywordsStr}

## 概述
${description || '[简要说明这段记忆的主要内容]'}

## 详细内容

### 主题1
[提炼后的关键信息]

### 主题2
[提炼后的关键信息]

## 相关记忆
- 001-项目初始化.md

## 待补充
- [ ] 待补充的信息
`;

    const memoryFile = path.join(memoriesDir, fileName);
    fs.writeFileSync(memoryFile, memoryContent, 'utf8');

    updateIndex(nextId, fileName, title, keywords);

    console.log('========================================');
    console.log('记忆已添加成功！');
    console.log('========================================');
    console.log('');
    console.log(`记忆文件：${fileName}`);
    console.log(`存储位置：${memoryFile}`);
    console.log(`关键词：${keywordsStr}`);
    console.log('');
    console.log('请编辑记忆文件以补充详细内容。');
}

addMemory();
