FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/internship-service/ ./apps/internship-service/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter internship-service run build
RUN pnpm deploy --legacy --filter internship-service /tmp/deploy
RUN cp -r apps/internship-service/dist /tmp/deploy/dist

FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/deploy ./
EXPOSE 3001
CMD ["node", "dist/main"]