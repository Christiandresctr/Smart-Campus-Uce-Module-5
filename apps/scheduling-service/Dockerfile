FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/scheduling-service/ ./apps/scheduling-service/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter scheduling-service run build
RUN pnpm deploy --legacy --filter scheduling-service /tmp/deploy
RUN cp -r apps/scheduling-service/dist /tmp/deploy/dist
FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/deploy ./
EXPOSE 3008
CMD ["node", "dist/main"]