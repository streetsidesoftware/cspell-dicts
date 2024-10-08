# syntax=docker/dockerfile:1
FROM node:14.21.3-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY . .
RUN pnpm install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
