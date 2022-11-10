#!/bin/bash

# **************** Global variables
export ROOT_PATH=$(pwd)
export IMAGE_NAME=nodejs-assistant-extension:v0.0.3
export URL=quay.io
export REPOSITORY=tsuedbroecker
export CONTAINER_RUNTIME=podman

$CONTAINER_RUNTIME login $URL
$CONTAINER_RUNTIME build -t "$URL/$REPOSITORY/$IMAGE_NAME" -f Dockerfile .
$CONTAINER_RUNTIME push "$URL/$REPOSITORY/$IMAGE_NAME"