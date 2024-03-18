FROM node:20-alpine as base
ENV TZ=Asia/Tokyo
WORKDIR /app
COPY .npmrc .
COPY tsconfig.build.json .
COPY .env .

FROM base as build
COPY yarn.lock package.json ./
COPY node_modules/ node_modules/
RUN yarn install
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
