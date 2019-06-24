const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filename = path.join(__dirname, '../', '../', 'logs', 'access.log');

// 创建readStream
const readStream = fs.createReadStream(filename);

// 创建 readline
const rl = readline.createInterface({
    input: readStream
})

let chrome = 0
let total = 0

// 读取行数
rl.on('line', (lineData) => {
    if (!lineData) {
        return
    }
    // 记录总行数
    total++;
    const arr = lineData.split('--')
    if (arr[2].indexOf('Chrome') > 0) {
        chrome++
    }
})

rl.on('close', () => {
    console.log(`谷歌浏览器占比${chrome/total}`)
})