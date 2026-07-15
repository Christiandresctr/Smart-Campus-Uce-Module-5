FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/audit-log-service/ ./apps/audit-log-service/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter audit-log-service run build
RUN pnpm deploy --legacy --filter audit-log-service /tmp/deploy
RUN cp -r apps/audit-log-service/dist /tmp/deploy/dist

FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/deploy ./
EXPOSE 3007
CMD ["node", "dist/main"]