# Base Node.js image
FROM node:18-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/admin/package.json ./apps/admin/package.json

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/packages/eslint-config/node_modules ./packages/eslint-config/node_modules
COPY --from=deps /app/packages/typescript-config/node_modules ./packages/typescript-config/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules

# Copy all source files
COPY . .

# Build the project
RUN pnpm build

# Production image, copy built app
FROM base AS web
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files for the web app
COPY --from=builder /app/apps/web/next.config.ts ./
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./node_modules

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start"]

# Admin app image
FROM base AS admin
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files for the admin app
COPY --from=builder /app/apps/admin/next.config.ts ./
COPY --from=builder /app/apps/admin/package.json ./
COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder /app/apps/admin/.next ./.next
COPY --from=builder /app/apps/admin/node_modules ./node_modules

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start"]
