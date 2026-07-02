const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add sizes to Image tags with fill but no sizes
      const newContent = content.replace(/<Image([^>]+)fill([^>]*)>/g, (match, p1, p2) => {
        if (!match.includes('sizes=')) {
          return `<Image${p1}fill sizes="(max-width: 768px) 100vw, 50vw"${p2}>`;
        }
        return match;
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'apps/web/src'));
console.log('Done fixing images');
