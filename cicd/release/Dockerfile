FROM node:20-alpine as base
ENV TZ=Asia/Tokyo
WORKDIR /app
COPY .npmrc .
COPY tsconfig.build.json .
COPY .env .

FROM base as build
COPY package.deps.json package.json
COPY yarn.lock .
RUN yarn install
COPY package.json .
COPY src/ src/
RUN yarn build

FROM base
COPY tsconfig.start.json .
COPY package.prod.deps.json package.json
COPY yarn.lock .
RUN yarn install --prod
COPY prisma/ prisma/
RUN yarn prisma generate
COPY package.json .
COPY --from=build /app/dist /app/dist
CMD yarn start
