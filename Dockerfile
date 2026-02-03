# Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --no-frozen-lockfile

# Pass DIRECT_URL as build argument
ARG DIRECT_URL
ENV DIRECT_URL=${DIRECT_URL}

RUN npx prisma@6 db push

COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --prod --no-frozen-lockfile

# Re-generate / db push with build arg
ARG DIRECT_URL
ENV DIRECT_URL=${DIRECT_URL}

RUN npx prisma@6 db push

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
