# Install dependencies
FROM node:22.21-alpine as deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
RUN npm install -g --arch=x64 --platform=linux --libc=glibc sharp


# Build
FROM node:22.21-alpine as builder
WORKDIR /app

COPY . ./
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build


# Run
FROM node:22.21-alpine as runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env.production.local ./.env.local
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app/.env.local

USER nextjs

EXPOSE 3000
CMD [ "node", "server.js" ]
