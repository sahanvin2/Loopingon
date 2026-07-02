const fs = require('fs');
let schema = fs.readFileSync('apps/server/prisma/schema.prisma', 'utf8');

const userModelAppend = '\n  trackingSessions    TrackingSession[]\n';
schema = schema.replace('  supportReplies      SupportTicketReply[] @relation("ReplyUser")', '  supportReplies      SupportTicketReply[] @relation("ReplyUser")' + userModelAppend);

const newModels = `
// ==================== ANALYTICS & TRACKING ====================

model TrackingSession {
  id          String   @id @default(uuid())
  cookieId    String   @unique
  userId      String?
  deviceType  String?
  browser     String?
  os          String?
  country     String?
  ipAddress   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  pageVisits  PageVisit[]
  productInteractions ProductInteraction[]
  searchQueries SearchQuery[]

  @@index([cookieId])
  @@index([userId])
  @@map("tracking_sessions")
}

model PageVisit {
  id             String   @id @default(uuid())
  sessionId      String
  userId         String?
  path           String
  title          String?
  referrer       String?
  utmSource      String?
  utmMedium      String?
  utmCampaign    String?
  durationSeconds Int?     @default(0)
  maxScrollDepth Float?    @default(0)
  createdAt      DateTime @default(now())

  session        TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([path])
  @@index([createdAt])
  @@map("page_visits")
}

enum InteractionType {
  VIEW
  ADD_TO_CART
  REMOVE_FROM_CART
  PURCHASE
  WISHLIST
}

model ProductInteraction {
  id          String         @id @default(uuid())
  sessionId   String
  userId      String?
  productId   String
  type        InteractionType
  metadata    Json?
  createdAt   DateTime       @default(now())

  session     TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  product     Product         @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([productId])
  @@index([type])
  @@index([createdAt])
  @@map("product_interactions")
}

model SearchQuery {
  id           String   @id @default(uuid())
  sessionId    String
  userId       String?
  query        String
  resultsCount Int      @default(0)
  filters      Json?
  createdAt    DateTime @default(now())

  session      TrackingSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([query])
  @@index([createdAt])
  @@map("search_queries")
}
`;

fs.writeFileSync('apps/server/prisma/schema.prisma', schema + newModels);
console.log('Schema updated successfully');
