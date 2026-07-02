FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++ openssl

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/server/package.json ./apps/server/
RUN npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run db:generate
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN chown -R appuser:nodejs /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/index.js"]
