# Build stage
FROM node:20-alpine AS builder

# 1. Install openssl (Required for Prisma on Alpine)
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 2. Copy package files AND the prisma schema first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/ 

# 3. Install dependencies
RUN pnpm install --no-frozen-lockfile

# 4. Generate Prisma Client (The files now exist, so this will succeed)
RUN npx prisma@6 generate

# 5. Copy remaining source code and build
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# 6. Install openssl here too (Required to run the client)
RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 7. Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# 8. Install only production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# 9. Re-generate for the production node_modules
RUN npx prisma generate

# 10. Copy built application
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]