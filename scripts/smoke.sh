#!/usr/bin/env bash

# name of docker image (built prior)
IMAGE_NAME="react-app-pr"
CONTAINER_NAME="smoke-test-container"
HOST_PORT=3000

# remove old container if exists
docker rm -f $CONTAINER_NAME || true

# run container
docker run -d --name $CONTAINER_NAME -p ${HOST_PORT}:80 $IMAGE_NAME

# wait a bit for server to start
sleep 5

# attempt to fetch homepage
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${HOST_PORT})

# cleanup container
docker rm -f $CONTAINER_NAME

if [ "$HTTP_STATUS" != "200" ]; then
  echo "Smoke test failed: HTTP status $HTTP_STATUS"
  exit 1
else
  echo "Smoke test passed: HTTP status $HTTP_STATUS"
  exit 0
fi
