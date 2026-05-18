const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const memoryId = process.argv[3];
const newContent = process.argv[4] || '';
const interactive = process.argv.includes('--interactive');

const memoryPath = path.join(projectPath, '.project-memory');
const memoriesDir = path.join(memoryPath, 'memories');

const today = new Date().toISOString().split('T')[0];

function getMemoryFile(id) {
    if (!fs.existsSync(memoriesDir)) return null;
    const files = fs.readdirSync(memoriesDir).filter(f => f.endsWith('.md'));
    const match = files.find(file => file.startsWith(id + '-'));
    return match ? path.join(memoriesDir, match) : null;
}

function updateMemory() {
    if (!fs.existsSync(memoryPath)) {
        console.log('记忆目录不存在！');
        return;
    }

    if (!memoryId) {
        console.log('可用记忆文件：');
        if (fs.existsSync(memoriesDir)) {
            fs.readdirSync(memoriesDir).filter(f => f.endsWith('.md')).sort().forEach(file => {
                console.log(`  ${file}`);
            });
        }
        console.log('');
        console.log('用法: node update-memory.js <项目路径> <记忆ID> [新内容] [--interactive]');
        console.log('示例: node update-memory.js . 001 "新增了用户认证模块"');
        console.log('交互模式: node update-memory.js . 001 --interactive');
        return;
    }

    const targetFile = getMemoryFile(memoryId);
    if (!targetFile) {
        console.log(`未找到记忆文件：${memoryId}`);
        return;
    }

    console.log(`正在更新：${path.basename(targetFile)}`);
    console.log('');

    if (interactive) {
        console.log('请在编辑器中修改内容...');
        const editor = process.env.EDITOR || 'notepad';
        require('child_process').spawn(editor, [targetFile], { stdio: 'inherit' });
        return;
    }

    if (!newContent) {
        console.log('请输入要添加的新内容（追加到详细内容部分）：');
        console.log('用法: node update-memory.js <项目路径> <记忆ID> <新内容>');
        return;
    }

    let content = fs.readFileSync(targetFile, 'utf8');

    content = content.replace(/(更新时间：)\d{4}-\d{2}-\d{2}/, `$1${today}`);

    const versionMatch = content.match(/(版本：)v([\d.]+)/);
    if (versionMatch) {
        const newVersion = (parseFloat(versionMatch[2]) + 0.1).toFixed(1);
        content = content.replace(/(版本：)v[\d.]+/, `$1v${newVersion}`);
    }

    const sectionMatch = content.match(/(## 详细内容\r?\n)(.*?)(\r?\n## |$)/s);
    if (sectionMatch) {
        const updateMarker = `\n### 更新内容 (${today})\n${newContent}\n`;
        content = content.replace(sectionMatch[0], sectionMatch[1] + sectionMatch[2] + updateMarker + sectionMatch[3]);
    }

    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`记忆已更新：${path.basename(targetFile)}`);
}

updateMemory();
