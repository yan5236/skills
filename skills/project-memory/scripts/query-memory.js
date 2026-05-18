const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const keyword = process.argv[3] || '';
const showAll = process.argv.includes('--all');

const memoryPath = path.join(projectPath, '.project-memory');
const memoriesDir = path.join(memoryPath, 'memories');
const indexFile = path.join(memoryPath, 'INDEX.md');

function listMemories() {
    console.log('========================================');
    console.log('         项目记忆索引');
    console.log('========================================');
    console.log('');

    if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        const lines = content.split('\n').slice(0, 30);
        console.log(lines.join('\n'));
    }

    console.log('');
    console.log('可用记忆文件：');

    if (!fs.existsSync(memoriesDir)) {
        console.log('  暂无记忆文件');
        return;
    }

    const files = fs.readdirSync(memoriesDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
        console.log('  暂无记忆文件');
        return;
    }

    files.sort().forEach(file => {
        const filePath = path.join(memoriesDir, file);
        const lines = fs.readFileSync(filePath, 'utf8').split('\n');
        const title = lines[0]?.replace(/^#\s*/, '') || file;
        console.log(`  - ${file}: ${title}`);
    });
}

function searchMemories(keyword) {
    console.log('========================================');
    console.log(`         搜索结果：${keyword}`);
    console.log('========================================');
    console.log('');

    if (!fs.existsSync(memoriesDir)) {
        console.log('记忆目录不存在');
        return;
    }

    const files = fs.readdirSync(memoriesDir).filter(f => f.endsWith('.md'));
    const matchingFiles = files.filter(file => {
        const content = fs.readFileSync(path.join(memoriesDir, file), 'utf8');
        return content.includes(keyword);
    });

    if (matchingFiles.length === 0) {
        console.log('未找到匹配的记忆文件');
        console.log('可使用 list 参数查看所有记忆');
        return;
    }

    matchingFiles.sort().forEach(file => {
        console.log(`--- ${file} ---`);
        const filePath = path.join(memoriesDir, file);
        const lines = fs.readFileSync(filePath, 'utf8').split('\n');

        if (showAll) {
            console.log(lines.join('\n'));
        } else {
            console.log(lines.slice(0, 40).join('\n'));
            if (lines.length > 40) {
                console.log('');
                console.log('  ... (更多内容请使用 --all 参数) ...');
            }
        }
        console.log('');
    });
}

function main() {
    if (!fs.existsSync(memoryPath)) {
        console.log('记忆目录不存在！');
        console.log('请先运行 node init-memory.js 初始化记忆目录');
        return;
    }

    if (!keyword || keyword === '--list') {
        listMemories();
    } else {
        searchMemories(keyword);
    }
}

main();
