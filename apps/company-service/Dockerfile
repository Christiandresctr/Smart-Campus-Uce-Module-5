FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/company-service/ ./apps/company-service/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter company-service run build
RUN pnpm deploy --legacy --filter company-service /tmp/deploy
RUN cp -r apps/company-service/dist /tmp/deploy/dist

FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/deploy ./
EXPOSE 3006
CMD ["node", "dist/main"]