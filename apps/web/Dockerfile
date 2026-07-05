FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --only=production

FROM base AS builder
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_BUILD_FETCH=true
ENV NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:8000"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy"
RUN npx turbo run build --filter=@kandyam/web

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public

RUN mkdir -p apps/web/.next
RUN chown nextjs:nodejs apps/web/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "apps/web/server.js"]
