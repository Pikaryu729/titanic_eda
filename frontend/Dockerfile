FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
COPY components.json ./
COPY next.config.ts ./

RUN npm install
RUN npm run build

FROM node:20-slim

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npx", "next", "start"]