const fs = require('fs'); 
const glob = require('glob'); 

glob.sync('apps/server/src/**/*.ts').forEach(file => { 
  let content = fs.readFileSync(file, 'utf8'); 
  if (content.includes('mock-bullmq')) { 
    content = content.replace(/from '(?:\.\.\/)*mock-bullmq'/g, "from 'bullmq'"); 
    fs.writeFileSync(file, content); 
  } 
}); 
console.log('Reverted mock-bullmq');
