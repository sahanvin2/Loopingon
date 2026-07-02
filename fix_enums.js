const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

schema = schema.replace(/enum\s+([A-Za-z0-9_]+)\s*\{([^}]+)\}/g, (match, name, body) => {
  if (body.includes('@@schema')) return match;
  return `enum ${name} {${body}  @@schema("public")\n}`;
});

fs.writeFileSync('apps/server/prisma/schema.prisma', schema);
console.log('Fixed enums for multiSchema');
