const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

schema = schema.replace(
  '  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]',
  '  previewFeatures = ["fullTextSearch", "postgresqlExtensions", "multiSchema"]'
);

schema = schema.replace(
  '  extensions = [pg_trgm, pgcrypto, vector]\n}',
  '  extensions = [pg_trgm, pgcrypto, vector]\n  schemas    = ["public", "auth"]\n}'
);

// Map all existing models to the "public" schema by default
schema = schema.replace(/@@map\("([a-z_]+)"\)/g, '@@map("$1")\n  @@schema("public")');

fs.writeFileSync('apps/server/prisma/schema.prisma', schema);
console.log('Schema configured for multiSchema successfully');
