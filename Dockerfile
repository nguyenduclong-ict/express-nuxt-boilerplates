FROM node:16-alpine as builder

RUN npm i -g pnpm

COPY package.json .npmrc pnpm-lock.yaml ./

RUN pnpm install

WORKDIR /app

COPY . .

ARG NODE_ENV=production
COPY .env .
RUN yarn build && rm -rf node_modules

FROM builder

WORKDIR /app

ARG NODE_ENV=production

COPY --from=builder /app  .

RUN pnpm install --prod

ENV HOST 0.0.0.0
EXPOSE 3001

CMD [ "yarn", "start" ]
