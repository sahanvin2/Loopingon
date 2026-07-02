const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

// 1. Remove the accidental injection from User
schema = schema.replace(
  '  competitionEntries  CompetitionEntry[]\n  productInteractions ProductInteraction[]\n\n  auditLogs',
  '  competitionEntries  CompetitionEntry[]\n  auditLogs'
);

// 2. Add to Product model explicitly
schema = schema.replace(
  '  competitionEntries  CompetitionEntry[]\n\n  @@index([vendorId])',
  '  competitionEntries  CompetitionEntry[]\n  productInteractions ProductInteraction[]\n\n  @@index([vendorId])'
);

// 3. Add User relation to ProductInteraction
schema = schema.replace(
  '  session     TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  product     Product         @relation(fields: [productId], references: [id], onDelete: Cascade)',
  '  session     TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  product     Product         @relation(fields: [productId], references: [id], onDelete: Cascade)\n  user        User?           @relation(fields: [userId], references: [id], onDelete: SetNull)'
);

// 4. Add User relation to SearchQuery
schema = schema.replace(
  '  session      TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n\n  @@index([sessionId])',
  '  session      TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  user         User?           @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([sessionId])'
);

// 5. Also need to add ProductInteraction[] and SearchQuery[] to User model
schema = schema.replace(
  '  trackingSessions    TrackingSession[]\n\n  @@index([email])',
  '  trackingSessions    TrackingSession[]\n  productInteractions ProductInteraction[]\n  searchQueries       SearchQuery[]\n\n  @@index([email])'
);

fs.writeFileSync('apps/server/prisma/schema.prisma', schema);
console.log('Schema perfectly fixed!');
