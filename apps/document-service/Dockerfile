FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/document-service/ ./apps/document-service/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter document-service run build
RUN pnpm deploy --filter document-service /tmp/deploy
RUN cp -r apps/document-service/dist /tmp/deploy/dist

FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/deploy ./
EXPOSE 3002
CMD ["node", "dist/main"]