FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

ARG DATABASE_URL
ARG AUTH_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]