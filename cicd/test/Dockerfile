FROM node:20-alpine
ENV TZ=Asia/Tokyo
# Add bash for running test scripts
RUN apk add --no-cache bash
WORKDIR /app
COPY .npmrc .
COPY package.deps.json package.json
COPY yarn.lock .
RUN yarn install
COPY . .

ENTRYPOINT [ "./vitest/scripts/docker-entrypoint.sh" ]
CMD yarn test
