const fs = require('fs');
const path = require('path');

const workersDir = path.join(__dirname, 'apps/server/src/workers');
const files = fs.readdirSync(workersDir);

for (const file of files) {
  if (file.endsWith('.ts')) {
    const filePath = path.join(workersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/from "bullmq";/g, 'from "../mock-bullmq.js";');
    fs.writeFileSync(filePath, content);
  }
}
console.log('Done replacing imports');
