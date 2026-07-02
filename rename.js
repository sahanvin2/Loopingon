const fs = require('fs');
const path = require('path');

const directories = [
  'apps/web/src',
  'apps/server/src',
  'apps/server/prisma',
  'apps/web/public'
];

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/Loopingon/g, 'Kandyam');
  newContent = newContent.replace(/loopingon/g, 'kandyam');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      if (
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.jsx') ||
        fullPath.endsWith('.json') ||
        fullPath.endsWith('.css') ||
        fullPath.endsWith('.html') ||
        fullPath.endsWith('.md')
      ) {
        replaceInFile(fullPath);
      }
    }
  }
}

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  console.log(`Scanning ${fullPath}...`);
  walkDir(fullPath);
});

console.log('Done replacing!');
