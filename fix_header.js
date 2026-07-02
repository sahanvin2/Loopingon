const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

const header = `generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions", "multiSchema"]
  binaryTargets   = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pg_trgm, pgcrypto, vector]
  schemas    = ["public", "auth"]
}

// ============ ENUMS ============

enum UserRole {
`;

schema = schema.replace('  SUPER_ADMIN\r\n  ADMIN\r\n  VENDOR\r\n  CUSTOMER', header + '  SUPER_ADMIN\r\n  ADMIN\r\n  VENDOR\r\n  CUSTOMER');
schema = schema.replace('  SUPER_ADMIN\n  ADMIN\n  VENDOR\n  CUSTOMER', header + '  SUPER_ADMIN\n  ADMIN\n  VENDOR\n  CUSTOMER');

fs.writeFileSync('apps/server/prisma/schema.prisma', schema);
console.log('Fixed header');
