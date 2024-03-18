FROM node:20-alpine
ENV TZ=Asia/Tokyo
# Add bash for running test scripts
RUN apk add --no-cache bash
WORKDIR /app
COPY . .
RUN yarn install

ENTRYPOINT [ "./vitest/scripts/docker-entrypoint.sh" ]
CMD yarn test
