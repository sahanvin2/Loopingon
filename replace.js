const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /Handmade Craft Marketplace/gi, replacement: 'E-commerce Marketplace' },
  { regex: /Handmade Crafts/gi, replacement: 'Premium Products' },
  { regex: /handmade treasures/gi, replacement: 'amazing products' },
  { regex: /handmade gifts/gi, replacement: 'gifts' },
  { regex: /handmade creations/gi, replacement: 'creations' },
  { regex: /handmade products/gi, replacement: 'premium products' },
  { regex: /handmade items/gi, replacement: 'premium items' },
  { regex: /handmade goods/gi, replacement: 'premium goods' },
  { regex: /handmade artisanal crafts/gi, replacement: 'premium products' },
  { regex: /Handmade, vintage, custom \& more/gi, replacement: 'Electronics, Fashion, Home & more' },
  { regex: /handmade by Sri Lankan/gi, replacement: 'sourced by Sri Lankan' },
  { regex: /genuinely handmade/gi, replacement: 'genuine' },
  { regex: /(?<!is)(?<!active)handmade(?!Only)/gi, replacement: 'premium' }
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'apps/web/src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Replaced text in ${changedFiles} files.`);
