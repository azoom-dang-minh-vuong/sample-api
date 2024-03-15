#!/bin/bash
set -e;
TEST_ENV=$(cat .env.test | grep -v '^NODE_ENV=' | grep -v '^DATABASE_URL=')
echo ${TEST_ENV} > .env.test
exec "$@"