# Multi-stage build: Astro static site → nginx
# Build context is the repo root (not wiki-site/) because copy-wiki.js
# reads ../wiki/ and runs `git log` for lastModified frontmatter.
#
# Build:   docker build -t config-wiki:staging .
# Run:     docker run --rm -p 8080:80 config-wiki:staging

FROM node:22-alpine AS deps
WORKDIR /app/wiki-site
COPY wiki-site/package.json wiki-site/package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY --from=deps /app/wiki-site/node_modules ./wiki-site/node_modules
COPY .git ./.git
COPY wiki ./wiki
COPY wiki-site ./wiki-site
ENV WIKI_BASE=/
ENV WIKI_SITE=http://config-wiki
WORKDIR /app/wiki-site
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/wiki-site/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
