const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

schema = schema.replace(/model\s+[A-Za-z0-9_]+\s*\{([^}]+)\}/g, (match) => {
  if (match.includes('@@schema')) return match;
  return match.replace(/\}\s*$/, '  @@schema("public")\n}');
});

fs.writeFileSync('apps/server/prisma/schema.prisma', schema);
console.log('Fixed models for multiSchema');
