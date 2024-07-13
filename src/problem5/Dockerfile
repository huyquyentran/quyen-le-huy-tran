# Use for build and development image.
FROM node:20.10.0-slim AS development

ARG CI=true

WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build
USER node


# Use for production image.
FROM node:20.10.0-slim AS production

ARG CI=true
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .
COPY --chown=node:node --from=development /app/dist ./dist

USER node

CMD ["node", "dist/index.js"]
