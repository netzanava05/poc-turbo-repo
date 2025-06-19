# Base Node.js image
FROM node:18-alpine AS base

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/admin/package.json ./apps/admin/package.json

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy all source files
COPY . .

# Build all packages and apps
RUN pnpm turbo build --verbose || \
    (echo "=== Turbo build failed, using direct pnpm build ===" && \
     cd apps/web && pnpm run build && cd ../admin && pnpm run build)

# Web app production image
FROM node:18-alpine AS web
WORKDIR /app

# Install pnpm in production image
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy workspace configuration
COPY --chown=nextjs:nodejs package.json pnpm-workspace.yaml ./
COPY --chown=nextjs:nodejs apps/web/package.json ./apps/web/package.json

# Copy shared packages that web depends on
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Copy built web application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/next.config.ts ./apps/web/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter=web

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

CMD ["pnpm", "turbo", "start", "--filter=web"]

# Admin app production image
FROM node:18-alpine AS admin
WORKDIR /app

# Install pnpm in production image
ENV PNPM_HOME="/pnpm"  
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy workspace configuration
COPY --chown=nextjs:nodejs package.json pnpm-workspace.yaml turbo.json ./
COPY --chown=nextjs:nodejs apps/admin/package.json ./apps/admin/package.json

# Copy shared packages
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/next.config.ts ./apps/admin/
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/package.json ./apps/admin/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter=admin

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

CMD ["pnpm", "turbo", "start", "--filter=admin"]