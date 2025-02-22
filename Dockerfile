FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies with caching
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build and test stage
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun test
RUN bun run database:generate

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/assets ./assets
COPY --from=builder /usr/src/app/package.json ./

USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "src/index.ts"]
