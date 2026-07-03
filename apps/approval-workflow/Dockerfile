FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/approval-workflow/ ./apps/approval-workflow/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter approval-workflow run build
RUN pnpm deploy --legacy --filter approval-workflow /tmp/deploy
RUN cp -r apps/approval-workflow/dist /tmp/deploy/dist

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache chromium
COPY --from=build /tmp/deploy ./
EXPOSE 3003
CMD ["node", "dist/main"]