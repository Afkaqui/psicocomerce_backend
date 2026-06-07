# ===========================
# Espacio Resiliente - Backend
# NestJS + Prisma 6
# ===========================

FROM node:22-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci
# Generate Prisma Client
RUN npx prisma generate

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Copy built app
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./
COPY --from=builder --chown=nestjs:nestjs /app/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
