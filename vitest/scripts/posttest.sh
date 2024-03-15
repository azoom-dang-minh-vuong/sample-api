if [ "$NODE_ENV" != "test" ]; then
  exit 0
fi
set -e
export _CONTAINER_IMAGE_NAME="test-sample-api"
docker compose -f ./cicd/test/docker-compose.yaml down
rm -rf ./cicd/test/data
